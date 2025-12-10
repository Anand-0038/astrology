"""
AstralSage - Astrology Prediction API
FastAPI backend for astrology readings
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
import uuid
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AstralSage API", version="1.0.0")

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Try to initialize Gemini client
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
gemini_model = None

if GEMINI_API_KEY:
    try:
        import google.generativeai as genai

        genai.configure(api_key=GEMINI_API_KEY)
        gemini_model = genai.GenerativeModel("gemini-1.5-flash")
        print("✅ Gemini AI configured successfully!")
    except Exception as e:
        print(f"⚠️ Gemini setup failed: {e}")
        gemini_model = None
else:
    print("ℹ️ No GEMINI_API_KEY found - using mock data (perfect for demo!)")

# System prompt for AstralSage
SYSTEM_PROMPT = """You are "AstralSage", an expert astrology assistant. Always behave as an informational/entertainment service, not a substitute for professional advice. When given birth data (date, time, place) compute or interpret standard western astrological elements (sun, moon, rising/ascendant, houses, major aspects, transits). When asked for compatibility, compare key placements and explain strengths/risks. When asked for daily/weekly forecasts, use transits relative to natal placements.

Output MUST be valid JSON exactly matching the schema provided. Do not include any extra text outside the JSON. Keep language clear, practical, and give short actionable suggestions called "remedies" (e.g., focus actions, reflection prompts) — avoid medical/legal prescriptions. Provide a confidence_score (0–1). If any required input is missing or invalid, return an error object per schema. If geolocation is approximate or birth time unknown, clearly label interpretations as "approximate".

Follow privacy best practices: never invent precise times/locations. If asked to predict events like death, elections, crimes, or illegal/harmful acts, refuse and instead give general, ethical guidance.

