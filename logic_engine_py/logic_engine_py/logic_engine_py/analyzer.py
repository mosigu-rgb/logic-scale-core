"""
LogicScale Neural Engine v4.0
analyzer.py — Core logic functions. Calls Anthropic API, applies scoring formula,
               computes weight_delta, builds structured JSON output.
"""

import json
import re
import math
from datetime import datetime, timezone
from typing   import Optional


# ── Scoring constants ─────────────────────────────────────────────────────────
SCORE_BASE    = 2.5
SCORE_FLOOR   = 0.5
SCORE_CEILING = 5.0

BONUSES = {
    "empirical_evidence":           +1.00,
    "clear_premise_to_conclusion":  +0.75,
    "anticipates_counterargument":  +0.50,
    "correct_analogy":              +0.25,
}

PENALTIES = {
    # Standard fallacies
    "circular_reasoning":           -1.00,
    "ad_hominem":                   -0.75,
    "straw_man":                    -1.00,
    "false_dichotomy":              -0.75,
    "appeal_to_emotion":            -0.50,
    "hasty_generalization":         -0.50,
    "slippery_slope":               -0.50,
    "appeal_to_popularity":         -0.50,
    # Advanced fallacies (v4.0)
    "motte_and_bailey":             -1.25,
    "overton_manipulation":         -1.00,
    "epistemic_cowardice":          -0.75,
    "isolated_demand_for_rigor":    -0.90,
    "kafka_trap":                   -1.50,
}

# Expected logic_score per skill level (used for surprise_factor)
SKILL_BASELINE = {
    "beginner":     2.0,
    "intermediate": 2.8,
    "advanced":     3.5,
    "expert":       4.2,
}

# Vocabulary tiers by age
def vocab_tier(age: int) -> str:
    if age < 14:  return "elementary"
    if age < 18:  return "secondary"
    return "university"

VOCAB_INSTRUCTIONS = {
    "elementary":  (
        "Use ONLY simple, everyday language a middle-school student understands. "
        "NO Latin terms, NO academic jargon. Explain everything with relatable analogies "
        "(school, friends, sports, games). Never use words like 'fallacy', 'rhetoric', "
        "'premise', 'epistemology', 'syllogism'."
    ),
    "secondary":   (
        "Use standard high-school vocabulary. You MAY introduce debate terms but "
        "briefly define each one in parentheses on first use. Reference current events "
        "and pop culture as examples. Avoid heavy academic jargon."
    ),
    "university":  (
        "Use full academic and philosophical vocabulary without scaffolding. "
        "Name logical fallacies by their formal Latin names (e.g. 'ad hominem', "
        "'petitio principii'). Reference philosophical works, statistical reasoning, "
        "epistemology, and formal logic notation where appropriate."
    ),
}


