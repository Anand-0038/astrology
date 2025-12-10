# ✨ AstralSage - Astrology Prediction App

A beautiful, interactive astrology prediction web application built with React and FastAPI. Perfect for demos and learning!

![AstralSage Demo](https://img.shields.io/badge/Status-Demo%20Ready-brightgreen)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)

## 🌟 Features

- **Quick Horoscope**: Get instant daily/weekly guidance by zodiac sign
- **Birth Chart Reading**: Full natal chart analysis with personality insights
- **Compatibility Check**: Compare two birth charts for relationship insights
- **Beautiful UI**: Cosmic-themed design with animations and glassmorphism
- **AI-Powered** (Optional): Uses Google Gemini for enhanced readings
- **Demo Mode**: Works perfectly without API keys using realistic mock data

## 🚀 Quick Start

### Prerequisites

- Python 3.11+ with `uv` (recommended) or `pip`
- Node.js 18+ with `npm`
- (Optional) Google Gemini API key for AI-powered readings

### Backend Setup

```bash
cd backend

# Using uv (recommended)
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -r requirements.txt

# Run the server
python main.py
```

Backend runs at: http://localhost:8000

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs at: http://localhost:5173

## 📁 Project Structure

```
astrology/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── pyproject.toml       # Project configuration
│   └── .env                  # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── components/      # UI components
│   │   ├── index.css        # Tailwind + custom styles
│   │   └── main.jsx         # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## 🔌 API Endpoints

| Endpoint               | Method | Description              |
| ---------------------- | ------ | ------------------------ |
| `/`                    | GET    | API welcome message      |
| `/health`              | GET    | Health check             |
| `/api/quick-horoscope` | POST   | Quick horoscope by sign  |
| `/api/natal-chart`     | POST   | Full birth chart reading |
| `/api/compatibility`   | POST   | Compatibility analysis   |

## 🎨 Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Axios

**Backend:** FastAPI, Pydantic, Google Generative AI (optional)

## ⚠️ Disclaimer

This application is for **entertainment and educational purposes only**.

---

Made with ✨ by AstralSage | Demo Project
# astrology