response_schema:
{
  "type":"object",
  "properties":{
    "meta":{"type":"object","properties":{"model_version":{"type":"string"},"generated_at":{"type":"string","format":"date-time"}}},
    "request_id":{"type":"string"},
    "input_summary":{"type":"object"},
    "analysis":{"type":"object"},
    "interpretation":{"type":"string"},
    "sections":{"type":"array"},
    "remedies":{"type":"array"},
    "confidence_score":{"type":"number"},
    "warnings":{"type":"array"}
  },
  "required":["meta","request_id","input_summary","analysis","interpretation","sections","remedies","confidence_score"]
}"""


# Request Models
class BirthPlace(BaseModel):
    city: str
    country: str
    lat: Optional[float] = None
    lon: Optional[float] = None


class NatalChartRequest(BaseModel):
    name: Optional[str] = ""
    birth_date: str  # YYYY-MM-DD
    birth_time: str = "unknown"  # HH:MM or "unknown"
    birth_timezone: str = "+00:00"
    birth_place: BirthPlace
    tone: Literal["concise", "friendly", "mystical"] = "friendly"


class QuickHoroscopeRequest(BaseModel):
    sign: str
    period: Literal["today", "tomorrow", "this_week"] = "today"


class CompatibilityRequest(BaseModel):
    person_a_name: Optional[str] = ""
    person_a_birth_date: str
    person_a_birth_time: str = "unknown"
    person_a_birth_place: BirthPlace
    person_b_name: Optional[str] = ""
    person_b_birth_date: str
    person_b_birth_time: str = "unknown"
    person_b_birth_place: BirthPlace
    focus: Literal["romantic", "work", "friendship"] = "romantic"


class TransitForecastRequest(BaseModel):
    birth_date: str
    birth_time: str = "unknown"
    birth_timezone: str = "+00:00"
    birth_place: BirthPlace
    range: Literal["today", "3-day", "7-day"] = "today"
    focus: Literal["career", "love", "health", "general"] = "general"


def generate_mock_natal_response(request: NatalChartRequest) -> dict:
    """Generate a realistic mock response for demo purposes"""
    request_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat() + "Z"

    # Calculate approximate zodiac sign from birth date
    month_day = request.birth_date[5:]  # MM-DD
    signs = [
        ("01-20", "Capricorn"),
        ("02-19", "Aquarius"),
        ("03-20", "Pisces"),
        ("04-20", "Aries"),
        ("05-21", "Taurus"),
        ("06-21", "Gemini"),
        ("07-22", "Cancer"),
        ("08-23", "Leo"),
        ("09-23", "Virgo"),
        ("10-23", "Libra"),
        ("11-22", "Scorpio"),
        ("12-22", "Sagittarius"),
        ("12-31", "Capricorn"),
    ]
    sun_sign = "Aries"
    for end_date, sign in signs:
        if month_day <= end_date:
            sun_sign = sign
            break

    return {
        "meta": {"model_version": "v1.0-astrology", "generated_at": now},
        "request_id": request_id,
        "input_summary": {
            "name": request.name or "Anonymous",
            "birth_date": request.birth_date,
            "birth_time": request.birth_time,
            "birth_place": {
                "city": request.birth_place.city,
                "country": request.birth_place.country,
            },
            "notes": (
                "exact time provided"
                if request.birth_time != "unknown"
                else "time unknown - approximate reading"
            ),
        },
        "analysis": {
            "sun": f"{sun_sign} 15°",
            "moon": (
                "Libra 8°"
                if request.birth_time != "unknown"
                else "Unknown (birth time required)"
            ),
            "ascendant": (
                "Gemini 12°"
                if request.birth_time != "unknown"
                else "Unknown (birth time required)"
            ),
            "dominant_planets": ["Venus", "Mercury"],
            "major_aspects": [
                {"type": "conjunction", "between": "Sun-Mercury", "orb": "2.5°"},
                {"type": "trine", "between": "Moon-Jupiter", "orb": "3.1°"},
                {"type": "square", "between": "Mars-Saturn", "orb": "1.8°"},
            ],
        },
        "interpretation": f"As a {sun_sign}, you possess natural determination and a practical approach to life. Your personality blends creativity with groundedness. You excel when you have clear goals and steady progress. Your challenge is balancing ambition with patience. The cosmic energies suggest this is a great time for learning and personal growth!",
        "sections": [
            {
                "title": "Personality",
                "content": f"Your {sun_sign} Sun gives you a strong core identity. You're known for being reliable, determined, and having a good sense of aesthetics. Friends see you as someone who follows through on commitments.",
            },
            {
                "title": "Career & Studies",
                "content": "Your analytical mind and creative spark make you well-suited for subjects that blend logic with creativity. Consider exploring technology, design, or communication fields. Group projects bring out your best!",
            },
            {
                "title": "Relationships",
                "content": "You value deep, meaningful connections over superficial friendships. You're loyal and supportive, but need intellectual stimulation. Communication is your love language.",
            },
            {
                "title": "Growth Areas",
                "content": "Practice flexibility when plans change. Your perfectionist tendencies can sometimes slow you down. Remember: done is better than perfect!",
            },
        ],
        "remedies": [
            "Start a morning routine: 5 minutes of planning your day's priorities",
            "Try a new creative hobby this month - art, music, or writing",
            "Practice active listening: ask 2 questions before sharing your opinion",
            "Take 3 deep breaths before reacting to stressful situations",
        ],
        "confidence_score": 0.85 if request.birth_time != "unknown" else 0.65,
        "warnings": (
            []
            if request.birth_time != "unknown"
            else [
                "Birth time unknown - Moon and Ascendant calculations are approximate"
            ]
        ),
    }


def generate_mock_horoscope_response(request: QuickHoroscopeRequest) -> dict:
    """Generate a mock quick horoscope"""
    request_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat() + "Z"

    horoscopes = {
        "Aries": {
            "headline": "Bold moves lead to breakthrough moments! 🔥",
            "bullets": [
                "Career: Take initiative in group projects",
                "Social: Reconnect with an old friend",
                "Self: Channel energy into sports or exercise",
            ],
        },
        "Taurus": {
            "headline": "Steady progress brings sweet rewards! 🌿",
            "bullets": [
                "Studies: Focus on one subject deeply today",
                "Money: Good day for saving, not spending",
                "Self: Enjoy some comfort food guilt-free",
            ],
        },
        "Gemini": {
            "headline": "Your words have extra power today! 💬",
            "bullets": [
                "Communication: Express your ideas clearly",
                "Learning: Pick up that book you've been eyeing",
                "Social: Great day for meaningful conversations",
            ],
        },
        "Cancer": {
            "headline": "Home and heart take center stage! 🏠",
            "bullets": [
                "Family: Quality time creates lasting memories",
                "Creative: Try cooking or crafting",
                "Emotional: Journal your feelings tonight",
            ],
        },
        "Leo": {
            "headline": "Time to shine and inspire others! ✨",
            "bullets": [
                "Leadership: Others look to you for guidance",
                "Creative: Your artistic side is strong today",
                "Social: You're the life of the party",
            ],
        },
        "Virgo": {
            "headline": "Organization leads to opportunities! 📚",
            "bullets": [
                "Studies: Perfect day for detailed work",
                "Health: Start a new wellness habit",
                "Practical: Organize your space, clear your mind",
            ],
        },
        "Libra": {
            "headline": "Balance and beauty guide your day! ⚖️",
            "bullets": [
                "Relationships: Resolve any lingering conflicts",
                "Artistic: Appreciate beauty around you",
                "Decision: Trust your sense of fairness",
            ],
        },
        "Scorpio": {
            "headline": "Deep insights surface today! 🦂",
            "bullets": [
                "Research: Dig deeper into topics that fascinate you",
                "Intuition: Trust your gut feelings",
                "Transformation: Let go of what no longer serves you",
            ],
        },
        "Sagittarius": {
            "headline": "Adventure calls your name! 🏹",
            "bullets": [
                "Learning: Explore new ideas and cultures",
                "Social: Plan something fun with friends",
                "Growth: Step outside your comfort zone",
            ],
        },
        "Capricorn": {
            "headline": "Hard work pays off today! 🏔️",
            "bullets": [
                "Goals: Make progress on long-term plans",
                "Responsibility: Others count on you",
                "Career: Leadership qualities shine through",
            ],
        },
        "Aquarius": {
            "headline": "Innovation and friendship align! 💡",
            "bullets": [
                "Ideas: Your unique perspective is valuable",
                "Technology: Good day for tech projects",
                "Community: Connect with like-minded people",
            ],
        },
        "Pisces": {
            "headline": "Creativity and intuition flow freely! 🌊",
            "bullets": [
                "Artistic: Express yourself through art or music",
                "Dreams: Pay attention to nighttime messages",
                "Compassion: Help someone who needs it",
            ],
        },
    }

    sign_data = horoscopes.get(request.sign, horoscopes["Aries"])

    return {
        "meta": {"model_version": "v1.0-astrology", "generated_at": now},
        "request_id": request_id,
        "input_summary": {"sign": request.sign, "period": request.period},
        "analysis": {
            "sign": request.sign,
            "period": request.period,
            "ruling_planet": get_ruling_planet(request.sign),
        },
        "interpretation": sign_data["headline"],
        "sections": [
            {"title": point.split(":")[0], "content": point.split(":")[1].strip()}
            for point in sign_data["bullets"]
        ],
        "remedies": [
            f"Lucky color: {get_lucky_color(request.sign)}",
            f"Lucky number: {get_lucky_number(request.sign)}",
            "Best time for important tasks: Morning hours",
        ],
        "confidence_score": 0.75,
        "warnings": [],
    }


def get_ruling_planet(sign: str) -> str:
    planets = {
        "Aries": "Mars",
        "Taurus": "Venus",
        "Gemini": "Mercury",
        "Cancer": "Moon",
        "Leo": "Sun",
        "Virgo": "Mercury",
        "Libra": "Venus",
        "Scorpio": "Pluto",
        "Sagittarius": "Jupiter",
        "Capricorn": "Saturn",
        "Aquarius": "Uranus",
        "Pisces": "Neptune",
    }
    return planets.get(sign, "Sun")


def get_lucky_color(sign: str) -> str:
    colors = {
        "Aries": "Red",
        "Taurus": "Green",
        "Gemini": "Yellow",
        "Cancer": "Silver",
        "Leo": "Gold",
        "Virgo": "Navy Blue",
        "Libra": "Pink",
        "Scorpio": "Maroon",
        "Sagittarius": "Purple",
        "Capricorn": "Brown",
        "Aquarius": "Electric Blue",
        "Pisces": "Sea Green",
    }
    return colors.get(sign, "Blue")


def get_lucky_number(sign: str) -> int:
    numbers = {
        "Aries": 9,
        "Taurus": 6,
        "Gemini": 5,
        "Cancer": 2,
        "Leo": 1,
        "Virgo": 5,
        "Libra": 6,
        "Scorpio": 8,
        "Sagittarius": 3,
        "Capricorn": 4,
        "Aquarius": 7,
        "Pisces": 7,
    }
    return numbers.get(sign, 7)


def generate_mock_compatibility_response(request: CompatibilityRequest) -> dict:
    """Generate a mock compatibility response"""
    request_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat() + "Z"

    return {
        "meta": {"model_version": "v1.0-astrology", "generated_at": now},
        "request_id": request_id,
        "input_summary": {
            "person_a": request.person_a_name or "Person A",
            "person_b": request.person_b_name or "Person B",
            "focus": request.focus,
        },
        "analysis": {
            "person_a_sun": "Taurus",
            "person_b_sun": "Cancer",
            "compatibility_score": 78,
            "element_harmony": "Earth + Water = Fertile Ground",
        },
        "interpretation": f"This {request.focus} connection shows strong potential! Both individuals value loyalty and emotional security. The combination creates a nurturing dynamic where each person's strengths complement the other's needs.",
        "sections": [
            {
                "title": "Top 3 Strengths",
                "content": "1. Deep emotional understanding\n2. Shared values of loyalty and commitment\n3. Complementary communication styles",
            },
            {
                "title": "Potential Friction Points",
                "content": "1. Different approaches to change (one prefers stability, other seeks growth)\n2. Communication timing - one processes feelings slowly\n3. Social energy levels may differ",
            },
            {
                "title": "Making It Work",
                "content": "Schedule regular check-ins to share feelings. Respect each other's pace. Celebrate differences as strengths, not obstacles.",
            },
        ],
        "remedies": [
            "Practice patience: allow each other processing time",
            "Create shared rituals: weekly hangouts or activities",
            "Learn each other's love languages",
            "Celebrate small wins together",
        ],
        "confidence_score": 0.72,
        "warnings": ["Birth times unknown - analysis based on Sun signs only"],
    }


async def call_gemini(prompt: str) -> dict:
    """Call Gemini API - falls back to mock if no API key"""
    if not gemini_model:
        return None

    try:
        full_prompt = SYSTEM_PROMPT + "\n\n" + prompt
        response = gemini_model.generate_content(full_prompt)
        import json

        # Clean up response - remove markdown code blocks if present
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        print(f"Gemini API error: {e}")
        return None


# API Endpoints
@app.get("/")
async def root():
    return {
        "message": "Welcome to AstralSage API! 🌟",
        "version": "1.0.0",
        "endpoints": [
            "/api/natal-chart",
            "/api/quick-horoscope",
            "/api/compatibility",
            "/api/transit-forecast",
        ],
    }


@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@app.post("/api/natal-chart")
async def natal_chart(request: NatalChartRequest):
    """Generate a full natal/birth chart reading"""
    # Build prompt
    prompt = f"""Task: natal_chart
