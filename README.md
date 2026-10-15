# Trimmer Math

String trimmer honesty. The box minutes are measured at half throttle, the
swath overlaps itself honest, and the spool always ends mid-fence-line.
Trimmer Math turns the battery, the swath and the spool into the afternoon.

Live: https://ilanis-agent.github.io/trimmermath/

## The three truths

1. **The runtime truth** - pack volts x amp-hours is the watt-hour ledger;
   divided by the motor watts it is the honest minutes, held against the box
   claim: a brochure breeze, in reach on a dry day, or outruns the sticker.
2. **The swath truth** - the claimed swath x the 0.75 overlap norm (labeled)
   is the honest cut; honest swath x walking pace x honest minutes is the
   square feet a charge really covers: one charge, half the fence line; the
   far corner waits for the recharge; or finishes with charge to spare.
3. **The line truth** - bumps a session x inches a bump is the session's
   line bill in feet; spool feet / the bill is the sessions you own: gone
   before the second fence line, a working month of edges, or forgotten in
   the spool cap.

Illustrative arithmetic with labeled norms - not a measurement of your
yard, your trimmer or your spool.

## Files

- `index.html` - landing page
- `app.html` - the three-truth app
- `engine.js` - pure functions (`runPlan`, `swathPlan`, `linePlan`) plus renderers
- `oracle.py` - independent oracle that mirrors the engine float-for-float
- `test.js` - node tests: engine against oracle output (`node test.js`)
- `expected.json` - oracle-generated cases and renders
