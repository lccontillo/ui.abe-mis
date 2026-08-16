# Farm-to-Market Road (FMR) Network Plan (`NetworkPlanView`)

The **FMR Network Plan** view (`/fmr-network-plan`) provides spatial GIS analytics, road influence buffering, land use intersection calculations, agricultural economic impact modeling, and proposal management for the Municipal Agriculture Office (MAO) of Alcala, Cagayan.

---

## 1. Core Capabilities

1. **Multi-Format Vector Ingestion**:
   - Accepts **KML**, **KMZ**, **GeoJSON**, and standard **JSON** datasets.
   - Robust XML parser extracts `Placemark` geometries (`LineString`, `MultiLineString`, `Polygon`, `MultiPolygon`) and parses custom attributes from `ExtendedData` and `SchemaData`.

2. **Spatial Buffering & Corridor Analysis**:
   - Geodesic road buffering using **Turf.js** with configurable distance (default: **500 meters** per side / 1 km corridor).
   - Multi-segment union processing to create continuous influence polygon zones.

3. **Land Use Intersection & Classification**:
   - Auto-detects and scores land classification metadata fields (e.g. `landclass`, `landcover`, `landuse`, `lu_code`, `class`, `type`).
   - Computes exact polygon-in-polygon clipping intersections.
   - Calculates absolute area (hectares & square meters), percentage of road influence buffer, and percentage of total clipped area.

4. **Agricultural & Socio-Economic Impact Modeling**:
   - **Cost Estimation**: Unit-based estimation for Concrete (₱12M/km), Asphalt (₱9M/km), and Gravel (₱4M/km).
   - **Beneficiary Modeling**: Auto-filters agricultural land types (rice, corn, palay, vegetable, crops) and computes estimated beneficiary farmers based on average farm parcel sizes (default: 0.50 ha/farmer).
   - **Feasibility Metrics**: Cost per hectare served and cost per farmer beneficiary.

5. **Persistent Storage & Proposal Repository**:
   - Land use map caching across sessions via **IndexedDB** & **localStorage**.
   - Proposal save / load / delete management with status lifecycles (`Draft`, `For Review`, `Approved`, `Funded`, `Completed`).
   - Export support for **CSV Analysis Reports** and **Multi-layer GeoJSON datasets**.

6. **Interactive Mapping & Visualizations**:
   - Leaflet map with OpenStreetMap & Esri World Imagery Satellite basemap toggle.
   - Interactive popups with geometry area calculations and property inspection.
   - Chart.js visualizations: Donut chart (Land Use Distribution) and horizontal bar chart (Area by Category).
   - Diagnostic detection with distance gap calculation if road buffer and land use polygons do not overlap.

---

## 2. Integration & Routing

- **Route Path**: `/fmr-network-plan`
- **Route Name**: `fmr-network-plan`
- **Component File**: [`src/views/NetworkPlanView.vue`](file:///C:/Users/LENOVO/ui.abe-mis/src/views/NetworkPlanView.vue)
- **Navigation**: Carbon Icon `Road20` placed in main sidebar navigation (`src/App.vue`).

---

## 3. UI / Design System Alignment

`NetworkPlanView` conforms with the ABE Alcala MIS UI tokens:
- **Brand Palette**: `--brand-600` (`#2e7d32`), `--brand-700` (`#1a5e2a`), `--brand-50` (`#e8f5e9`).
- **Typography & Inputs**: Standard field labels, `.field-control-sm`, `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`.
- **Feedback**: Integrated with `useToast` (`success`, `warning`, `error`, `info`) and `useConfirmDialog` for proposal deletion.
