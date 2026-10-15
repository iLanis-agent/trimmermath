#!/usr/bin/env python3
# Trimmer Math oracle - mirrors engine.js float-for-float.
import json, math
OVERLAP = 0.75
def r1(x): return math.floor(x*10+0.5)/10
def f1(x): return "%.1f" % r1(x)
def jsnum(x):
    i = int(x)
    return i if x == i else x

def run_plan(volts, ah, watts, claim):
    if not (volts > 0): return {"error": "the pack volts must be above zero"}
    if not (ah > 0): return {"error": "the amp-hours must be above zero"}
    if not (watts > 0): return {"error": "the motor watts must be above zero"}
    if not (claim > 0): return {"error": "the claimed minutes must be above zero"}
    wh_raw = volts * ah
    honest_raw = wh_raw / watts * 60
    pct_raw = honest_raw / claim * 100
    verdict = "a brochure breeze" if pct_raw < 70 else ("in reach on a dry day" if pct_raw <= 100 else "outruns the sticker")
    return {"wh": jsnum(r1(wh_raw)), "honestMin": jsnum(r1(honest_raw)), "pct": jsnum(r1(pct_raw)), "verdict": verdict}
def render_run(r, volts, ah, watts, claim):
    min_word = "1 minute" if r["honestMin"] == 1 else f1(r["honestMin"]) + " minutes"
    return ("The %s-volt %s-amp-hour pack is %s watt-hours; at %s watts that is an honest %s - %s%% of the %s-minute claim, %s."
            % (volts, ah, f1(r["wh"]), watts, min_word, f1(r["pct"]), claim, r["verdict"]))

def swath_plan(swath, walk, honest, yard):
    if not (swath > 0): return {"error": "the claimed swath must be above zero"}
    if not (walk > 0): return {"error": "the walking feet per minute must be above zero"}
    if not (honest > 0): return {"error": "the honest minutes must be above zero"}
    if not (yard > 0): return {"error": "the trimming square feet must be above zero"}
    eff_raw = swath * OVERLAP
    per_min_raw = eff_raw / 12 * walk
    sqft_raw = per_min_raw * honest
    pct_raw = sqft_raw / yard * 100
    verdict = "one charge, half the fence line" if pct_raw < 60 else ("the far corner waits for the recharge" if pct_raw < 100 else "finishes with charge to spare")
    return {"effIn": jsnum(r1(eff_raw)), "perMin": jsnum(r1(per_min_raw)), "honestSqft": jsnum(r1(sqft_raw)), "pct": jsnum(r1(pct_raw)), "verdict": verdict}
def render_swath(r, swath, walk, honest, yard):
    return ("The %s-inch swath honestly cuts %s inches after the 0.75 overlap norm; at %s feet a minute that is %s square feet a minute, and the %s honest minutes cover %s square feet - %s%% of the %s square feet of trimming, %s."
            % (swath, f1(r["effIn"]), walk, f1(r["perMin"]), honest, f1(r["honestSqft"]), f1(r["pct"]), yard, r["verdict"]))

def line_plan(spool, bumps, in_per):
    if not (spool > 0): return {"error": "the spool feet must be above zero"}
    if not (bumps > 0): return {"error": "the bumps a session must be above zero"}
    if not (in_per > 0): return {"error": "the inches a bump must be above zero"}
    per_session_raw = bumps * in_per / 12
    sessions_raw = spool / per_session_raw
    verdict = "gone before the second fence line" if sessions_raw < 2 else ("a working month of edges" if sessions_raw <= 8 else "forgotten in the spool cap")
    return {"perSession": jsnum(r1(per_session_raw)), "sessions": jsnum(r1(sessions_raw)), "verdict": verdict}
def render_line(r, spool, bumps, in_per):
    sess_word = "1 session" if r["sessions"] == 1 else f1(r["sessions"]) + " sessions"
    return ("%s bumps at %s inches a bump spend %s feet of line a session; the %s-foot spool is %s - %s."
            % (bumps, in_per, f1(r["perSession"]), spool, sess_word, r["verdict"]))

CASES = [
    ("run", (40,4,320,30)), ("run", (20,2.5,400,30)), ("run", (56,5,250,40)),
    ("run", (18,2,300,20)), ("run", (80,6,500,60)), ("run", (36,3,350,25)),
    ("swath", (15,40,27,1200)), ("swath", (17,35,27,900)), ("swath", (13,30,15,1200)),
    ("swath", (15,45,20,1500)), ("swath", (14,40,30,1000)), ("swath", (16,38,25,2000)),
    ("line", (20,12,2)), ("line", (15,20,2.5)), ("line", (10,25,3)),
    ("line", (30,10,2)), ("line", (12,15,2)), ("line", (25,18,2.5)),
    ("run", (0,4,320,30)), ("run", (40,0,320,30)), ("run", (40,4,0,30)), ("run", (40,4,320,0)),
    ("swath", (0,40,27,1200)), ("swath", (15,0,27,1200)), ("swath", (15,40,0,1200)), ("swath", (15,40,27,0)),
    ("line", (0,12,2)), ("line", (20,0,2)), ("line", (20,12,0)),
]
PLANS = {"run": (run_plan, render_run), "swath": (swath_plan, render_swath), "line": (line_plan, render_line)}
out = []
for tool, args in CASES:
    plan, render = PLANS[tool]
    r = plan(*args)
    case = {"tool": tool, "args": list(args), "result": r}
    if "error" not in r:
        case["render"] = render(r, *args)
    out.append(case)
print(json.dumps(out, separators=(",", ":")), end="")
