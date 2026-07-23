# Whoosh Schedule Planner

An interactive, single-file web app for exploring "what if we cut Whoosh train frequency at night" — and seeing exactly what it costs in passengers and revenue before anyone commits to a real schedule change.

**[Open the app](index.html)** — no install, no server, no build step. Double-click `index.html` and it runs in any browser.

![type](https://img.shields.io/badge/type-single--file%20HTML%2FJS-blue) ![deps](https://img.shields.io/badge/dependencies-none-brightgreen) ![data](https://img.shields.io/badge/data-Jan--Dec%202025-lightgrey)

---

## Background

Whoosh (the Jakarta–Bandung high-speed rail) currently runs a dense timetable — a train departing roughly every 25–35 minutes from both Halim and Tegalluar Summarecon, from before 6 AM to past 9 PM. That's a lot of operating hours, and every hour a train isn't required to run is an hour of maintenance, crew, and energy cost that could be recovered — **if** it doesn't cost too many passengers or too much revenue.

This project started as a straightforward question: *if we imposed a mandatory "window time" (a maintenance/downtime block) somewhere in the schedule, which block would hurt the least — and how much would it actually cost?* Answering that by hand, across 62 trainsets and 12 months of ridership data gets tedious fast, and static numbers don't let you actually *feel* the trade-off of "what if we cut this specific train instead of that one."

## What problem this solves

- **Static reports go stale the moment you ask "what about a slightly different cut?"** This app lets you drag a selection window over the timetable and get live numbers back — no re-running a script, no re-opening Excel.
- **"Which trains to cut" and "how much downtime do we get" are two sides of the same coin**, and they're hard to reason about together on paper. The chart ties them into one interactive surface.
- **Revenue impact is the number decision-makers actually want**, not just "we removed 12 trains." This tool converts every cut directly into daily revenue lost, at whatever fare assumption you choose.

## Who this is for

- **Whoosh / Railway schedule planners** evaluating maintenance-window or off-peak-cut proposals.
- **Analysts** who need a defensible, adjustable revenue-impact number for a specific proposed schedule, not just a rough estimate.
- **Anyone presenting a scenario** to stakeholders — the app generates a copy-pasteable narrative summary and an exportable poster-style departure schedule, so the output is meeting-ready, not just a chart on a screen.

## What it does

- **Interactive bar chart** of average (or total) daily passengers per trainset, ordered by departure time, colored by origin (Halim / Tegalluar).
- **Click-and-drag selection** of which trains stay in service — drag to select, drag the edges to resize, drag the middle to pan (wraps around), Ctrl-drag to add a range, Shift-drag to remove one.
- **Live "window time" planning**: propose a downtime block (e.g. 15 hours), set pre/post buffers, and the app tells you whether your current train selection actually leaves enough non-operating time to fit it — color-coded red/green.
- **Revenue impact, computed live**: total daily revenue, revenue for your current selection, revenue lost, and passenger loss (as a percentage and a headcount) — all driven by an editable average-revenue-per-passenger assumption.
- **Month filtering**: pick any combination of Jan–Dec to compute the averages/totals from. (Note: January ran a different, smaller timetable than the rest of the year — the app handles that automatically rather than pretending it lines up.)
- **Average vs. Total toggle**: flip the whole chart and every metric between "average per day" and "total across the selected months."
- **Auto-generated narrative** ("Asumsi" / "Hasil") — a ready-to-copy plain-language summary of the assumptions and results, in bilingual (ID/EN as noted) form.
- **Departure schedule generator** — recreates the familiar Whoosh timetable poster layout for whichever trains are currently selected, exportable as PNG or sent straight to print/PDF.
- **CSV import/export** — load your own dataset (same columns as the base file) to re-run this whole analysis on different data, and export the currently-displayed aggregated numbers back out as CSV.

## Data

- `data/whoosh-passenger-data-2025-base.csv` — the base dataset the app ships with (train number, origin, destination, date, time, seat class, ticket count).
- The app doesn't read this CSV at runtime — the relevant per-train, per-month passenger sums are pre-aggregated and embedded directly in `index.html`, so the page works fully offline with no fetch/build step. The raw CSV is kept in the repo for transparency and so the numbers can be independently reproduced or extended.
- Want to analyze a different period or route? Use the **Import CSV** button — as long as your file has the same column headers, the app rebuilds the entire chart from it.

## How to use it

1. **Open `index.html`** in a browser (or visit the hosted version, if deployed).
2. **Pick your months** in the "Bulan" selector — defaults to the full year.
3. **Select which trains stay in service** by dragging across the bars. Use the edge handles to resize, or drag the middle to slide the window around.
4. **Set your window-time assumptions** — proposed downtime length, and pre/post buffers — in the "Window time settings" box. Card B turns green when your selection leaves enough non-operating time to fit it, red when it doesn't.
5. **Adjust the fare assumption** ("Avg revenue / passenger") to match your scenario.
6. **Read off the impact** from the metric cards: trainsets kept, revenue lost, passenger loss, operating hours, etc.
7. **Copy the narrative** for a report, or **generate the departure schedule** and export it as PNG / print to PDF.
8. Need to check a different dataset? **Import CSV** with the same structure, or **Export CSV** to pull the currently displayed numbers into a spreadsheet.

No installation, no dependencies, no tracking — everything runs client-side in the browser.

## Tech notes

- Single HTML file, vanilla JavaScript, no frameworks or build tooling.
- Works fully offline once downloaded.
- Schedule PNG export uses the Canvas API directly (no external image/chart libraries).
- Designed to be forked/hosted trivially: GitHub Pages, Netlify Drop, or just opened locally.

## License / attribution

Ridership figures are derived from the accompanying base CSV for scenario-planning purposes; verify against official KCIC/Whoosh data before using in a real operational decision.