request_id: "{uuid.uuid4()}"

Data:
- name: "{request.name}"
- birth_date: "{request.birth_date}"
- birth_time: "{request.birth_time}"
- birth_timezone: "{request.birth_timezone}"
- birth_place: {{ city: "{request.birth_place.city}", country: "{request.birth_place.country}" }}
- tone: "{request.tone}"

Instructions:
1) Summarize input.
2) Compute Sun, Moon, Ascendant (if birth_time known). If time unknown, note limitations.
3) List top 8 placements and 4 major aspects.
4) Provide concise interpretation (max 250 words).
5) Provide 3-4 practical remedies/actions suitable for students.
6) Provide confidence_score.
Return JSON matching schema."""

    # Try Gemini, fallback to mock
    result = await call_gemini(prompt)
    if not result:
        result = generate_mock_natal_response(request)

    return result


@app.post("/api/quick-horoscope")
async def quick_horoscope(request: QuickHoroscopeRequest):
    """Generate a quick horoscope by zodiac sign"""
    prompt = f"""Task: quick_horoscope
request_id: "{uuid.uuid4()}"
Data:
- sign: "{request.sign}"
- period: "{request.period}"
- tone: "friendly"

Instructions: Give a 1-line headline + 3 actionable bullets (studies/social/self for students). Keep it fun and positive. Return JSON matching schema."""

    result = await call_gemini(prompt)
    if not result:
        result = generate_mock_horoscope_response(request)

    return result


@app.post("/api/compatibility")
async def compatibility(request: CompatibilityRequest):
    """Generate a compatibility reading between two people"""
    prompt = f"""Task: compatibility
