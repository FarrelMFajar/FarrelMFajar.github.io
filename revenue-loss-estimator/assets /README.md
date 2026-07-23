# Data — `whoosh-passenger-data-2025-base.csv`

This is the raw dataset the app's charts and metrics are built from. It's one row per **train × boarding leg × seat class**, not one row per train — a single train departure produces several rows (one for each origin→destination segment it covers, split further by seat class).

If you want to recreate a dataset like this from scratch (e.g. for a different period, route, or operator), this file explains what each column means, its exact format, and the quirks to watch for.

## Columns

| Column | Type | Format / example | Description |
|---|---|---|---|
| `train_no` | string | `G1223` | Train identifier. In this dataset, prefix `G` + a 4-digit number. Odd-numbered trains originate at Halim; even-numbered trains originate at Tegalluar Summarecon (see [Conventions](#conventions-specific-to-this-dataset) below). |
| `origin` | string | `Halim`, `Tegalluar`, `Padalarang`, `Karawang` | The boarding station for this leg of the journey. |
| `destination` | string | `Halim`, `Tegalluar`, `Padalarang`, `Karawang` | The alighting station for this leg. `origin`/`destination` pairs always follow the line order **Halim ↔ Karawang ↔ Padalarang ↔ Tegalluar**; a leg is never reversed or out of order. |
| `departure_date` | string (date) | `01/01/2025` | **`DD/MM/YYYY`** — day first. This is *not* the US `MM/DD/YYYY` format; parse accordingly or dates will silently shift for any day ≤ 12. |
| `departure_time` | string (time) | `9:40:00 AM` | 12-hour clock with `AM`/`PM`, no leading zero on the hour, seconds always `:00`. This is the departure time **from the `origin` in this row**, not necessarily the train's original terminus departure time. |
| `seat_class` | string | `First Class`, `Business Class`, `Premium Economy Class` | Fare class for this row's ticket count. |
| `count_of_nett_sales` | integer | `28` | Number of tickets sold for this train + leg + seat class combination. This is what everything in the app is summed from. |

## Row granularity — this is the part people get wrong

A single physical train (e.g. `G1223` departing Halim at 09:40) produces **multiple rows**: one per leg it's sold for (Halim→Karawang, Halim→Padalarang, Halim→Tegalluar, …) times one per seat class with any sales. To get a train's **total passengers**, sum `count_of_nett_sales` across *all* rows sharing that `train_no` (and, if you're doing a per-month breakdown, that departure month) — don't just take one row.

To get a train's **home departure time** (the number the app charts against), find the row(s) where `origin` is the train's terminus station (`Halim` or `Tegalluar`) — that's the actual scheduled departure, not a mid-route boarding time.

## Conventions specific to this dataset

- **Odd/even train numbers indicate direction.** Trains with an odd number (`G1003`, `G1005`, …) start at Halim; even numbers (`G1004`, `G1006`, …) start at Tegalluar. This holds for the whole file but is a dataset convention, not something encoded in a column — infer it, or better, infer origin directly from which `origin` value equals `Halim`/`Tegalluar` for that train number.
- **Karawang is an optional stop.** Roughly every other train skips Karawang entirely (no row will have `origin` or `destination` = `Karawang` for that `train_no`). Whether a train stops at Karawang affects its Halim↔Tegalluar travel time (+54 min if it stops, +47 min if it doesn't, per the schedule poster this app reproduces).
- **The January schedule is different from the rest of the year.** From February onward the same ~62 train-number/departure-time slots repeat every month. January ran a smaller, differently-timed schedule (fewer trains, different times) — if you're replicating this dataset, don't assume every month lines up with every other month.
- **Six trains only run Monday–Saturday**, not Sundays: `G1003, G1005, G1007, G1004, G1006, G1008`. This isn't encoded in the CSV either (there's simply no Sunday row for those trains that week) — it has to be inferred by checking day-of-week coverage per train number.
- **Known data quirk:** at least one row has a corrupted `seat_class` value that looks like a time string (e.g. `7:08:00 PM`) instead of a real seat class — likely a shifted/duplicated field from the source export. If you're parsing this file programmatically, don't hard-fail on an unrecognized `seat_class`; log and skip, or fall back to treating the row as "unknown class" while still counting its `count_of_nett_sales`.

## Recreating this dataset from scratch

If you're assembling an equivalent file from a different source system, aim for:

1. One row per **(train_no, origin, destination, departure_date, departure_time, seat_class)** combination, with `count_of_nett_sales` as the ticket count for that combination.
2. Dates in `DD/MM/YYYY`, times in 12-hour `H:MM:SS AM/PM`.
3. Every leg's `origin`/`destination` should be a real, in-order segment of the route (no skipping backward, no cross-direction legs mixed into one row).
4. Include a row for every seat class actually sold on that leg — omit seat classes with zero sales rather than writing `0` rows (this file has no explicit zero-sales rows).

## Loading a different dataset into the app

The app's **Import CSV** button expects exactly these six columns (any extra columns are ignored, but these are required): `train_no, origin, destination, departure_date, departure_time, count_of_nett_sales` (`seat_class` is read but not required for the app's calculations — passenger counts are simply summed across all rows for a train regardless of class). Column names are matched case-insensitively; column order doesn't matter.
