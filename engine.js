// Trimmer Math engine - string trimmer honesty, labeled norms, honest arithmetic.
(function(root){
"use strict";
var OVERLAP = 0.75; // labeled norm: the honest swath after pass overlap
function r1(x){ return Math.round(x*10)/10; }
function f1(x){ return r1(x).toFixed(1); }

function runPlan(volts, ampHours, watts, claimMin){
  if (!(volts > 0)) return { error: "the pack volts must be above zero" };
  if (!(ampHours > 0)) return { error: "the amp-hours must be above zero" };
  if (!(watts > 0)) return { error: "the motor watts must be above zero" };
  if (!(claimMin > 0)) return { error: "the claimed minutes must be above zero" };
  var whRaw = volts * ampHours;
  var honestRaw = whRaw / watts * 60;
  var pctRaw = honestRaw / claimMin * 100;
  var verdict = pctRaw < 70 ? "a brochure breeze" : (pctRaw <= 100 ? "in reach on a dry day" : "outruns the sticker");
  return { wh: r1(whRaw), honestMin: r1(honestRaw), pct: r1(pctRaw), verdict: verdict };
}
function renderRun(r, volts, ampHours, watts, claimMin){
  var minWord = r.honestMin === 1 ? "1 minute" : f1(r.honestMin) + " minutes";
  return "The " + volts + "-volt " + ampHours + "-amp-hour pack is " + f1(r.wh) + " watt-hours; at " + watts + " watts that is an honest " + minWord + " - " + f1(r.pct) + "% of the " + claimMin + "-minute claim, " + r.verdict + ".";
}

function swathPlan(swathIn, walkFpm, honestMin, yardSqft){
  if (!(swathIn > 0)) return { error: "the claimed swath must be above zero" };
  if (!(walkFpm > 0)) return { error: "the walking feet per minute must be above zero" };
  if (!(honestMin > 0)) return { error: "the honest minutes must be above zero" };
  if (!(yardSqft > 0)) return { error: "the trimming square feet must be above zero" };
  var effRaw = swathIn * OVERLAP;
  var perMinRaw = effRaw / 12 * walkFpm;
  var sqftRaw = perMinRaw * honestMin;
  var pctRaw = sqftRaw / yardSqft * 100;
  var verdict = pctRaw < 60 ? "one charge, half the fence line" : (pctRaw < 100 ? "the far corner waits for the recharge" : "finishes with charge to spare");
  return { effIn: r1(effRaw), perMin: r1(perMinRaw), honestSqft: r1(sqftRaw), pct: r1(pctRaw), verdict: verdict };
}
function renderSwath(r, swathIn, walkFpm, honestMin, yardSqft){
  return "The " + swathIn + "-inch swath honestly cuts " + f1(r.effIn) + " inches after the 0.75 overlap norm; at " + walkFpm + " feet a minute that is " + f1(r.perMin) + " square feet a minute, and the " + honestMin + " honest minutes cover " + f1(r.honestSqft) + " square feet - " + f1(r.pct) + "% of the " + yardSqft + " square feet of trimming, " + r.verdict + ".";
}

function linePlan(spoolFt, bumps, inPerBump){
  if (!(spoolFt > 0)) return { error: "the spool feet must be above zero" };
  if (!(bumps > 0)) return { error: "the bumps a session must be above zero" };
  if (!(inPerBump > 0)) return { error: "the inches a bump must be above zero" };
  var perSessionRaw = bumps * inPerBump / 12;
  var sessionsRaw = spoolFt / perSessionRaw;
  var verdict = sessionsRaw < 2 ? "gone before the second fence line" : (sessionsRaw <= 8 ? "a working month of edges" : "forgotten in the spool cap");
  return { perSession: r1(perSessionRaw), sessions: r1(sessionsRaw), verdict: verdict };
}
function renderLine(r, spoolFt, bumps, inPerBump){
  var sessWord = r.sessions === 1 ? "1 session" : f1(r.sessions) + " sessions";
  return bumps + " bumps at " + inPerBump + " inches a bump spend " + f1(r.perSession) + " feet of line a session; the " + spoolFt + "-foot spool is " + sessWord + " - " + r.verdict + ".";
}

root.TrimmerMath = { runPlan: runPlan, renderRun: renderRun, swathPlan: swathPlan, renderSwath: renderSwath, linePlan: linePlan, renderLine: renderLine };
})(typeof window !== "undefined" ? window : globalThis);