request_id: "{uuid.uuid4()}"
Data:
- person_a: {{name: "{request.person_a_name}", birth_date: "{request.person_a_birth_date}"}}
- person_b: {{name: "{request.person_b_name}", birth_date: "{request.person_b_birth_date}"}}
- focus: "{request.focus}"

Instructions: Compare sun signs. Give top 3 strengths, top 3 friction points, 3 practical tips for friendship/teamwork. Keep it appropriate for students. Return JSON."""

    result = await call_gemini(prompt)
    if not result:
        result = generate_mock_compatibility_response(request)

    return result


@app.post("/api/transit-forecast")
async def transit_forecast(request: TransitForecastRequest):
    """Generate a transit/daily forecast"""
    prompt = f"""Task: transit_forecast
request_id: "{uuid.uuid4()}"
Data:
- birth_date: "{request.birth_date}"
- birth_time: "{request.birth_time}"
- range: "{request.range}"
- focus: "{request.focus}"

Instructions: Identify relevant transits and give practical guidance for students. Return JSON."""

    # For demo, use quick horoscope with calculated sign
    month_day = request.birth_date[5:]
    signs = [
        ("01-20", "Capricorn"),
        ("02-19", "Aquarius"),
        ("03-20", "Pisces"),
        ("04-20", "Aries"),
        ("05-21", "Taurus"),
        ("06-21", "Gemini"),
        ("07-22", "Cancer"),
        ("08-23", "Leo"),
        ("09-23", "Virgo"),
        ("10-23", "Libra"),
        ("11-22", "Scorpio"),
        ("12-22", "Sagittarius"),
        ("12-31", "Capricorn"),
    ]
    sun_sign = "Aries"
    for end_date, sign in signs:
        if month_day <= end_date:
            sun_sign = sign
            break

    horoscope_req = QuickHoroscopeRequest(sign=sun_sign, period="today")
    result = generate_mock_horoscope_response(horoscope_req)
    result["input_summary"]["focus"] = request.focus
    result["input_summary"]["range"] = request.range

    return result


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
