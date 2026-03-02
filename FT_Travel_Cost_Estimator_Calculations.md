# FT Travel Cost Estimator -- Calculation Reference

Last updated: March 2, 2026

---

## Constants

| Constant | Value | Description |
|----------|-------|-------------|
| RT_MULT | 1.44 | Regular Time burden multiplier |
| OT_MULT | 1.68 | Overtime burden multiplier |
| RATES | $28 - $50/hr | Pre-built base rate dropdown range (integer steps) |

---

## Section 1: Project Info

These global inputs feed into every downstream calculation.

| Field | ID | Type | Description |
|-------|----|------|-------------|
| Zip Code | `zipCode` | Input | 5-digit zip; triggers GSA API auto-lookup |
| Project / Location Name | `projectName` | Input | Free text; auto-filled by GSA if blank |
| Total Days | `daysOnSite` | Input | Travel + on-site days combined |
| Total People | `totalPeople` | Input | Number of technicians on the trip |

---

## Section 2: Per Diem & Lodging

Shared across both Driving and Flying estimates.

| Field | Formula |
|-------|---------|
| Hotel Nights | `max(Total Days - 1, 0)` |
| Total / Person | `(Hotel Cost/Night * Hotel Nights) + (Per Diem Food/Day * Total Days)` |

The GSA auto-lookup uses the GSA Per Diem API v2. When a valid zip code is entered, the app fetches the maximum lodging rate across all months for the current fiscal year and the standard meals rate, then populates Hotel Cost/Night and Per Diem Food/Day.

---

## Section 3: Cargo & Logistics

| Field | Applies To |
|-------|-----------|
| Shipping / Freight | Flying total only |
| Trailer Rental | Driving total only |
| Misc Local Supplies/Parts | Both totals |

These are flat dollar amounts added directly to the relevant total(s).

---

## Section 4: Driving Estimate (Option A)

### Round Trip Toggle

When the **Round Trip** checkbox is enabled, a multiplier of 2 is applied to:

- RT travel labor hours
- OT travel labor hours
- Site-to-site mileage

Items NOT doubled by round trip: Load/Unload hours, Home Depot mileage, Dinner mileage, Truck Roll Fee.

### Rate Selection

The base rate (`dBase`) is determined by the Employee Base Rate dropdown. If "Custom..." is selected, the value from the Custom Rate input is used instead.

### Hourly Rate Calculation

The **Unburdened Base Rate** toggle controls how travel hours are billed:

| Toggle State | RT Hourly Rate | OT Hourly Rate |
|-------------|---------------|----------------|
| OFF (default) | `dBase * 1.44` | `dBase * 1.68` |
| ON | `dBase` (straight time) | `dBase` (straight time) |

### Labor Calculations

| Field | Formula |
|-------|---------|
| RT Labor | `RT Hourly Rate * Hours Drive (RT) * tripMult` |
| OT Labor | `OT Hourly Rate * Hours Drive (OT) * tripMult` |
| Load Labor | `(dBase * 1.44) * Load/Unload Hours` |
| Total Labor/Person | `RT Labor + OT Labor + Load Labor` |

Where `tripMult` is 2 if Round Trip is checked, 1 otherwise.

Note: Total Labor/Person shows the cost for a single technician. The Cost Summary section multiplies this by Total People to produce the "Labor for Travel" line item.

Note: The "OT hours same as RT hours" checkbox copies the RT hours value into the OT hours field and locks it.

Note: Load/Unload is always calculated at the fully burdened RT rate (`dBase * 1.44`), regardless of the Unburdened toggle, and is never doubled by the Round Trip toggle.

### Mileage / Vehicle Calculations

| Field | Formula |
|-------|---------|
| Site-to-Site Miles (round trip) | `Miles Between Sites * 2 * tripMult` |
| Home Depot Miles | `Dist. to Home Depot * 2 * Total Days` |
| Dinner Miles | `Dist. to Dinner * 2 * Total Days` |
| Mileage Cost Per Vehicle | `(Site Miles + HD Miles + Dinner Miles) * Mileage Rate` |
| Truck Roll Total | `Truck Roll Fee * Total Vehicles` |
| Total Vehicle Costs | `(Mileage Cost Per Vehicle * Total Vehicles) + Truck Roll Total` |

Note: Site-to-site miles are doubled by the round trip toggle. Home Depot and Dinner miles are already treated as daily round trips (multiplied by 2 and by Total Days) and are not affected by the Round Trip toggle.

### Driving Summary

| Summary Field | Formula |
|---------------|---------|
| Per Diem & Logistics | `(Total People * Per Diem Per Person) + Misc Supplies + Trailer Rental` |
| Labor for Travel | `Total People * Total Labor/Person` |
| Vehicle Costs | `Total Vehicle Costs` (as computed above) |
| Total Travel Costs | `Per Diem & Logistics + Labor for Travel + Vehicle Costs` |
| Avg Cost/Day | `Total Travel Costs / Total Days` |
| Avg/Day/Person | `Avg Cost/Day / Total People` |
| Charge/Day (w/ Buffer) | `Avg Cost/Day * (1 + Buffer%)` |
| Total to Charge | `Charge/Day * Total Days` |

---

## Section 5: Flying Estimate (Option B)

