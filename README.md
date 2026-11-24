# BC Driving Master — ICBC 自動波路試通關指南

A static study guide in Cantonese (Traditional Chinese), English, and Simplified Chinese for the Class 7 (N) and Class 5 automatic road tests in British Columbia.

This is a self-study aid. It is not an ICBC product. Always check the current rules with ICBC's *Learn to Drive Smart* material and your licensed instructor.

## Pages

| Page | What it covers |
|---|---|
| `index.html` | Hub with a 9-milestone roadmap, module search, and automatic-fail checklist |
| `road-signs.html` | 109 illustrated road signs, 15 signals and 17 road markings, with a searchable collection, flashcards, and mixed picture/meaning quizzes |
| `cockpit.html` | 360 degree exterior check, seat and mirror setup, P-R-N-D-2-1, dashboard warning lights |
| `driving-basics.html` | Heel-pivot braking, progressive braking, See-Think-Do cycle, five-step turn, blind-spot simulator, following distance |
| `intersections.html` | 4-way and 2-way stops, intersection scan, stale green light, right turn on red, unprotected left turn |
| `maneuvers.html` | Parallel parking 4-step guide, hill parking wheel directions, steering-angle simulator, three-point turn, backing in |
| `speed-zones.html` | Speed limits, school and playground zones, highway merging |
| `hazard-perception.html` | Clickable hazard scene (4 hazards), what to say to the examiner, real vs potential hazards |
| `mock-test.html` | Automatic-fail checklist, practice demerit sheet, pass/fail result |

## Features

- Responsive layout for phone, tablet, and desktop (Tailwind CSS).
- The language picker updates lesson content, navigation and interactive feedback in place and saves the selection in your browser.
- Progress checklists saved in `localStorage`. Nothing is sent to a server.
- Interactive simulators drawn with HTML5 Canvas and SVG.
- Confetti (canvas-confetti) when a checklist or the hazard scene is finished.
- Icons from Lucide.
- Road signs learning progress and best quiz results are saved in the browser. Quiz rounds can cover 12 random examples or a whole category, with explanations, streaks and missed-question retries.

## Run it locally

Requires Python 3 (any version with `http.server`). From the project folder:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

The pages load Tailwind, Lucide, canvas-confetti, Google Fonts, and Unsplash photos from the internet, so you need a network connection the first time.

## Project files

```
index.html … road-signs.html   the 9 pages
app.js                        shared header/footer, trackers, simulators
i18n.js                       language picker and localized rendering
translations.js               English, Simplified Chinese, and runtime Cantonese messages
road-signs.js                  signs explorer, flashcards, quiz and saved progress
road-signs-data.js             141 examples with three-language study notes
road-signs.css                 road signs lesson layout and controls
assets/signs/                 locally hosted sign, signal and marking illustrations
CLAUDE.md                     entry point for AI coding agents
the harness/                  agent notes, memory, tasks (git-ignored)
```

## Notes and open checks

- Hill parking on the right side of the road uses the front wheels to prevent rolling into traffic. See the hill-parking instructions and curb exceptions in [ICBC’s Learn to Drive Smart, chapter 4](https://www.icbc.com/assets/en/DhxStHw3HmhFhbL8v150h/drivers4.pdf).
- The demerit values and the practice pass limit on `mock-test.html` are for practice only and are not ICBC's official numbers.
- Photos are from Unsplash for illustration. Each image has alt text and falls back to a blank area if it cannot load.
- Road sign examples are based on [ICBC’s Learn to Drive Smart, chapter 3](https://www.icbc.com/assets/en/7CsgGUXEIxCwW8xQrqyoLu/drivers3.pdf). The lesson links each example to its source page and links the provincial catalogue for further sign variants.
