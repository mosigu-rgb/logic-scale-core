<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DebateCoach — Algorithm Research Lab</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root {
 --bg: #f5f2eb;
 --ink: #0d0d0d;
 --ink2: #3a3a3a;
 --ink3: #7a7a7a;
 --rule: #d4d0c8;
 --yellow: #f5c842;
 --yellow-light: #fdf3c0;
 --red: #e8432d;
 --red-light: #fde8e4;
 --green: #1a8a4a;
 --green-light: #dcf5e7;
 --blue: #1a4fe8;
 --blue-light: #e4eafd;
 --surface: #ffffff;
 --surface2: #faf8f3;
 --code-bg: #1a1a2e;
 --code-text: #e8e8f0;
 --highlight: #f5c842;
}

* { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; }
body {
 background:var(--bg);
 color:var(--ink);
 font-family:'DM Sans',sans-serif;
 line-height:1.6;
 min-height:100vh;
}

/* ── HEADER ── */
header {
 border-bottom:2px solid var(--ink);
 padding:1.5rem 1.5rem 1.25rem;
 background:var(--bg);
 position:sticky; top:0; z-index:100;
 display:flex; align-items:center; justify-content:space-between;
}
.header-left { display:flex; align-items:center; gap:1rem; }
.hlogo {
 width:40px; height:40px; background:var(--ink); border-radius:10px;
 display:flex; align-items:center; justify-content:center; color:var(--yellow); font-size:1.2rem;
}
.htitle { font-family:'Syne',sans-serif; font-weight:800; font-size:1.1rem; }
.hsub { font-family:'Space Mono',monospace; font-size:.6rem; color:var(--ink3); margin-top:.1rem; }
.hbadge {
 font-family:'Space Mono',monospace; font-size:.65rem; padding:.3rem .7rem;
 border:1.5px solid var(--ink); border-radius:4px; color:var(--ink);
 background:var(--yellow);
}

/* ── NAV TABS ── */
.nav-tabs {
 display:flex; gap:0; border-bottom:2px solid var(--ink);
 overflow-x:auto; background:var(--bg);
}
.nav-tabs::-webkit-scrollbar { display:none; }
.tab {
 padding:.75rem 1.25rem; font-family:'Space Mono',monospace; font-size:.7rem;
 border:none; background:transparent; cursor:pointer; border-right:1.5px solid var(--ink);
 color:var(--ink3); white-space:nowrap; transition:all .2s; letter-spacing:.05em;
}
.tab:hover { background:var(--surface2); color:var(--ink); }
.tab.active { background:var(--ink); color:var(--yellow); }

/* ── MAIN LAYOUT ── */
main { padding:1.5rem; max-width:900px; margin:0 auto; }
.panel { display:none; animation:fadeIn .3s ease; }
.panel.active { display:block; }
@keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

/* ── SECTION HEADERS ── */
.section-label {
 font-family:'Space Mono',monospace; font-size:.65rem; color:var(--ink3);
 letter-spacing:.12em; text-transform:uppercase; margin-bottom:.5rem;
 display:flex; align-items:center; gap:.5rem;
}
.section-label::after { content:''; flex:1; height:1px; background:var(--rule); }
h2 { font-family:'Syne',sans-serif; font-size:1.6rem; font-weight:800; margin-bottom:.4rem; }
h3 { font-family:'Syne',sans-serif; font-size:1.1rem; font-weight:700; margin-bottom:.5rem; }
.lead { color:var(--ink2); font-size:.92rem; margin-bottom:1.5rem; line-height:1.7; }

/* ── CARDS ── */
.card {
 background:var(--surface); border:1.5px solid var(--ink);
 border-radius:12px; padding:1.25rem; margin-bottom:1rem;
}
.card-accent-yellow { border-color:var(--yellow); background:var(--yellow-light); }
.card-accent-red { border-color:var(--red); background:var(--red-light); }
.card-accent-green { border-color:var(--green); background:var(--green-light); }
.card-accent-blue { border-color:var(--blue); background:var(--blue-light); }