### Round Trip Toggle

When the **Round Trip** checkbox is enabled, a multiplier of 2 is applied to:

- RT travel labor hours
- OT travel labor hours
- Airfare per person
- Baggage / Misc fees

Additionally, **Airport Parking** changes formula:

| Toggle State | Airport Parking Formula |
|-------------|----------------------|
| OFF (default) | `Parking Rate * Total People` |
| ON (round trip) | `Parking Rate * Total People * Total Days` |

Items NOT doubled by round trip: Pack/Prep hours, Rental Vehicle cost.

### Rate Selection

Identical logic to Driving. The base rate (`fBase`) comes from the Flying dropdown or custom input.

### Hourly Rate Calculation

Same toggle behavior as Driving:

| Toggle State | RT Hourly Rate | OT Hourly Rate |
|-------------|---------------|----------------|
| OFF (default) | `fBase * 1.44` | `fBase * 1.68` |
| ON | `fBase` (straight time) | `fBase` (straight time) |

### Labor Calculations

| Field | Formula |
|-------|---------|
| RT Labor | `RT Hourly Rate * Hours Travel (RT) * tripMult` |
| OT Labor | `OT Hourly Rate * Hours Travel (OT) * tripMult` |
| Prep Labor | `(fBase * 1.44) * Pack/Prep Hours` |
| Total Labor/Person | `RT Labor + OT Labor + Prep Labor` |

Where `tripMult` is 2 if Round Trip is checked, 1 otherwise.

Note: Total Labor/Person shows the cost for a single technician. The Cost Summary section multiplies this by Total People to produce the "Labor for Travel" line item.

Note: Pack/Prep is always calculated at the fully burdened RT rate (`fBase * 1.44`), regardless of the Unburdened toggle, and is never doubled by the Round Trip toggle.

### Air Travel Expense Calculations

| Field | Formula |
|-------|---------|
| Airfare Total | `Airfare/Person * Total People * tripMult` |
| Rental Total | `Rental Rate/Day * Total Days` |
| Parking Total | If round trip: `Parking/Person * Total People * Total Days`; otherwise: `Parking/Person * Total People` |
| Baggage Total | `Baggage/Misc * tripMult` |
| Total Air Costs | `Airfare Total + Rental Total + Parking Total + Baggage Total` |

### Flying Summary

| Summary Field | Formula |
|---------------|---------|
| Per Diem & Logistics | `(Total People * Per Diem Per Person) + Misc Supplies + Freight` |
| Labor for Travel | `Total People * Total Labor/Person` |
| Air/Rental Costs | `Total Air Costs` (as computed above) |
| Total Travel Costs | `Per Diem & Logistics + Labor for Travel + Air/Rental Costs` |
| Avg Cost/Day | `Total Travel Costs / Total Days` |
| Avg/Day/Person | `Avg Cost/Day / Total People` |
| Charge/Day (w/ Buffer) | `Avg Cost/Day * (1 + Buffer%)` |
| Total to Charge | `Charge/Day * Total Days` |

---

## Comparison Banner

The banner at the top shows the **Total to Charge** for each option side by side. The lower value is highlighted in green as the "winner." If only one side has a value greater than zero, that side is highlighted.

---

## Employee Rate Reference Table

Pre-computed lookup table assuming a 5-day / 12-hour schedule (8 hrs RT + 4 hrs OT):

| Column | Formula |
|--------|---------|
| Burden RT | `Base Rate * 1.44` |
| RT Cost (8hr) | `Burden RT * 8` |
| Burden OT | `Base Rate * 1.68` |
| OT Cost (4hr) | `Burden OT * 4` |
| 12-Hr Day | `RT Cost + OT Cost` |
| Hrly Avg | `12-Hr Day / 12` |

---

## Data Persistence

### URL Hash

All field values and checkbox states are serialized to JSON, compressed using the browser's `CompressionStream` API (deflate-raw), base64url-encoded, and written to the URL hash fragment. This happens automatically on every recalculation with a 300ms debounce.

When the page loads, the hash is decoded and decompressed to restore the full form state. This means any shared URL contains the complete estimate.

### Saved HTML

The "Save HTML" button captures the current state as embedded JSON inside a `<script type="application/json">` tag within the page itself. The resulting self-contained HTML file can be opened offline and will restore the full estimate from its embedded data.

### Browser Defaults (localStorage)

Users can save their preferred field values as defaults using `localStorage` under the key `ft-travel-defaults`. When the form is reset, it restores from saved defaults instead of factory presets. Project name, zip code, and notes are excluded from defaults.

### Theme Preference

Light/dark mode selection is stored in `localStorage` under `ft-travel-theme`. If no preference is saved, the app respects the OS-level `prefers-color-scheme` media query.

---

## GSA API Integration

The app connects to `api.gsa.gov/travel/perdiem/v2/rates/zip/{zip}/year/{year}` when a 5-digit zip code is entered. It extracts:

- The **maximum monthly lodging rate** across all 12 months for the fiscal year (to guard against seasonal variation)
- The **standard meals rate** for the location

These values populate Hotel Cost/Night and Per Diem Food/Day respectively. If the Project Name field is empty, it is also auto-filled with the city and state from the API response.
