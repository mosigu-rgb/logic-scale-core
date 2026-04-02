"""
LogicScale Neural Engine v4.0
core.py — Main orchestrator. Handles CLI, API server, and data flow.

Usage:
    python core.py analyze "Your argument here" --age 17 --skill intermediate
    python core.py server                        # Start REST API on port 5000
    python core.py stats                         # Print analytics report
    python core.py export --format csv           # Export data
"""

import argparse
import json
import sys
import os
from datetime import datetime
from pathlib import Path

# ── project imports ──────────────────────────────────────────────────────────
from analyzer import LogicAnalyzer
from database import AnalysisDB
from analytics import Analytics


# ── constants ─────────────────────────────────────────────────────────────────
PROJECT_ROOT  = Path(__file__).parent
DB_PATH       = PROJECT_ROOT / "data" / "simulation_results.db"
SETTINGS_PATH = PROJECT_ROOT / "engine_settings.json"
LOG_DIR       = PROJECT_ROOT / "logs"


def load_settings() -> dict:
    """Load engine_settings.json with fallback defaults."""
    defaults = {
        "engine_version":          "4.0.2-adversarial",
        "anthropic_api_key":       os.environ.get("ANTHROPIC_API_KEY", ""),
        "model":                   "claude-sonnet-4-20250514",
        "max_tokens":              2000,
        "score_floor":             0.5,
        "score_ceiling":           5.0,
        "weight_delta_min":        0.01,
        "weight_delta_max":        0.30,
        "bias_shield_threshold":   0.65,   # confidence below this → bias not flagged
        "precision_mode":          "strict",
        "log_all_audits":          True,
        "analytics_region_field":  "country",
    }
    if SETTINGS_PATH.exists():
        with open(SETTINGS_PATH) as f:
            return {**defaults, **json.load(f)}
    # Write defaults on first run
    SETTINGS_PATH.write_text(json.dumps(defaults, indent=2))
    print(f"[core] Created engine_settings.json at {SETTINGS_PATH}")
    return defaults


# ── CLI entry point ────────────────────────────────────────────────────────────
def cli():
    parser = argparse.ArgumentParser(
        prog="logicscale",
        description="LogicScale Neural Engine v4.0 — Adversarial Argument Analyzer"
    )
    sub = parser.add_subparsers(dest="command")

    # ── analyze ──
    p_analyze = sub.add_parser("analyze", help="Analyze a single argument")
    p_analyze.add_argument("argument",          type=str,   help="The argument text to analyze")
    p_analyze.add_argument("--age",             type=int,   default=17,            help="User age (11-25)")
    p_analyze.add_argument("--skill",           type=str,   default="intermediate",
                           choices=["beginner","intermediate","advanced","expert"])
    p_analyze.add_argument("--session",         type=int,   default=1,             help="Session number")
    p_analyze.add_argument("--region",          type=str,   default="unknown",     help="User region/country")
    p_analyze.add_argument("--topic",           type=str,   default="general",     help="Debate topic")
    p_analyze.add_argument("--raw",             action="store_true",               help="Print raw JSON only")

    # ── server ──
    p_server = sub.add_parser("server", help="Start REST API server")
    p_server.add_argument("--port",  type=int, default=5000)
    p_server.add_argument("--host",  type=str, default="127.0.0.1")
    p_server.add_argument("--debug", action="store_true")

    # ── stats ──
    sub.add_parser("stats", help="Print analytics dashboard")

    # ── export ──
    p_export = sub.add_parser("export", help="Export data")
    p_export.add_argument("--format", choices=["csv","json"], default="csv")
    p_export.add_argument("--out",    type=str, default="export")

    args = parser.parse_args()

    if args.command is None:
        parser.print_help()
        return

    settings = load_settings()
    db       = AnalysisDB(DB_PATH)

    if args.command == "analyze":
        run_analyze(args, settings, db)
    elif args.command == "server":
        run_server(args, settings, db)
    elif args.command == "stats":
        run_stats(db)
    elif args.command == "export":
        run_export(args, db)


