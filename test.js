// Trimmer Math tests - engine.js against oracle expected.json.
const fs = require("fs");
require("./engine.js");
const M = globalThis.TrimmerMath;
const plans = { run: [M.runPlan, M.renderRun], swath: [M.swathPlan, M.renderSwath], line: [M.linePlan, M.renderLine] };
const cases = JSON.parse(fs.readFileSync("expected.json", "utf8"));
let checks = 0, fails = 0;
function ok(cond, label){ checks++; if (!cond){ fails++; console.error("FAIL: " + label); } }
for (const c of cases){
  const [plan, render] = plans[c.tool];
  const r = plan.apply(null, c.args);
  const label = c.tool + "(" + c.args.join(",") + ")";
  if (c.result.error){
    ok(r.error === c.result.error, label + " error: got " + JSON.stringify(r));
    ok(Object.keys(r).length === 1, label + " error-only keys");
  } else {
    ok(JSON.stringify(r) === JSON.stringify(c.result), label + " result: got " + JSON.stringify(r));
    for (const k of Object.keys(c.result)){ ok(r[k] === c.result[k], label + " field " + k); }
    const got = render.apply(null, [r].concat(c.args));
    ok(got === c.render, label + " render:\n  got " + got + "\n  exp " + c.render);
    console.log(label + " -> " + got);
  }
}
console.log(cases.length + " cases, " + checks + " checks " + (fails ? fails + " FAILED" : "green"));
process.exit(fails ? 1 : 0);
