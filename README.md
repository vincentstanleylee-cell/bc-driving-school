# BC Driving Master — ICBC 自動波路試通關指南

A bilingual (Traditional Chinese first, official English ICBC terms second) static website for students preparing for the ICBC road test in British Columbia, Canada: Class 7 (N) and Class 5, automatic transmission.

This is a self-study aid. It is not an ICBC product. Always check the current rules with ICBC's *Learn to Drive Smart* material and your licensed instructor.

## Pages

| Page | What it covers |
|---|---|
| `index.html` | Hub: 8-milestone roadmap tracker (saved in your browser), module search, top 10 automatic fails |
| `cockpit.html` | 360 degree exterior check, seat and mirror setup, P-R-N-D-2-1, dashboard warning lights |
| `driving-basics.html` | Heel-pivot braking, progressive braking, See-Think-Do cycle, five-step turn, blind-spot simulator, following distance |
| `intersections.html` | 4-way and 2-way stops, intersection scan, stale green light, right turn on red, unprotected left turn |
| `maneuvers.html` | Parallel parking 4-step guide, hill parking wheel directions, steering-angle simulator, three-point turn, backing in |
| `speed-zones.html` | Speed limits, school and playground zones, highway merging |
| `hazard-perception.html` | Clickable hazard scene (4 hazards), what to say to the examiner, real vs potential hazards |
| `mock-test.html` | Automatic-fail checklist, practice demerit sheet, pass/fail result |

## Features

- Responsive layout for phone, tablet, and desktop (Tailwind CSS).
- Progress checklists saved in `localStorage`. Nothing is sent to a server.
- Interactive simulators drawn with HTML5 Canvas and SVG.
- Confetti (canvas-confetti) when a checklist or the hazard scene is finished.
- Icons from Lucide.

## Run it locally

Requires Python 3 (any version with `http.server`). From the project folder:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

The pages load Tailwind, Lucide, canvas-confetti, Google Fonts, and Unsplash photos from the internet, so you need a network connection the first time.

## Project files

```
index.html … mock-test.html   the 8 pages
app.js                        shared header/footer, trackers, simulators
CLAUDE.md                     entry point for AI coding agents
the harness/                  agent notes, memory, tasks (git-ignored)
```

## Notes and open checks

- Hill-parking wheel directions follow the project spec (uphill with curb: left; uphill without curb and downhill: right). One public comment disputes the legal wording, so check ICBC's booklet before relying on them.
- The demerit values and the practice pass limit on `mock-test.html` are for practice only and are not ICBC's official numbers.
- Photos are from Unsplash for illustration. Each image has alt text and falls back to a blank area if it cannot load.