class LogicAnalyzer:
    """
    Core analysis class. Builds prompt, calls Anthropic Claude,
    parses response, validates JSON, saves to DB.
    """

    def __init__(self, settings: dict):
        self.settings = settings
        self._init_client()

    def _init_client(self):
        try:
            import anthropic
            self.client = anthropic.Anthropic(api_key=self.settings["anthropic_api_key"])
        except ImportError:
            raise RuntimeError(
                "anthropic package not installed.\n"
                "  pip install anthropic\n"
                "  pip install anthropic flask flask-cors rich"
            )

    # ── public method ──────────────────────────────────────────────────────────
    def audit(
        self,
        argument: str,
        age:      int  = 17,
        skill:    str  = "intermediate",
        session:  int  = 1,
        region:   str  = "unknown",
        topic:    str  = "general",
    ) -> dict:
        """
        Run a full neural audit on the argument.
        Returns the complete structured JSON result.
        """
        tier     = vocab_tier(age)
        recency  = self._recency_factor(session)
        expected = SKILL_BASELINE.get(skill, 2.8)

        system_prompt = self._build_system(tier, skill, expected, recency, session)
        user_prompt   = self._build_user(argument, age, skill, session, tier)

        raw = self._call_api(system_prompt, user_prompt)
        result = self._parse_response(raw)

        # Inject metadata that the LLM doesn't know
        result.setdefault("neural_meta", {}).update({
            "engine_version": self.settings.get("engine_version", "4.0.2-adversarial"),
            "user_age":       age,
            "skill_level":    skill,
            "vocabulary_tier": tier,
            "session_number": session,
            "region":         region,
            "topic":          topic,
            "timestamp":      datetime.now(timezone.utc).isoformat(),
        })
        result["_raw_argument"] = argument

        # Local validation / re-calculation as safety net
        result = self._validate_scores(result, age, skill, session)
        return result

    # ── prompt builders ────────────────────────────────────────────────────────
    def _build_system(
        self, tier: str, skill: str, expected: float,
        recency: float, session: int
    ) -> str:
        penalties_block = "\n".join(
            f"  {k:<38} {v:+.2f}" for k, v in PENALTIES.items()
        )
        bonuses_block = "\n".join(
            f"  {k:<38} {v:+.2f}" for k, v in BONUSES.items()
        )
        vocab_instr = VOCAB_INSTRUCTIONS[tier]

        return f"""You are LogicScale Neural Engine v4.0 — the core reasoning module of DebateCoach's adversarial simulation.

ARCHITECTURE: core.py orchestrates flow → analyzer.py (you) → simulation_results.json knowledge base.

═══════════════════════════════════════════════
LOGIC_SCORE FORMULA  (scale: 0.0 – 5.0)
═══════════════════════════════════════════════
base_score = {SCORE_BASE}

BONUSES — add to base if the argument clearly demonstrates:
{bonuses_block}

PENALTIES — subtract per detected fallacy (penalties are cumulative):
{penalties_block}

After summing: CLAMP to [{SCORE_FLOOR}, {SCORE_CEILING}]
Be STRICT. Reserve 5.0 for near-perfect formal logic with solid evidence.
A score of 3.0 means adequate but flawed. Below 2.0 means the argument fails logically.

═══════════════════════════════════════════════
WEIGHT_DELTA FORMULA  (0.01 – 0.30)
═══════════════════════════════════════════════
Expected score for skill level "{skill}" = {expected:.1f}
surprise_factor    = |{expected:.1f} - actual_logic_score| / 5.0
recency_factor     = {recency:.2f}  (session {session})
consistency_factor = 1.0 normally; use 1.5 if argument repeats a pattern of the SAME fallacy type
weight_delta       = CLAMP(surprise × recency × consistency, 0.01, 0.30)

═══════════════════════════════════════════════
VOCABULARY RULE  (tier: {tier})
═══════════════════════════════════════════════
{vocab_instr}

═══════════════════════════════════════════════
SYNTHETIC TWIN
═══════════════════════════════════════════════
Rewrite the argument to be maximally logically sound:
- Remove every fallacy and replace with valid reasoning
- Establish a clear premise → evidence → conclusion chain
- Include at least one plausible, specific evidence reference
- Keep the same core position / claim

═══════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════
Respond with VALID JSON ONLY. Zero text before or after. No markdown. No code fences.
Every field in the schema below is REQUIRED.
"""

    def _build_user(
        self, argument: str, age: int, skill: str, session: int, tier: str
    ) -> str:
        schema = {
            "neural_meta": {
                "status": "processing_complete",
                "engine_iteration": "4.0.2-adversarial",
                "vocabulary_tier": tier,
                "session_number": session
            },
            "analysis": {
                "logic_score": "<float 0.0–5.0>",
                "score_breakdown": {
                    "base": SCORE_BASE,
                    "bonuses_applied": [
                        {"criterion": "<name>", "delta": "<+float>", "present": "<bool>"}
                    ],
                    "penalties_applied": [
                        {"criterion": "<fallacy_name>", "delta": "<-float>", "applied": "<bool>"}
                    ],
                    "raw_sum": "<float>",
                    "clamped_final": "<float>"
                },
                "argument_quality": "<strong|adequate|weak|fallacious>",
                "fallacies": [
                    {
                        "type": "<snake_case_name>",
                        "latin_name": "<string or null>",
                        "severity": "<low|medium|high|critical>",
                        "confidence": "<float 0.0–1.0>",
                        "penalty_applied": "<negative float>",
                        "excerpt": "<exact phrase from argument>",
                        "explanation": f"<{tier}-vocabulary explanation>",
                        "how_to_fix": "<concrete actionable fix>"
                    }
                ],
                "cognitive_biases": [
                    {
                        "type": "<bias_name>",
                        "severity": "<mild|moderate|severe>",
                        "explanation": f"<{tier}-vocabulary note>"
                    }
                ],
                "synthetic_twin": "<optimized argument rewrite>",
                "twin_improvements": ["<change 1>", "<change 2>", "<change 3>"],
                "twin_estimated_score": "<float>",
                "weight_delta": "<float 0.01–0.30>",
                "weight_delta_breakdown": {
                    "surprise_factor": "<float>",
                    "recency_factor": "<float>",
                    "consistency_factor": "<float>",
                    "formula": "surprise × recency × consistency → clamped"
                }
            },
            "coaching_output": {
                "rebuttal": f"<{tier}-vocabulary coaching rebuttal, 3-4 sentences>",
                "primary_tip": f"<single most important improvement, {tier} vocabulary>",
                "drill_recommended": "<best next training exercise>"
            },
            "engineering_note": "<exactly 1 technical sentence: why this score, referencing the formula>"
        }

        return (
            f'ARGUMENT_INPUT: "{argument}"\n\n'
            f'SESSION_CONTEXT: {{"user_age": {age}, "skill_level": "{skill}", '
            f'"session_number": {session}, "vocabulary_tier": "{tier}"}}\n\n'
            f'Return this JSON structure with all fields populated:\n'
            f'{json.dumps(schema, indent=2)}'
        )

    # ── API call ───────────────────────────────────────────────────────────────
    def _call_api(self, system: str, user: str) -> str:
        response = self.client.messages.create(
            model      = self.settings.get("model", "claude-sonnet-4-20250514"),
            max_tokens = self.settings.get("max_tokens", 2000),
            system     = system,
            messages   = [{"role": "user", "content": user}],
        )
        return response.content[0].text

    # ── response parser ────────────────────────────────────────────────────────
    def _parse_response(self, raw: str) -> dict:
        """Extract and parse JSON from model response, with fallback."""
        # Strip markdown fences if present
        raw = re.sub(r"^```(?:json)?\s*", "", raw.strip())
        raw = re.sub(r"\s*```$", "", raw)

        # Try direct parse
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            pass

        # Try extracting first { ... } block
        match = re.search(r"\{[\s\S]*\}", raw)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass

        # Last resort: return error structure
        return {
            "neural_meta": {"status": "parse_error"},
            "analysis": {
                "logic_score": 0.0,
                "argument_quality": "unknown",
                "fallacies": [],
                "cognitive_biases": [],
                "synthetic_twin": "",
                "weight_delta": 0.01,
            },
            "engineering_note": "Parse error — raw response could not be decoded as JSON.",
            "_parse_error": True,
            "_raw_response": raw[:500],
        }

    # ── validation / safety net ────────────────────────────────────────────────
    def _validate_scores(self, result: dict, age: int, skill: str, session: int) -> dict:
        """
        Safety net: recalculate logic_score and weight_delta locally
        to catch hallucinated out-of-range values.
        """
        a = result.get("analysis", {})

        # Clamp logic_score
        ls = float(a.get("logic_score", SCORE_BASE))
        ls = max(SCORE_FLOOR, min(SCORE_CEILING, ls))
        a["logic_score"] = round(ls, 2)

        # Recalculate weight_delta
        expected    = SKILL_BASELINE.get(skill, 2.8)
        recency     = self._recency_factor(session)
        surprise    = abs(expected - ls) / 5.0
        consistency = float(
            a.get("weight_delta_breakdown", {}).get("consistency_factor", 1.0)
        )
        delta = surprise * recency * consistency
        delta = max(0.01, min(0.30, delta))
        a["weight_delta"] = round(delta, 3)

        # Update breakdown
        a.setdefault("weight_delta_breakdown", {}).update({
            "surprise_factor":    round(surprise, 3),
            "recency_factor":     round(recency, 2),
            "consistency_factor": round(consistency, 2),
        })

        # Quality label from score
        if ls >= 4.0:   a["argument_quality"] = "strong"
        elif ls >= 3.0: a["argument_quality"] = "adequate"
        elif ls >= 2.0: a["argument_quality"] = "weak"
        else:           a["argument_quality"] = "fallacious"

        result["analysis"] = a
        return result

    @staticmethod
    def _recency_factor(session: int) -> float:
        """Recency weight: early sessions count less (profile still forming)."""
        if session <= 3:  return 0.80
        if session <= 10: return 1.00
        return 1.20