# ── analyze command ────────────────────────────────────────────────────────────
def run_analyze(args, settings: dict, db: "AnalysisDB"):
    from rich.console import Console
    from rich.panel   import Panel
    from rich.table   import Table
    from rich         import print as rprint
    console = Console()

    if not settings["anthropic_api_key"]:
        console.print("[red]ERROR:[/red] Set ANTHROPIC_API_KEY environment variable.")
        console.print("  export ANTHROPIC_API_KEY='sk-ant-...'")
        sys.exit(1)

    console.print(f"\n[bold green]⬡ LogicScale Neural Engine v4.0[/bold green]")
    console.print(f"[dim]Analyzing argument for age={args.age}, skill={args.skill}, session={args.session}[/dim]\n")

    analyzer = LogicAnalyzer(settings)

    with console.status("[green]Running neural audit…[/green]"):
        result = analyzer.audit(
            argument = args.argument,
            age      = args.age,
            skill    = args.skill,
            session  = args.session,
            region   = args.region,
            topic    = args.topic,
        )

    if args.raw:
        print(json.dumps(result, indent=2))
        return

    # ── Pretty print ──
    a = result["analysis"]

    # Score panel
    score = a["logic_score"]
    score_color = "green" if score >= 4 else "cyan" if score >= 3 else "yellow" if score >= 2 else "red"
    console.print(Panel(
        f"[bold {score_color}]{score:.2f} / 5.00[/bold {score_color}]  —  [{score_color}]{a['argument_quality'].upper()}[/{score_color}]",
        title="[bold]LOGIC_SCORE[/bold]",
        border_style=score_color
    ))

    # Fallacies table
    fallacies = a.get("fallacies", [])
    if fallacies:
        t = Table(title="Detected Fallacies", border_style="red")
        t.add_column("Type",      style="yellow")
        t.add_column("Severity",  style="red")
        t.add_column("Confidence")
        t.add_column("Penalty",   style="red")
        t.add_column("Excerpt",   style="dim", max_width=40)
        for f in fallacies:
            t.add_row(
                f["type"].replace("_"," ").title(),
                f.get("severity","?").upper(),
                f"{f.get('confidence',0):.0%}",
                str(f.get("penalty_applied","")),
                f.get("excerpt","")[:40]
            )
        console.print(t)
    else:
        console.print("[green]✓ No logical fallacies detected[/green]")

    # Weight delta
    wd = a.get("weight_delta_breakdown", {})
    console.print(f"\n[bold]weight_delta:[/bold] [yellow]{a.get('weight_delta',0):.3f}[/yellow]  "
                  f"(surprise={wd.get('surprise_factor',0):.3f} × "
                  f"recency={wd.get('recency_factor',0):.2f} × "
                  f"consistency={wd.get('consistency_factor',0):.2f})")

    # Synthetic twin
    console.print(Panel(
        f"[italic cyan]{a.get('synthetic_twin','—')}[/italic cyan]",
        title="[bold]SYNTHETIC TWIN[/bold]",
        border_style="cyan"
    ))

    # Engineering note
    console.print(Panel(
        result.get("engineering_note","—"),
        title="[bold]ENGINEERING NOTE[/bold]",
        border_style="blue"
    ))

    # Coaching tip
    tip = result.get("coaching_output",{}).get("primary_tip","")
    if tip:
        console.print(f"\n[bold green]💡 Primary Tip:[/bold green] {tip}")

    # Save to DB
    db.save(result)
    console.print(f"\n[dim]Saved to {DB_PATH}[/dim]")


