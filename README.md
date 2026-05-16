# 🗺 MapVision — React + Express

A modern, fully-editable map application with a React frontend and a Node.js/Express backend.

---

## 📁 Project Structure

```
MAPVISION/
├── frontend/
│   ├── index.html                    ← Vite HTML entry
│   ├── vite.config.js                ← Dev server + API proxy
│   ├── package.json                  ← npm start → runs the React app
│   └── src/
│       ├── index.jsx                 ← React root
│       ├── App.jsx                   ← Composes all layout
│       ├── App.css                   ← CSS variables / animations
│       ├── index.css                 ← Global reset
│       ├── context/AppContext.jsx    ← Global state
│       ├── services/api.js           ← All backend fetch calls
│       └── components/
│           ├── Map/                  ← Leaflet map + pins
│           ├── Header/               ← Search bar + nav buttons
│           ├── Panel/                ← Sidebar (Explore/Routes/Saved)
│           ├── PlaceCard/            ← Place list card
│           ├── RoutePanel/           ← Directions form
│           ├── InfoPopup/            ← Place detail popup
│           ├── Toast/                ← Notifications
│           ├── MapControls/          ← Zoom / fullscreen
│           ├── LayerMenu/            ← Map style switcher
│           └── BottomBar/            ← Mobile nav bar
└── backend/
    ├── server.js                     ← Express entry point
    ├── .env.example                  ← Copy to .env
    ├── package.json                  ← npm run dev → starts server
    └── src/
        ├── routes/                   ← markers, saved, search
        ├── controllers/              ← business logic
        └── data/markers.js           ← seed data
```

---

## ✅ Requirements

- **Node.js** v18 or newer → https://nodejs.org (download LTS)
- **npm** (comes with Node.js)

---

## 🚀 Step-by-Step: Running the App

### Step 1 — Open your terminal / command prompt

On Windows: press `Win + R`, type `cmd`, hit Enter  
On Mac: press `Cmd + Space`, type `Terminal`, hit Enter

---

### Step 2 — Start the Backend

```bash
cd MAPVISION/backend
npm install
npm run dev
```

You should see:
```
🗺  MapVision API  →  http://localhost:5000
```

**Keep this terminal open.**

---

### Step 3 — Start the Frontend (new terminal window)

Open a second terminal, then:

```bash
cd MAPVISION/frontend
npm install
npm start
```

You should see:
```
  VITE ready in 400ms

  ➜  Local:   http://localhost:3000/
```

Your browser will open automatically at **http://localhost:3000**

---

## 🌐 API Endpoints (Backend)

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/markers` | All map markers |
| GET | `/api/markers?category=food` | Filter by category |
| GET | `/api/markers/:id` | Single marker |
| GET | `/api/search?q=ashram` | Search places |
| GET | `/api/directions?from=A&to=B&mode=drive` | Get directions |
| GET | `/api/saved` | All saved places |
| POST | `/api/saved` | Save a place |
| DELETE | `/api/saved/:id` | Remove saved place |

---

## 🎨 Customizing

### Change map markers
Edit `backend/src/data/markers.js` — add your own lat/lng, emoji, and place names.

### Change colours / theme
Edit `frontend/src/App.css` — all colours are CSS variables at the top:
```css
:root {
  --accent: #3fb950;   /* green */
  --blue:   #58a6ff;   /* blue  */
  --bg:     #0d1117;   /* dark background */
}
```

### Change the default map location
Edit `frontend/src/components/Map/MapView.jsx`, line:
```js
.setView([23.033, 72.585], 13)  // [latitude, longitude], zoom level
```

### Add a real database
Replace the arrays in `backend/src/data/markers.js` and
`backend/src/controllers/savedController.js` with MongoDB / PostgreSQL queries.

---

## ❓ Troubleshooting

| Problem | Fix |
|---------|-----|
| `npm: command not found` | Install Node.js from nodejs.org |
| Backend won't start — port in use | Change PORT in `.env` |
| Map not loading | Make sure backend is running first |
| `CORS error` in production | Set `FRONTEND_URL` in `backend/.env` |
| Browser doesn't open | Go to http://localhost:3000 manually |
