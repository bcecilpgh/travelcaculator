# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fresh Tech Travel Cost Estimator — a self-contained single-page web app for comparing driving vs. flying travel costs for technician dispatches. The entire application lives in a single `index.html` file (HTML + CSS + JS, zero external dependencies).

## Running the App

Open `index.html` directly in a modern browser, or serve it locally:
```bash
npx http-server    # then visit http://localhost:8080
```
No build step, no package manager, no compilation required.

There are no automated tests or linting configured.

## Architecture

**Single-file SPA**: All markup, styles, and logic are in `index.html`. A duplicate exists at `Site/index.html`.

**Key constants** (hardcoded in JS):
- `RT_MULT = 1.44` (Regular Time burden multiplier)
- `OT_MULT = 1.68` (Overtime burden multiplier)
- `RATES` array: $28–$50/hr base rate options

**Core functions**:
- `recalc()` — main calculation engine, triggered on every input change via `oninput`/`onchange` handlers
- `fetchGSARates(zip)` — async GSA Per Diem API v2 lookup (lodging + meal rates by zip code)
- `saveToURL()` — debounced (300ms) compression of form state into URL hash
- `compress(str)` / `decompress(b64)` — deflate-raw via CompressionStream API for URL serialization
- `saveAsHTML()` — exports current estimate as a standalone HTML file with embedded JSON state
- `resetForm()` / `saveDefaults()` / `loadDefaults()` — localStorage-based user preferences

**Data flow**: User input → `oninput` handler → `recalc()` (updates DOM + calculations) → `saveToURL()` (syncs to URL hash)

**State persistence** (4 layers):
1. URL hash — compressed JSON of all fields (primary, enables sharing)
2. localStorage — theme (`ft-travel-theme`) and user defaults (`ft-travel-defaults`)
3. Embedded `<script type="application/json">` — in saved HTML exports
4. Live DOM form values

**Theming**: CSS custom properties with `[data-theme="dark|light"]` selectors. Respects OS `prefers-color-scheme` as fallback.

**Serialization**: Field values tracked in `SERIALIZED_FIELDS` array; checkboxes tracked separately in `CHECKBOX_FIELDS`.

## Calculation Reference

See `FT_Travel_Cost_Estimator_Calculations.md` for complete formula documentation covering driving estimates (Section 4), flying estimates (Section 5), round-trip toggles, burden rate logic, mileage calculations, and the comparison banner.

## Naming Conventions

- Element IDs: camelCase (`driveHoursRT`, `flyLaborTotal`)
- Constants: UPPER_SNAKE_CASE (`RATES`, `RT_MULT`, `LS_KEY`)
- Functions: camelCase (`recalc`, `fetchGSARates`, `saveToURL`)

## Browser Requirements

Requires modern browser with CompressionStream API support (Chrome, Edge, Safari 16.4+, Firefox 113+).
