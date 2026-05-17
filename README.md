# TravelAssist — AI-Driven Mobility Platform
> Final Year Project | Sri Sai Ram Institute of Technology

## Project Structure

```
TravelAssist/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx                        ← React entry point
    ├── App.jsx                         ← Root app (routing via state)
    │
    ├── constants/
    │   └── theme.js                    ← Colors, design tokens, NAV config
    │
    ├── components/
    │   ├── common/
    │   │   ├── GStyle.jsx              ← Global CSS injection
    │   │   ├── Icon.jsx                ← SVG icon library
    │   │   ├── Card.jsx                ← Base card container
    │   │   ├── Badge.jsx               ← Status badge pill
    │   │   ├── Btn.jsx                 ← Button (primary/green/outline/ghost/danger)
    │   │   └── StatCard.jsx            ← Dashboard metric card
    │   │
    │   └── layout/
    │       ├── Sidebar.jsx             ← Left navigation sidebar
    │       └── TopBar.jsx              ← Sticky top header
    │
    └── pages/
        ├── AuthPage.jsx                ← Login & Register
        ├── Dashboard.jsx               ← Home dashboard
        ├── VehicleDiagnostics.jsx      ← OBD-II sensor + RF classification
        ├── TripPlanning.jsx            ← Route planning + map
        ├── Services.jsx                ← On-demand service booking
        ├── EmergencySOS.jsx            ← Emergency SOS broadcast
        ├── Notifications.jsx           ← Notification centre
        └── Profile.jsx                 ← User & vehicle profile
```

---

## Setup & Run

### Prerequisites
- Node.js v18 or above
- npm v9 or above

### Steps

```bash
# 1. Navigate into the project folder
cd TravelAssist

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## Features

| Feature                | Description |
|------------------------|-------------|
| Login / Register       | Auth with demo mode |
| Dashboard              | Stats, quick actions, route mini-map |
| Vehicle Diagnostics    | OBD-II sliders, Random Forest ML simulation, fault history |
| Trip Planning          | Route planning with SVG map, Dijkstra / A* route options |
| Services               | Emergency, Fuel, EV Charging, Repair booking |
| Emergency SOS          | GPS broadcast with countdown + nearby contacts |
| Notifications          | Read/unread notification centre |
| Profile                | Editable user & vehicle info |

---

## ML Model

The Random Forest vehicle fault classifier (`VehicleDiagnostics.jsx`) is simulated in the frontend for demo purposes.

The full Python implementation with:
- Synthetic OBD-II dataset generation
- Model training, evaluation, and feature importance
- Confusion matrix and classification report

…is in the separate **Jupyter Notebook** file:  
`TravelAssist_VehicleDiagnostics_RF.ipynb`

---

*Built as part of the IEEE paper: "AI-Driven IoT Framework for Integrated Roadside Assistance and Intelligent Mobility Services"*