# ── server command ─────────────────────────────────────────────────────────────
def run_server(args, settings: dict, db: "AnalysisDB"):
    try:
        from flask      import Flask, request, jsonify
        from flask_cors import CORS
    except ImportError:
        print("ERROR: Flask not installed.")
        print("  pip install flask flask-cors")
        sys.exit(1)

    app = Flask(__name__)
    CORS(app)
    analyzer = LogicAnalyzer(settings)

    @app.route("/health")
    def health():
        return jsonify({"status": "online", "engine": "LogicScale v4.0"})

    @app.route("/analyze", methods=["POST"])
    def analyze():
        data = request.get_json()
        if not data or "argument" not in data:
            return jsonify({"error": "Missing 'argument' field"}), 400
        result = analyzer.audit(
            argument = data["argument"],
            age      = int(data.get("age", 17)),
            skill    = data.get("skill", "intermediate"),
            session  = int(data.get("session", 1)),
            region   = data.get("region", "unknown"),
            topic    = data.get("topic", "general"),
        )
        db.save(result)
        return jsonify(result)

    @app.route("/stats", methods=["GET"])
    def stats():
        ana = Analytics(db)
        return jsonify(ana.full_report())

    @app.route("/stats/region", methods=["GET"])
    def stats_region():
        ana = Analytics(db)
        return jsonify(ana.by_region())

    @app.route("/stats/age", methods=["GET"])
    def stats_age():
        ana = Analytics(db)
        return jsonify(ana.by_age_group())

    @app.route("/stats/fallacies", methods=["GET"])
    def stats_fallacies():
        ana = Analytics(db)
        return jsonify(ana.fallacy_frequency())

    @app.route("/history", methods=["GET"])
    def history():
        limit = int(request.args.get("limit", 50))
        return jsonify(db.recent(limit))

    print(f"\n⬡  LogicScale API running on http://{args.host}:{args.port}")
    print(f"   POST /analyze    → run audit")
    print(f"   GET  /stats      → full analytics")
    print(f"   GET  /stats/region, /stats/age, /stats/fallacies")
    print(f"   GET  /health\n")
    app.run(host=args.host, port=args.port, debug=args.debug)


# ── stats command ──────────────────────────────────────────────────────────────
def run_stats(db: "AnalysisDB"):
    try:
        from rich.console import Console
        from rich.table   import Table
    except ImportError:
        ana = Analytics(db)
        print(json.dumps(ana.full_report(), indent=2))
        return

    console = Console()
    ana     = Analytics(db)
    report  = ana.full_report()

    console.print("\n[bold green]⬡ LogicScale Analytics Dashboard[/bold green]\n")

    overview = report.get("overview", {})
    console.print(f"  Total audits:        [bold]{overview.get('total_audits',0)}[/bold]")
    console.print(f"  Avg logic_score:     [bold yellow]{overview.get('avg_logic_score',0):.2f}[/bold yellow] / 5.0")
    console.print(f"  Avg weight_delta:    [bold cyan]{overview.get('avg_weight_delta',0):.3f}[/bold cyan]")
    console.print(f"  Most common fallacy: [bold red]{overview.get('top_fallacy','none')}[/bold red]\n")

    # By region
    region_data = report.get("by_region", [])
    if region_data:
        t = Table(title="By Region", border_style="blue")
        t.add_column("Region");  t.add_column("Audits"); t.add_column("Avg Score"); t.add_column("Top Fallacy")
        for row in region_data[:10]:
            t.add_row(row["region"], str(row["count"]),
                      f"{row['avg_score']:.2f}", row.get("top_fallacy","—"))
        console.print(t)

    # By age group
    age_data = report.get("by_age_group", [])
    if age_data:
        t = Table(title="By Age Group", border_style="cyan")
        t.add_column("Age Group"); t.add_column("Audits"); t.add_column("Avg Score"); t.add_column("Avg Delta")
        for row in age_data:
            t.add_row(row["age_group"], str(row["count"]),
                      f"{row['avg_score']:.2f}", f"{row['avg_delta']:.3f}")
        console.print(t)


# ── export command ─────────────────────────────────────────────────────────────
def run_export(args, db: "AnalysisDB"):
    ana  = Analytics(db)
    data = db.all_records()
    out  = Path(args.out)

    if args.format == "csv":
        import csv
        path = out.with_suffix(".csv")
        keys = ["id","timestamp","user_age","skill_level","region","topic",
                "logic_score","argument_quality","weight_delta","fallacy_count","argument_text"]
        with open(path, "w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=keys, extrasaction="ignore")
            w.writeheader()
            w.writerows(data)
        print(f"Exported {len(data)} records → {path}")

    elif args.format == "json":
        path = out.with_suffix(".json")
        path.write_text(json.dumps(data, indent=2, default=str))
        print(f"Exported {len(data)} records → {path}")


if __name__ == "__main__":
    cli()