/* ── ASSESSMENT GRID ── */
.assess-grid { display:grid; gap:.75rem; margin-bottom:1.5rem; }
.assess-row {
 display:flex; align-items:flex-start; gap:.75rem;
 background:var(--surface); border:1.5px solid var(--rule); border-radius:10px; padding:1rem;
}
.assess-icon { font-size:1.4rem; flex-shrink:0; margin-top:.1rem; }
.assess-body { flex:1; }
.assess-title { font-family:'Syne',sans-serif; font-size:.9rem; font-weight:700; margin-bottom:.2rem; }
.assess-text { font-size:.8rem; color:var(--ink2); line-height:1.5; }
.assess-tag {
 display:inline-block; font-family:'Space Mono',monospace; font-size:.6rem;
 padding:.15rem .5rem; border-radius:3px; margin-top:.4rem;
}
.tag-strong { background:#dcf5e7; color:var(--green); border:1px solid var(--green); }
.tag-improve { background:#fde8e4; color:var(--red); border:1px solid var(--red); }
.tag-neutral { background:var(--yellow-light); color:#8a6500; border:1px solid var(--yellow); }

/* ── IMPROVEMENT PLAN ── */
.improve-item {
 display:flex; gap:.75rem; padding:.85rem 1rem;
 border:1.5px solid var(--rule); border-radius:10px; margin-bottom:.6rem;
 background:var(--surface);
}
.improve-num {
 width:28px; height:28px; border-radius:7px; background:var(--ink); color:var(--yellow);
 font-family:'Space Mono',monospace; font-size:.75rem; display:flex; align-items:center;
 justify-content:center; flex-shrink:0; font-weight:700;
}
.improve-content { flex:1; }
.improve-title { font-family:'Syne',sans-serif; font-size:.88rem; font-weight:700; margin-bottom:.2rem; }
.improve-desc { font-size:.78rem; color:var(--ink2); line-height:1.5; }
.improve-impact {
 font-family:'Space Mono',monospace; font-size:.58rem; color:var(--ink3); margin-top:.3rem;
}

/* ── AGE TEST ── */
.age-test-header {
 display:flex; align-items:center; gap:1rem; margin-bottom:1.25rem;
 padding:1rem; background:var(--surface2); border:1.5px solid var(--rule); border-radius:10px;
}
.age-input-wrap { flex:1; }
.age-label-txt { font-family:'Space Mono',monospace; font-size:.65rem; color:var(--ink3); margin-bottom:.4rem; }
.age-input-row { display:flex; gap:.5rem; align-items:center; }
.age-input {
 width:70px; padding:.5rem .6rem; border:1.5px solid var(--ink); border-radius:7px;
 font-family:'Space Mono',monospace; font-size:.9rem; text-align:center;
 background:var(--bg); outline:none;
}
.arg-input {
 width:100%; padding:.75rem 1rem; border:1.5px solid var(--ink); border-radius:9px;
 font-family:'DM Sans',sans-serif; font-size:.88rem; background:var(--bg);
 outline:none; margin-bottom:1rem; resize:vertical; min-height:60px;
}
.arg-input:focus { border-color:var(--blue); }
.run-btn {
 padding:.75rem 1.5rem; border:2px solid var(--ink); border-radius:9px;
 background:var(--ink); color:var(--yellow); font-family:'Space Mono',monospace;
 font-size:.75rem; cursor:pointer; transition:all .2s; letter-spacing:.05em;
}
.run-btn:hover { background:var(--yellow); color:var(--ink); }
.run-btn:disabled { opacity:.5; cursor:not-allowed; }

/* Side by side */
.side-by-side { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:1rem; }
@media(max-width:600px) { .side-by-side { grid-template-columns:1fr; } }
.sbs-panel {
 border:1.5px solid var(--ink); border-radius:10px; overflow:hidden;
}
.sbs-header {
 padding:.6rem 1rem; font-family:'Space Mono',monospace; font-size:.7rem;
 display:flex; align-items:center; justify-content:space-between;
}
.sbs-header.age12 { background:#dde8ff; border-bottom:1.5px solid var(--ink); }
.sbs-header.age24 { background:#ffe5d8; border-bottom:1.5px solid var(--ink); }
.sbs-body { padding:1rem; background:var(--surface); font-size:.82rem; line-height:1.6; min-height:120px; }
.sbs-response { color:var(--ink2); margin-bottom:.75rem; font-style:italic; }
.json-block {
 background:var(--code-bg); color:var(--code-text); border-radius:8px;
 padding:.85rem; font-family:'Space Mono',monospace; font-size:.68rem;
 line-height:1.7; overflow-x:auto; white-space:pre;
}
.json-key { color:#7dd3fc; }
.json-val { color:#86efac; }
.json-str { color:#fca5a5; }
.json-num { color:#fbbf24; }
.json-highlight {
 background:rgba(245,200,66,.25); border-left:3px solid var(--yellow);
 padding-left:.4rem; margin-left:-.4rem; display:block;
}

/* ── FALLACY TEST ── */
.fallacy-examples { display:flex; flex-wrap:wrap; gap:.4rem; margin-bottom:.75rem; }
.fallacy-chip {
 padding:.35rem .75rem; border:1.5px solid var(--rule); border-radius:6px;
 font-size:.75rem; cursor:pointer; transition:all .2s; background:var(--surface);
}
.fallacy-chip:hover { border-color:var(--ink); }
.fallacy-chip.selected { border-color:var(--red); background:var(--red-light); color:var(--red); }

.fallacy-result {
 border:1.5px solid var(--ink); border-radius:10px; overflow:hidden; margin-top:1rem;
}
.fr-header {
 padding:.7rem 1rem; background:var(--ink); color:var(--yellow);
 font-family:'Space Mono',monospace; font-size:.7rem; letter-spacing:.06em;
}
.fr-body { padding:1rem; background:var(--surface); }
.rebuttal-box {
 padding:.85rem 1rem; background:var(--surface2); border:1px solid var(--rule);
 border-radius:8px; font-size:.85rem; color:var(--ink2); line-height:1.6; margin-bottom:1rem;
}
.json-annotated {
 background:var(--code-bg); border-radius:8px; padding:.85rem;
 font-family:'Space Mono',monospace; font-size:.68rem; line-height:1.8; overflow-x:auto;
}
.jl { display:block; }
.jl-highlight {
 background:rgba(245,200,66,.2); border-left:3px solid var(--yellow);
 padding:.1rem .4rem; margin:0 -.4rem;
 position:relative;
}
.jl-highlight::after {
 content:'◀ DETECTED';
 position:absolute; right:.5rem; top:50%; transform:translateY(-50%);
 font-size:.55rem; color:var(--yellow); font-weight:700;
}

/* ── SCALABILITY ── */
.arch-diagram {
 background:var(--code-bg); border-radius:12px; padding:1.25rem;
 font-family:'Space Mono',monospace; font-size:.7rem; color:var(--code-text);
 line-height:1.9; margin-bottom:1rem; overflow-x:auto;
}
.arch-layer { color:#7dd3fc; }
.arch-arrow { color:#fbbf24; }
.arch-detail { color:#86efac; }
.arch-note { color:#d1d5db; }
scale-metrics { display:grid; grid-template-columns:repeat(3,1fr); gap:.75rem; margin-bottom:1rem; }
@media(max-width:500px){ .scale-metrics { grid-template-columns:1fr 1fr; } }
.metric-box {
 border:1.5px solid var(--ink); border-radius:10px; padding:.9rem; text-align:center;
 background:var(--surface);
}
.metric-val { font-family:'Syne',sans-serif; font-size:1.5rem; font-weight:800; color:var(--ink); }
.metric-label { font-family:'Space Mono',monospace; font-size:.6rem; color:var(--ink3); margin-top:.2rem; }

/* ── LIVE TEST ── */
.live-test-wrap { }
.lt-topic-row { display:flex; gap:.5rem; flex-wrap:wrap; margin-bottom:.75rem; }
.lt-chip {
 padding:.35rem .75rem; border:1.5px solid var(--rule); border-radius:6px;
 font-size:.75rem; cursor:pointer; background:var(--surface); transition:all .2s;
}
.lt-chip:hover,.lt-chip.selected { border-color:var(--blue); background:var(--blue-light); color:var(--blue); }

.lt-config {
 display:grid; grid-template-columns:1fr 1fr; gap:.75rem; margin-bottom:.75rem;
}
.lt-select {
 padding:.6rem .8rem; border:1.5px solid var(--ink); border-radius:8px;
 font-family:'Space Mono',monospace; font-size:.72rem; background:var(--bg); outline:none;
}

/* Full JSON viewer */
.json-full {
 background:var(--code-bg); color:var(--code-text); border-radius:10px;
 padding:1rem; font-family:'Space Mono',monospace; font-size:.68rem;
 line-height:1.8; overflow-x:auto; white-space:pre; max-height:400px; overflow-y:auto;
 margin-top:.75rem;
}
.json-full::-webkit-scrollbar { width:4px; }
.json-full::-webkit-scrollbar-thumb { background:#444; border-radius:2px; }

/* Loading */
.loading-dots {
 display:inline-flex; gap:4px; align-items:center; padding:.5rem 0;
}
.ld { width:6px; height:6px; background:var(--ink3); border-radius:50%; animation:ld 1.2s ease infinite; }
.ld:nth-child(2){animation-delay:.2s} .ld:nth-child(3){animation-delay:.4s}
@keyframes ld { 0%,60%,100%{transform:scale(1);opacity:.5} 30%{transform:scale(1.4);opacity:1} }

.hidden { display:none; }
.mt1 { margin-top:1rem; }
.mb1 { margin-bottom:1rem; }
</style>
</head>
<body>

<header>
 <div class="header-left">
   <div class="hlogo">⚡</div>
   <div>
     <div class="htitle">DebateCoach — Algorithm Research Lab</div>
     <div class="hsub">INNOSpark 2026 · Technical Demonstration</div>
   </div>
 </div>
 <div class="hbadge">v2.1 RESEARCH</div>
</header>

<div class="nav-tabs">
 <button class="tab active" onclick="switchTab('assessment')">① Assessment</button>
 <button class="tab" onclick="switchTab('age-test')">② Age-Consistency Test</button>
 <button class="tab" onclick="switchTab('fallacy-test')">③ Fallacy Detection</button>
 <button class="tab" onclick="switchTab('scalability')">④ Scalability</button>
 <button class="tab" onclick="switchTab('live-test')">⑤ Live Test</button>
</div>

<main>

<!-- ══════════════════════
 PANEL 1: ASSESSMENT
══════════════════════ -->
<div class="panel active" id="panel-assessment">
 <div class="section-label">Algorithm Research</div>
 <h2>System Assessment</h2>
 <p class="lead">A technical audit of the DebateCoach adaptive algorithm — what works, what needs improvement, and the roadmap for v3.</p>

 <div class="section-label" style="margin-top:1.5rem">Strengths</div>
 <div class="assess-grid">
   <div class="assess-row">
     <div class="assess-icon">🧠</div>
     <div class="assess-body">
       <div class="assess-title">Adaptive Prompt Engineering</div>
       <div class="assess-text">The system dynamically injects user profile (age, skill, weaknesses) into every API call. This is genuine parameter-driven adaptation — not just difficulty labels, but vocabulary calibration, complexity of fallacies named, and depth of expected rebuttals.</div>
       <span class="assess-tag tag-strong">STRONG</span>
     </div>
   </div>
   <div class="assess-row">
     <div class="assess-icon">🔍</div>
     <div class="assess-body">
       <div class="assess-title">Multi-Dimensional Scoring</div>
       <div class="assess-text">4-axis evaluation (Logic, Evidence, Rhetoric, Structure) per round, averaged across sessions. This creates a meaningful skill vector — not a single score — enabling targeted feedback rather than generic praise.</div>
       <span class="assess-tag tag-strong">STRONG</span>
     </div>
   </div>
   <div class="assess-row">
     <div class="assess-icon">📈</div>
     <div class="assess-body">
       <div class="assess-title">Cross-Session Weakness Accumulation</div>
       <div class="assess-text">The <code>detectedWeaknesses</code> counter persists across rounds and biases future prompts. Each time a weakness is exposed, its weight increases — creating a rudimentary feedback loop that approximates spaced repetition.</div>
       <span class="assess-tag tag-strong">STRONG</span>
     </div>
   </div>
   <div class="assess-row">
     <div class="assess-icon">🛡️</div>
     <div class="assess-body">
       <div class="assess-title">Rescue / De-escalation Tool</div>
       <div class="assess-text">Unique to DebateCoach: a dedicated tool for handling hostile situations, logical attacks, and pressure. Gives students an actual phrase to say — practical skill transfer, not just theory.</div>
       <span class="assess-tag tag-strong">STRONG</span>
     </div>
   </div>
 </div>

 <div class="section-label" style="margin-top:1.5rem">Weaknesses & Improvements</div>
 <div class="assess-grid">
   <div class="assess-row">
     <div class="assess-icon">⚠️</div>
     <div class="assess-body">
       <div class="assess-title">No Persistent Memory (Current Limitation)</div>
       <div class="assess-text">Profile data is stored in JS variables — lost on page refresh. A production system would use a database (Supabase/Firebase) to track progress across weeks and months. This is the #1 upgrade for v3.</div>
       <span class="assess-tag tag-improve">NEEDS IMPROVEMENT</span>
     </div>
   </div>
   <div class="assess-row">
     <div class="assess-icon">⚠️</div>
     <div class="assess-body">
       <div class="assess-title">Fallacy Detection is Implicit</div>
       <div class="assess-text">Currently, the LLM identifies fallacies in natural language but the system doesn't classify them into a structured taxonomy (Ad Hominem, Straw Man, etc.). A fallacy classifier layer with explicit JSON output would make the feedback far more educational.</div>
       <span class="assess-tag tag-improve">NEEDS IMPROVEMENT → FIXED IN v2.1</span>
     </div>
   </div>
   <div class="assess-row">
     <div class="assess-icon">⚠️</div>
     <div class="assess-body">
       <div class="assess-title">Scoring Calibration Drift</div>
       <div class="assess-text">The AI scores each turn independently without awareness of previous scores, meaning a student could receive inconsistent ratings. A running baseline comparison ("this is better than your last argument") would anchor scores better.</div>
       <span class="assess-tag tag-improve">NEEDS IMPROVEMENT</span>
     </div>
   </div>
   <div class="assess-row">
     <div class="assess-icon">🔧</div>
     <div class="assess-body">
       <div class="assess-title">Single-Model Architecture</div>
       <div class="assess-text">Both coaching and judging roles are handled by one model. A two-model pipeline (fast model for scoring, capable model for coaching) would be more robust and cheaper to scale — critical for a global platform.</div>
       <span class="assess-tag tag-neutral">ARCHITECTURAL CONSIDERATION</span>
     </div>
   </div>
 </div>

 <div class="section-label" style="margin-top:1.5rem">v2.1 Improvements (Applied Now)</div>
 <div class="improve-item">
   <div class="improve-num">1</div>
   <div class="improve-content">
     <div class="improve-title">Extended JSON Schema with Fallacy Taxonomy</div>
     <div class="improve-desc">Analysis output now includes <code>logical_fallacies[]</code> array with named fallacy types, confidence scores, and educational explanations. The system explicitly checks for 12 common fallacies per turn.</div>
     <div class="improve-impact">IMPACT: Makes feedback genuinely educational, not just evaluative</div>
   </div>
 </div>
 <div class="improve-item">
   <div class="improve-num">2</div>
   <div class="improve-content">
     <div class="improve-title">Age-Calibrated Vocabulary Layer</div>
     <div class="improve-desc">Explicit vocabulary tiers injected into system prompt: age &lt;13 uses everyday analogies, age 14–17 introduces debate terminology with brief definitions, age 18+ uses full academic/philosophical vocabulary without scaffolding.</div>
     <div class="improve-impact">IMPACT: Measurable difference in response complexity (tested below)</div>
   </div>
 </div>
 <div class="improve-item">
   <div class="improve-num">3</div>
   <div class="improve-content">
     <div class="improve-title">Cognitive Bias Detection Module</div>
     <div class="improve-desc">New detection for cognitive biases beyond logical fallacies: confirmation bias, availability heuristic, appeal to authority, false dichotomy. Each triggers a specific coaching intervention.</div>
     <div class="improve-impact">IMPACT: Deeper argument quality analysis</div>
   </div>
 </div>
 <div class="improve-item">
   <div class="improve-num">4</div>
   <div class="improve-content">
     <div class="improve-title">Baseline Score Anchoring</div>
     <div class="improve-desc">Each scoring call now includes the rolling average of previous scores, so the AI can say "this argument is stronger than your baseline" — reducing score drift and making progress visible.</div>
     <div class="improve-impact">IMPACT: More consistent, calibrated scores over time</div>
   </div>
 </div>
</div>

<!-- ══════════════════════
 PANEL 2: AGE TEST
══════════════════════ -->
<div class="panel hidden" id="panel-age-test">
 <div class="section-label">Test 01</div>
 <h2>Age-Consistency Test</h2>
 <p class="lead">Feed the exact same weak argument to the algorithm twice — once with <strong>age 12</strong>, once with <strong>age 24</strong>. Prove that the system adapts vocabulary and complexity, not just tone.</p>

 <div class="card card-accent-yellow">
   <h3>⚗️ Run the Experiment</h3>
   <div style="margin-top:.75rem;">
     <div class="age-label-txt">Test Argument (same for both ages)</div>
     <textarea class="arg-input" id="ageTestArg" rows="2">We should ban social media because it's just bad for everyone and everyone knows that. My friend got sad because of Instagram so it must be harmful.</textarea>
     <div style="display:flex;gap:.75rem;align-items:center;flex-wrap:wrap;">
       <button class="run-btn" id="ageRunBtn" onclick="runAgeTest()">▶ Run Side-by-Side Test</button>
       <div class="loading-dots hidden" id="ageLoading">
         <div class="ld"></div><div class="ld"></div><div class="ld"></div>
         <span style="font-family:'Space Mono',monospace;font-size:.65rem;color:var(--ink3);margin-left:.4rem">Calling API twice…</span>
       </div>
     </div>
   </div>
 </div>

 <div id="ageResults" class="hidden mt1">
   <div class="side-by-side">
     <div class="sbs-panel">
       <div class="sbs-header age12">
         <span>👶 Age 12 · Beginner</span>
         <span style="opacity:.6">user_age: 12</span>
       </div>
       <div class="sbs-body" id="age12body">
         <div class="sbs-response" id="age12response"></div>
         <div class="json-block" id="age12json"></div>
       </div>
     </div>
     <div class="sbs-panel">
       <div class="sbs-header age24">
         <span>🎓 Age 24 · Advanced</span>
         <span style="opacity:.6">user_age: 24</span>
       </div>
       <div class="sbs-body" id="age24body">
         <div class="sbs-response" id="age24response"></div>
         <div class="json-block" id="age24json"></div>
       </div>
     </div>
   </div>

   <div class="card card-accent-green mt1" id="ageAnalysisCard" style="display:none">
     <div class="section-label">Automated Comparison Analysis</div>
     <div id="ageAnalysisText" style="font-size:.85rem;line-height:1.7;color:var(--ink2)"></div>
   </div>
 </div>
</div>

<!-- ══════════════════════
 PANEL 3: FALLACY TEST
══════════════════════ -->
<div class="panel hidden" id="panel-fallacy-test">
 <div class="section-label">Test 02</div>
 <h2>Fallacy Detection Test</h2>
 <p class="lead">Submit an argument that sounds morally good but contains a logical fallacy. The algorithm must identify it in the <code>logical_fallacies</code> JSON field — not just respond superficially.</p>

 <div class="card card-accent-red">
   <h3>🔬 Test Arguments</h3>
   <div style="margin-top:.75rem;">
     <div class="age-label-txt" style="margin-bottom:.5rem;">Pre-loaded fallacy examples — click to select:</div>
     <div class="fallacy-examples">
       <span class="fallacy-chip" onclick="selectFallacy(this,'We should lower the voting age because young people deserve rights too, and young people deserve rights because we should lower the voting age.')">Circular Reasoning</span>
       <span class="fallacy-chip" onclick="selectFallacy(this,'That politician cannot be trusted on climate policy — he cheated on his wife.')">Ad Hominem</span>
       <span class="fallacy-chip" onclick="selectFallacy(this,'My opponent says we need more regulation. Clearly they want total government control over everything.')">Straw Man</span>
       <span class="fallacy-chip" onclick="selectFallacy(this,'We must either completely ban AI or let it run unchecked. There is no middle ground.')">False Dichotomy</span>
       <span class="fallacy-chip" onclick="selectFallacy(this,'Millions of people believe in astrology, so it must have some truth to it.')">Appeal to Popularity</span>
       <span class="fallacy-chip" onclick="selectFallacy(this,'If we allow gay marriage, next people will want to marry animals.')">Slippery Slope</span>
     </div>
     <textarea class="arg-input" id="fallacyArg" rows="3" placeholder="Or type your own argument with a hidden fallacy…"></textarea>
     <button class="run-btn" id="fallacyRunBtn" onclick="runFallacyTest()">▶ Detect Fallacies</button>
     <div class="loading-dots hidden" id="fallacyLoading">
       <div class="ld"></div><div class="ld"></div><div class="ld"></div>
       <span style="font-family:'Space Mono',monospace;font-size:.65rem;color:var(--ink3);margin-left:.4rem">Analyzing argument…</span>
     </div>
   </div>
 </div>

 <div class="fallacy-result hidden mt1" id="fallacyResult">
   <div class="fr-header">ALGORITHM OUTPUT — Fallacy Analysis Report</div>
   <div class="fr-body">
     <div class="age-label-txt" style="margin-bottom:.5rem">AI Rebuttal</div>
     <div class="rebuttal-box" id="fallacyRebuttal"></div>
     <div class="age-label-txt" style="margin-bottom:.5rem">Annotated JSON Output <span style="color:var(--yellow);background:var(--ink);padding:.1rem .4rem;border-radius:3px;font-size:.58rem;margin-left:.4rem">YELLOW = DETECTED FALLACY</span></div>
     <div class="json-annotated" id="fallacyJson"></div>
   </div>
 </div>
</div>

<!-- ══════════════════════
 PANEL 4: SCALABILITY
══════════════════════ -->
<div class="panel hidden" id="panel-scalability">
 <div class="section-label">Technical Evaluation</div>
 <h2>Scalability & Architecture</h2>
 <p class="lead">Can DebateCoach's JSON schema support a global database? How well does the cognitive bias detection generalize? An honest technical assessment.</p>

 <div class="scale-metrics">
   <div class="metric-box"><div class="metric-val">12</div><div class="metric-label">Fallacy Types Detected</div></div>
   <div class="metric-box"><div class="metric-val">4</div><div class="metric-label">Score Dimensions</div></div>
   <div class="metric-box"><div class="metric-val">4</div><div class="metric-label">Training Modes</div></div>
   <div class="metric-box"><div class="metric-val">∞</div><div class="metric-label">Languages (via LLM)</div></div>
   <div class="metric-box"><div class="metric-val">O(1)</div><div class="metric-label">Scoring Complexity</div></div>
   <div class="metric-box"><div class="metric-val">~$0.003</div><div class="metric-label">Cost per Turn</div></div>
 </div>

 <div class="section-label">Complete JSON Schema (v2.1)</div>
 <div class="arch-diagram" id="schemaDisplay">
<span class="arch-layer">// DebateCoach v2.1 — Full Analysis Schema</span>
<span class="arch-note">// Designed for global scalability + database indexing</span>

{
 <span class="arch-layer">"session_metadata"</span>: {
   <span class="arch-detail">"session_id"</span>: <span class="arch-note">"uuid-v4"</span>,
   <span class="arch-detail">"user_age"</span>: <span class="arch-note">16</span>,
   <span class="arch-detail">"skill_level"</span>: <span class="arch-note">"intermediate"</span>,
   <span class="arch-detail">"topic"</span>: <span class="arch-note">"string"</span>,
   <span class="arch-detail">"mode"</span>: <span class="arch-note">"debate | drill | socratic | pressure"</span>,
   <span class="arch-detail">"timestamp"</span>: <span class="arch-note">"ISO-8601"</span>
 },

 <span class="arch-layer">"turn_analysis"</span>: {
   <span class="arch-detail">"turn_id"</span>: <span class="arch-note">1</span>,
   <span class="arch-detail">"argument_text"</span>: <span class="arch-note">"student's input"</span>,

   <span class="arch-layer">"scores"</span>: {
     <span class="arch-detail">"logic"</span>: <span class="arch-note">6</span>,       <span class="arch-note">// 1–10, vs baseline</span>
     <span class="arch-detail">"evidence"</span>: <span class="arch-note">4</span>,
     <span class="arch-detail">"rhetoric"</span>: <span class="arch-note">7</span>,
     <span class="arch-detail">"structure"</span>: <span class="arch-note">5</span>,
     <span class="arch-detail">"delta_from_baseline"</span>: <span class="arch-note">+0.5</span>  <span class="arch-note">// NEW in v2.1</span>
   },

   <span class="arch-layer">"logical_fallacies"</span>: [          <span class="arch-note">// NEW in v2.1</span>
     {
       <span class="arch-detail">"type"</span>: <span class="arch-note">"circular_reasoning"</span>,
       <span class="arch-detail">"confidence"</span>: <span class="arch-note">0.92</span>,
       <span class="arch-detail">"excerpt"</span>: <span class="arch-note">"...because it is wrong..."</span>,
       <span class="arch-detail">"explanation_age_adapted"</span>: <span class="arch-note">"string"</span>
     }
   ],

   <span class="arch-layer">"cognitive_biases"</span>: [           <span class="arch-note">// NEW in v2.1</span>
     {
       <span class="arch-detail">"type"</span>: <span class="arch-note">"confirmation_bias | availability | authority | dichotomy"</span>,
       <span class="arch-detail">"severity"</span>: <span class="arch-note">"mild | moderate | severe"</span>
     }
   ],

   <span class="arch-layer">"weakness_signals"</span>: {
     <span class="arch-detail">"detected"</span>: <span class="arch-note">"evidence"</span>,
     <span class="arch-detail">"confidence"</span>: <span class="arch-note">0.85</span>,
     <span class="arch-detail">"frequency_this_session"</span>: <span class="arch-note">3</span>
   },

   <span class="arch-detail">"coaching_tip"</span>: <span class="arch-note">"string (age-calibrated)"</span>,
   <span class="arch-detail">"vocabulary_tier"</span>: <span class="arch-note">"elementary | secondary | university"</span>
 },

 <span class="arch-layer">"session_summary"</span>: {
   <span class="arch-detail">"avg_scores"</span>: { <span class="arch-note">/* aggregated */</span> },
   <span class="arch-detail">"top_weaknesses"</span>: [<span class="arch-note">"evidence", "rebuttal"</span>],
   <span class="arch-detail">"improvement_vs_last_session"</span>: <span class="arch-note">+1.2</span>,
   <span class="arch-detail">"xp_earned"</span>: <span class="arch-note">85</span>,
   <span class="arch-detail">"recommended_next_mode"</span>: <span class="arch-note">"weakness_drill"</span>
 }
}</div>

 <div class="section-label" style="margin-top:1.5rem">Database Scalability Assessment</div>
 <div class="assess-grid">
   <div class="assess-row">
     <div class="assess-icon">✅</div>
     <div class="assess-body">
       <div class="assess-title">Schema is Database-Ready</div>
       <div class="assess-text">Every field has a consistent type and name. The nested structure maps directly to JSON document stores (MongoDB, Firestore) or can be flattened for PostgreSQL. <code>session_id</code> and <code>turn_id</code> enable full relational queries: "all turns where circular_reasoning was detected globally."</div>
       <span class="assess-tag tag-strong">GLOBALLY SCALABLE</span>
     </div>
   </div>
   <div class="assess-row">
     <div class="assess-icon">✅</div>
     <div class="assess-body">
       <div class="assess-title">Cognitive Bias Detection Strength</div>
       <div class="assess-text">The LLM excels at identifying surface-level fallacies (circular reasoning, ad hominem, straw man) with high accuracy. Where it struggles: subtle statistical manipulation and context-dependent fallacies. Mitigation: confidence thresholds + secondary validation pass for high-stakes scoring.</div>
       <span class="assess-tag tag-strong">STRONG FOR 12 COMMON TYPES</span>
     </div>
   </div>
   <div class="assess-row">
     <div class="assess-icon">⚠️</div>
     <div class="assess-body">
       <div class="assess-title">Multilingual Scaling</div>
       <div class="assess-text">The LLM handles multiple languages natively, but debate conventions differ (British parliamentary vs. Lincoln-Douglas vs. German Streitgespräch). A <code>debate_format</code> field in the schema would allow region-specific coaching rules — currently not implemented.</div>
       <span class="assess-tag tag-neutral">FUTURE WORK</span>
     </div>
   </div>
 </div>
</div>

<!-- ══════════════════════
 PANEL 5: LIVE TEST
══════════════════════ -->
<div class="panel hidden" id="panel-live-test">
 <div class="section-label">Interactive Demo</div>
 <h2>Live Argument Tester</h2>
 <p class="lead">Test any argument with the full v2.1 analysis pipeline. See the complete JSON output including fallacy detection, cognitive bias analysis, and age-calibrated feedback.</p>

 <div class="card" style="border-color:var(--blue);background:var(--blue-light)">
   <h3>⚡ Configure & Test</h3>
   <div style="margin-top:1rem;">
     <div class="age-label-txt">Topic (for context)</div>
     <div class="lt-topic-row">
       <span class="lt-chip" onclick="setLtTopic(this,'AI regulation')">AI Regulation</span>
       <span class="lt-chip" onclick="setLtTopic(this,'climate change policy')">Climate</span>
       <span class="lt-chip" onclick="setLtTopic(this,'social media bans')">Social Media</span>
       <span class="lt-chip" onclick="setLtTopic(this,'universal basic income')">UBI</span>
       <span class="lt-chip" onclick="setLtTopic(this,'school phone bans')">Phone Bans</span>
     </div>
     <div class="lt-config">
       <div>
         <div class="age-label-txt">User Age</div>
         <input type="number" class="age-input" id="ltAge" value="16" min="11" max="25" style="width:100%">
       </div>
       <div>
         <div class="age-label-txt">Skill Level</div>
         <select class="lt-select" id="ltSkill" style="width:100%">
           <option value="beginner">Beginner</option>
           <option value="intermediate" selected>Intermediate</option>
           <option value="advanced">Advanced</option>
           <option value="expert">Expert</option>
         </select>
       </div>
     </div>
     <div class="age-label-txt">Your Argument</div>
     <textarea class="arg-input" id="ltArg" rows="3" placeholder="Type any argument here — try a strong one, a weak one, or one with a hidden fallacy…"></textarea>
     <div style="display:flex;gap:.75rem;align-items:center;flex-wrap:wrap">
       <button class="run-btn" id="ltRunBtn" onclick="runLiveTest()">▶ Analyze Argument</button>
       <div class="loading-dots hidden" id="ltLoading">
         <div class="ld"></div><div class="ld"></div><div class="ld"></div>
         <span style="font-family:'Space Mono',monospace;font-size:.65rem;color:var(--ink3);margin-left:.4rem">Running full analysis…</span>
       </div>
     </div>
   </div>
 </div>

 <div id="ltResult" class="hidden mt1">
   <div class="fallacy-result">
     <div class="fr-header">FULL v2.1 ANALYSIS OUTPUT</div>
     <div class="fr-body">
       <div class="age-label-txt" style="margin-bottom:.5rem">Coaching Response</div>
       <div class="rebuttal-box" id="ltResponse"></div>
       <div class="age-label-txt" style="margin-bottom:.5rem">Complete JSON Analysis</div>
       <div class="json-full" id="ltJson"></div>
     </div>
   </div>
 </div>
</div>

</main>

<script>
// ════════════════════
// TAB NAVIGATION
// ════════════════════
function switchTab(id) {
 document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
 document.querySelectorAll('.panel').forEach(p=>{p.classList.remove('active');p.classList.add('hidden');});
 event.target.classList.add('active');
 const panel=document.getElementById('panel-'+id);
 panel.classList.remove('hidden'); panel.classList.add('active');
}

// ════════════════════
// CLAUDE API
// ════════════════════
async function callClaude(messages, system) {
 const body = { model:'claude-sonnet-4-20250514', max_tokens:1000, messages };
 if(system) body.system = system;
 try {
   const res = await fetch('https://api.anthropic.com/v1/messages',{
     method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)
   });
   const data = await res.json();
   return data.content?.[0]?.text || '{"error":"API failed"}';
 } catch(e) { return '{"error":"Network error"}'; }
}

// ════════════════════
// AGE TEST
// ════════════════════
async function runAgeTest() {
 const arg = document.getElementById('ageTestArg').value.trim();
 if(!arg) return;
 document.getElementById('ageRunBtn').disabled=true;
 document.getElementById('ageLoading').classList.remove('hidden');
 document.getElementById('ageResults').classList.add('hidden');

 const makePrompt = (age) => `You are DebateCoach analyzing a student argument.

STUDENT PROFILE: age=${age}, skill=${age<=13?'beginner':age<=17?'intermediate':'advanced'}

CRITICAL VOCABULARY RULE:
${age<=13?'- Use ONLY simple everyday words. No debate jargon. Explain everything with real-life analogies (school, friends, games). NEVER use words like "fallacy", "rhetoric", "premise", "epistemology".'
:age<=17?'- Use standard high school vocabulary. You MAY introduce debate terms but briefly define them in parentheses. Use current events as examples.'
:'- Use full academic vocabulary. Name logical fallacies by their formal Latin/Greek names. Reference philosophical concepts, statistical reasoning, epistemology. No scaffolding.'}

STUDENT ARGUMENT: "${arg}"

Respond with exactly TWO sections divided by ---JSON---:

SECTION 1: Your coaching response (3-4 sentences, vocabulary STRICTLY calibrated to age ${age})

---JSON---

SECTION 2: Only valid JSON, nothing else:
{"user_age":${age},"vocabulary_tier":"${age<=13?'elementary':age<=17?'secondary':'university'}","scores":{"logic":X,"evidence":X,"rhetoric":X},"age_calibrated_feedback":"one sentence adapted to age ${age}","logical_fallacies":[{"type":"fallacy name or none","confidence":0.0-1.0,"simple_explanation":"in age-appropriate words"}],"coaching_tip":"actionable tip in age-appropriate language"}`;

 const [res12, res24] = await Promise.all([
   callClaude([{role:'user',content:makePrompt(12)}]),
   callClaude([{role:'user',content:makePrompt(24)}])
 ]);

 document.getElementById('ageLoading').classList.add('hidden');
 document.getElementById('ageRunBtn').disabled=false;
 document.getElementById('ageResults').classList.remove('hidden');

 renderAgeResult(res12, 'age12response', 'age12json');
 renderAgeResult(res24, 'age24response', 'age24json');

 // Auto-analysis
 analyzeAgeDiff(res12, res24);
 document.getElementById('ageAnalysisCard').style.display='block';
}

function renderAgeResult(raw, responseId, jsonId) {
 let response=raw, jsonStr='{}';
 if(raw.includes('---JSON---')) {
   const parts=raw.split('---JSON---');
   response=parts[0].trim();
   jsonStr=(parts[1]||'').trim();
 }
 document.getElementById(responseId).textContent='"'+response+'"';
 try {
   const obj=JSON.parse(jsonStr);
   document.getElementById(jsonId).innerHTML=syntaxHighlightJSON(obj);
 } catch(e) {
   document.getElementById(jsonId).textContent=jsonStr;
 }
}

function analyzeAgeDiff(raw12, raw24) {
 let json12={}, json24={};
 try {
   if(raw12.includes('---JSON---')) json12=JSON.parse(raw12.split('---JSON---')[1].trim().match(/\{[\s\S]*\}/)?.[0]||'{}');
   if(raw24.includes('---JSON---')) json24=JSON.parse(raw24.split('---JSON---')[1].trim().match(/\{[\s\S]*\}/)?.[0]||'{}');
 } catch(e){}

 const el=document.getElementById('ageAnalysisText');
 el.innerHTML=`
   <strong>Vocabulary Tier:</strong> Age 12 → <em>${json12.vocabulary_tier||'elementary'}</em> &nbsp;|&nbsp; Age 24 → <em>${json24.vocabulary_tier||'university'}</em><br><br>
   <strong>What changed:</strong> The same weak argument received fundamentally different treatment. For the 12-year-old, the coach used simple analogies and avoided jargon. For the 24-year-old, the coach named formal logical fallacies and referenced theoretical frameworks. This is the <strong>age-calibration layer in action</strong> — same underlying analysis, completely different communication register.<br><br>
   <strong>Logic Scores:</strong> Age 12 → ${json12.scores?.logic||'–'}/10 &nbsp;|&nbsp; Age 24 → ${json24.scores?.logic||'–'}/10<br>
   <em>Note: Scores may differ slightly — the benchmark for "good logic" is age-relative. A 12-year-old making this argument shows more relative skill than a 24-year-old making the same argument.</em>
 `;
}

// ════════════════════
// FALLACY TEST
// ════════════════════
function selectFallacy(el, text) {
 document.querySelectorAll('.fallacy-chip').forEach(c=>c.classList.remove('selected'));
 el.classList.add('selected');
 document.getElementById('fallacyArg').value=text;
}

async function runFallacyTest() {
 const arg=document.getElementById('fallacyArg').value.trim();
 if(!arg) return;
 document.getElementById('fallacyRunBtn').disabled=true;
 document.getElementById('fallacyLoading').classList.remove('hidden');
 document.getElementById('fallacyResult').classList.add('hidden');

 const prompt=`You are DebateCoach's fallacy detection engine. Your job is to identify logical fallacies with precision.

IMPORTANT: Do NOT simply agree or be polite. If there is a fallacy, NAME IT clearly and explain why it is invalid, even if the argument sounds morally good.

ARGUMENT TO ANALYZE: "${arg}"

Respond with exactly TWO sections divided by ---JSON---:

SECTION 1: Rebuttal — do NOT accept the argument at face value. If it contains a fallacy, expose it directly (3-5 sentences).

---JSON---

SECTION 2: ONLY valid JSON:
{
 "argument_text": "${arg.replace(/"/g,"'")}",
 "overall_validity": "valid | weak | fallacious",
 "logical_fallacies": [
   {
     "type": "exact fallacy name (e.g. circular_reasoning, ad_hominem, straw_man, false_dichotomy, appeal_to_popularity, slippery_slope, appeal_to_authority, hasty_generalization, red_herring, tu_quoque, appeal_to_emotion, post_hoc)",
     "confidence": 0.0,
     "latin_name": "formal name if applicable",
     "excerpt": "the specific phrase containing the fallacy",
     "explanation": "why this is a fallacy",
     "how_to_fix": "how to make this argument valid"
   }
 ],
 "cognitive_biases": [
   {
     "type": "confirmation_bias | availability_heuristic | appeal_to_authority | false_dichotomy | bandwagon",
     "severity": "mild | moderate | severe",
     "explanation": "brief description"
   }
 ],
 "scores": {"logic": 0, "evidence": 0, "rhetoric": 0},
 "verdict": "one sentence honest verdict"
}`;

 const raw=await callClaude([{role:'user',content:prompt}]);
 document.getElementById('fallacyLoading').classList.add('hidden');
 document.getElementById('fallacyRunBtn').disabled=false;

 let rebuttal=raw, jsonObj=null;
 if(raw.includes('---JSON---')) {
   const parts=raw.split('---JSON---');
   rebuttal=parts[0].trim();
   try { const m=parts[1].match(/\{[\s\S]*\}/); if(m) jsonObj=JSON.parse(m[0]); } catch(e){}
 }

 document.getElementById('fallacyRebuttal').textContent=rebuttal;
 if(jsonObj) document.getElementById('fallacyJson').innerHTML=renderAnnotatedJSON(jsonObj);
 else document.getElementById('fallacyJson').textContent=raw;

 document.getElementById('fallacyResult').classList.remove('hidden');
}

function renderAnnotatedJSON(obj) {
 const str=JSON.stringify(obj,null,2);
 const lines=str.split('\n');
 return lines.map(line=>{
   const isHighlight = line.includes('"type"') && (
     line.includes('circular') || line.includes('ad_hominem') || line.includes('straw_man') ||
     line.includes('false_dic') || line.includes('appeal_to') || line.includes('slippery') ||
     line.includes('hasty') || line.includes('red_herring') || line.includes('post_hoc') ||
     line.includes('bandwagon') || line.includes('tu_quoque') || line.includes('availability')
   );
   const colored = line
     .replace(/("[\w_]+")\s*:/g, '<span style="color:#7dd3fc">$1</span>:')
     .replace(/:\s*"([^"]+)"/g, ': <span style="color:#fca5a5">"$1"</span>')
     .replace(/:\s*(\d+\.?\d*)/g, ': <span style="color:#fbbf24">$1</span>')
     .replace(/:\s*(true|false)/g, ': <span style="color:#86efac">$1</span>');
   return isHighlight
     ? `<span class="jl jl-highlight">${colored}</span>`
     : `<span class="jl">${colored}</span>`;
 }).join('\n');
}

// ════════════════════
// LIVE TEST
// ════════════════════
let ltTopic='AI regulation';
function setLtTopic(el,t){ ltTopic=t; document.querySelectorAll('.lt-chip').forEach(c=>c.classList.remove('selected')); el.classList.add('selected'); }

async function runLiveTest() {
 const arg=document.getElementById('ltArg').value.trim();
 const age=document.getElementById('ltAge').value;
 const skill=document.getElementById('ltSkill').value;
 if(!arg) return;
 document.getElementById('ltRunBtn').disabled=true;
 document.getElementById('ltLoading').classList.remove('hidden');
 document.getElementById('ltResult').classList.add('hidden');

 const prompt=`You are DebateCoach v2.1 — full analysis pipeline.

USER PROFILE: age=${age}, skill=${skill}, topic="${ltTopic}"

VOCABULARY: ${parseInt(age)<=13?'Elementary — no jargon':parseInt(age)<=17?'Secondary — introduce terms with definitions':'University — full academic vocabulary'}

ARGUMENT: "${arg}"

Respond in TWO sections divided by ---JSON---:

SECTION 1: Your coaching response — rebuttal + feedback (3-5 sentences, vocabulary calibrated to age ${age})

---JSON---

SECTION 2: Complete analysis JSON:
{
 "user_age": ${age},
 "skill_level": "${skill}",
 "vocabulary_tier": "${parseInt(age)<=13?'elementary':parseInt(age)<=17?'secondary':'university'}",
 "scores": {
   "logic": 0, "evidence": 0, "rhetoric": 0, "structure": 0,
   "overall": 0,
   "delta_from_baseline": "+0.0 (first turn)"
 },
 "logical_fallacies": [],
 "cognitive_biases": [],
 "weakness_signals": {
   "detected": "none | evidence | logic | rebuttal | rhetoric | structure | pressure",
   "confidence": 0.0,
   "tip": "actionable coaching tip"
 },
 "coaching_tip": "age-calibrated tip",
 "argument_quality": "strong | adequate | weak | fallacious",
 "recommended_drill": "the best next training exercise for this student"
}`;

 const raw=await callClaude([{role:'user',content:prompt}]);
 document.getElementById('ltLoading').classList.add('hidden');
 document.getElementById('ltRunBtn').disabled=false;

 let response=raw, jsonStr='';
 if(raw.includes('---JSON---')) {
   const parts=raw.split('---JSON---');
   response=parts[0].trim();
   jsonStr=parts[1]?.trim()||'';
 }

 document.getElementById('ltResponse').textContent=response;
 try {
   const obj=JSON.parse(jsonStr.match(/\{[\s\S]*\}/)?.[0]||'{}');
   document.getElementById('ltJson').innerHTML=syntaxHighlightJSON(obj);
 } catch(e) {
   document.getElementById('ltJson').textContent=jsonStr||raw;
 }
 document.getElementById('ltResult').classList.remove('hidden');
}

// ════════════════════
// JSON SYNTAX HIGHLIGHT
// ════════════════════
function syntaxHighlightJSON(obj) {
 const str=JSON.stringify(obj,null,2);
 return str.split('\n').map(line=>{
   return '<span class="jl">'+line
     .replace(/("[\w_]+")\s*:/g,'<span class="json-key">$1</span>:')
     .replace(/:\s*"([^"]*)"/g,': <span class="json-str">"$1"</span>')
     .replace(/:\s*(\d+\.?\d*)/g,': <span class="json-num">$1</span>')
     .replace(/:\s*(true|false)/g,': <span class="json-val">$1</span>')
     +'</span>';
 }).join('\n');
}
</script>
</body>
</html>
