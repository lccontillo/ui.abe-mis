# Farm Area GIS (`FarmAreaGisView.vue`)

## Overview
**Farm Area GIS** is a specialized spatial GIS management and mapping tool for the Municipal Agriculture Office of Alcala, Cagayan. It allows municipal agriculturists and GIS officers to track farm parcels, search farmer records, process batch GPX track uploads from field GPS surveys, calculate enclosed vs convex-hull polygon surface areas, and export spatial datasets.

---

## Key Features & Capabilities

### 1. Unified Search & Attribute Inspection
- Real-time search by **Farmer Name**, **Location/Barangay**, **Crop Commodity**, or **GPX Track File Name**.
- Instant attribute detail modal showing farmer parcels, polygon geometry method, total hectares, point counts, and coordinates.
- Direct interactive **Locate (🎯)** button that flies the map directly to the matched farm parcel or GPX bounding box.

### 2. Batch GPX Processing & Duplicate Detection
- Drag-and-drop or multi-file selection of `.gpx` tracks.
- Per-file upload progress tracking (`pending` ⏳, `processing` 🔄, `done` ✅, `error` ❌).
- **Proximity Duplicate Detection**: Compares centroid and start/end coordinates of newly uploaded tracks against existing entries using the Haversine formula to alert the user of potential duplicates.
- **Track Area Engine**:
  - Automatically identifies whether a GPX track is **Enclosed (🔲)** (endpoints $\le 50\text{ m}$) or an open survey path requiring **Convex Hull (⬜)** enclosing via Andrew's Monotone Chain algorithm.
  - Computes exact surface area in hectares and square kilometers using ellipsoidal projection adjustments.

### 3. Farmer GIS Registry & Multi-Parcel Management
- **Auto-Fill & Quick Add**: Intelligently strips file formatting and stop words (`FARM`, `LOT`, `PARCEL`, `CAGAYAN`, `ALCALA`, etc.) from GPX filenames to derive clean farmer names.
- Multi-parcel support per farmer: Allows farmers to possess multiple discontinuous land parcels with distinct coordinates and areas.
- Colored parcel badges on the map indicating parcel indices.

### 4. Interactive GIS Tools & Basemaps
- **Measurement Tool (📐)**: Allows freehand polygon boundary plotting on the map, computing the enclosed surface area and displaying dynamic area labels at the polygon centroid.
- **Draw Tool (✏️)**: Dynamic coordinate capture mode with dotted connection lines.
- **Multi-layer Basemap Switcher**:
  - OpenStreetMap Standard
  - Esri World Imagery (Satellite)
  - OpenTopoMap
  - CartoDB Dark Matter
  - CartoDB Voyager
  - CartoDB Positron
  - Esri Topographic Map
- **Density Heatmap (🔥)**: Density visualization layer of all farm parcels and survey points across Alcala.

### 5. Multi-Format Data Export
- **CSV Export**: Formatted spreadsheet including Farmer Name, Location, Commodity, Parcel Number, Area (ha), and Coordinates with UTF-8 BOM encoding for seamless Excel import.
- **JSON Export**: Complete structured farmer dataset.
- **GPX Layer Export**: Generates and downloads individual valid GPX track files with full XML coordinates.

---

## Route Configuration
- **Route Path**: `/farm-area-gis`
- **Route Name**: `farm-area-gis`
- **Component**: `FarmAreaGisView.vue`
- **Sidebar Icon**: `Map20`
