# ALLYVEX
### Autonomous Strategic Sales Intelligence Engine

> Give it a company domain. It figures out everything else.

---

## What Is ALLYVEX?

ALLYVEX is a multi-agent AI system that analyzes any company and delivers a dual-track sales verdict — should you pursue them as a **customer** or a **business partner** — in under 3 minutes.

Four specialized agents argue with each other. A Bull agent builds the case for pursuing. A Bear agent tries to kill the deal. A Detective audits both sides for weak evidence. An Orchestrator weighs the debate and makes the final call.

No human guidance. No templates. Just a domain and a verdict.

---

## What Makes It Different

- **Dual-track evaluation** — every company analyzed as a potential customer AND a potential business partner simultaneously
- **Scale-adaptive analysis** — a startup and an enterprise are evaluated with completely different criteria
- **Client-specific intelligence** — agents know what your company sells and filter every signal through that lens
- **Debate architecture** — agents argue, not summarize. The verdict is earned through evidence, not just the last agent's output
- **Live reasoning** — every agent's fact-by-fact thinking streams to the frontend in real time

---

## How It Works

```
Step 1 — Client Onboarding
Enter your company URL
↓
Backend scrapes your website + searches external sources
↓
Generates a structured client profile (what you sell, who you sell to)
↓
You review and confirm

Step 2 — Lead Analysis
Enter a target company domain
↓
Bull searches for buying signals and partner signals
Bear searches for red flags and scale disqualifiers
Detective audits both sides, verifies scale, detects split verdicts
Orchestrator makes two independent verdicts with outreach emails
↓
Customer verdict + Partner verdict + Recommended approach
```

---

## Demo

```
Client:       DataVex (AI data pipeline company)
Target:       notion.so

Bull          "Series B closed 3 months ago, 40 open engineering roles — strong customer signal"
              "API-first with marketplace ecosystem — strong partner signal"

Bear          "Atlassian enterprise deal detected — competitor lock-in risk"
              "Notion building internal data layer — potential partner conflict"

Detective     "Bull's funding claim verified. Bear's Atlassian claim is 8 months old — stale"
              "Customer track STRONG. Partner track MODERATE. Recommend CUSTOMER_FIRST"

Orchestrator  "Customer: PURSUE — Confidence 88/100 — Regret Score 91/100"
              "Partner: HOLD — revisit when partner program launches"

Output        Two verdicts. Two outreach emails. One recommended approach.
```

---

## Project Structure

```
ALLYVEX/
│
├── backend/
│   ├── agents/
│   │   ├── bull.py              # Dual-track buying signal researcher
│   │   ├── bear.py              # Dual-track red flag researcher
│   │   ├── detective.py         # Evidence auditor and split verdict generator
│   │   └── orchestrator.py      # Final dual-track verdict and email writer
│   │
│   ├── orchestration/
│   │   └── war_room.py          # Pipeline coordination and SSE streaming
│   │
│   ├── utils/
│   │   ├── parser.py            # JSON extraction and error handling
│   │   ├── search_tools.py      # Tavily web search wrapper
│   │   ├── scraper.py           # Website content extraction
│   │   └── doc_generator.py     # Client profile generation from URL
│   │
│   ├── outputs/                 # Generated files
│   ├── main.py                  # FastAPI server
│   ├── test.py                  # Local pipeline test runner
│   ├── requirements.txt
│   └── .env                     # API keys — never commit this
│
├── frontend/
│   ├── src/                     # React source files
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

---

## Tech Stack

| Layer | Technology | Reason |
|-------|------------|--------|
| Backend | Python + FastAPI | Async-native, SSE support, team's primary language |
| Streaming | Server-Sent Events | Real-time one-way stream from server to browser |
| Bull / Bear / Detective | Groq LLaMA 3.3 70B | Fast, free, reliable JSON output |
| Orchestrator | Mistral Large | Strong multi-step reasoning for dual verdicts |
| Web Search | Tavily API | Structured search results, free tier |
| Scraping | httpx + BeautifulSoup | Client website content extraction |
| Frontend | React + Tailwind + Vite | Fast build, team's strength |

---

## Setup and Installation

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher

### Step 1 — Clone the repository
```bash
git clone https://github.com/your-username/allyvex.git
cd allyvex
```

### Step 2 — Backend setup
```bash
cd backend
pip install -r requirements.txt
```

### Step 3 — Create .env file inside backend/
```
GROQ_API_KEY=your_groq_key
MISTRAL_API_KEY=your_mistral_key
TAVILY_API_KEY=your_tavily_key
```

Get your free API keys here:
- **Groq** — https://console.groq.com — free, no card needed
- **Mistral** — https://console.mistral.ai — free tier available
- **Tavily** — https://tavily.com — 1000 free searches/month

### Step 4 — Test the pipeline
```bash
cd backend
python test.py
```

You should see all 4 agents run sequentially and print their reasoning.
The final output shows both customer and partner verdicts with outreach emails.
Always run this before touching the frontend.

### Step 5 — Start the backend server
```bash
cd backend
python -m uvicorn main:app --reload
```

Server runs at http://localhost:8000

### Step 6 — Start the frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173

---

## API Reference

### POST /api/generate-client-profile
Scrapes client URL and generates a structured profile document.

```json
Request:  { "url": "https://your-company.com" }
Response: { "status": "success", "clientProfile": "Company: YourCompany\n..." }
```

### POST /api/analyze
Runs the full 4-agent War Room. Returns a real-time SSE stream.

```json
Request:
{
  "domain": "stripe.com",
  "client_info": "Company: DataVex\nWhat we do: ..."
}
```

SSE Events returned in order:
```
BULL_START → BULL_DONE
BEAR_START → BEAR_DONE
DETECTIVE_START → DETECTIVE_DONE
ORCHESTRATOR_START → ORCHESTRATOR_DONE
COMPLETE
[DONE]
```

Each DONE event includes a thinking array of {fact, reasoning} objects
rendered live in the frontend as the agent's visible reasoning process.

---

## Sample Output

```json
{
  "companyName": "Stripe",
  "confirmedScale": "ENTERPRISE",
  "recommendedApproach": "CUSTOMER_FIRST",
  "customerTrack": {
    "verdict": "PURSUE",
    "confidence": 88,
    "regretScore": { "score": 91, "reason": "APAC expansion — decisions being made now" },
    "targetDecisionMaker": { "title": "VP of Data Engineering" },
    "outreachEmail": {
      "subject": "Data pipeline for your APAC expansion",
      "body": "Hi [Name], saw Stripe's infrastructure expansion announcement..."
    }
  },
  "partnerTrack": {
    "verdict": "HOLD",
    "confidence": 61,
    "regretScore": { "score": 45, "reason": "No active partner program found" }
  }
}
```

---

## The Agents

**Bull — The Optimist**
Aggressively finds every reason to pursue. Searches for funding, hiring velocity,
technical debt, fiscal pressure, and partner ecosystem signals. Adapts to company scale.

**Bear — The Skeptic**
Ruthlessly finds every reason to walk away. Checks for competitor lock-in,
scale disqualifiers, budget freezes, leadership instability, and direct product conflicts.

**Detective — The Auditor**
Has no opinion. Audits Bull and Bear's evidence quality independently for each track.
Verifies scale estimates. Produces a split verdict when the two tracks diverge.

**Orchestrator — The Judge**
Receives all findings. Searches nothing. Makes two independent verdicts, writes two
outreach emails calibrated to the target's scale, recommends which track to pursue first.

---

## Company Scale Adaptation

| Scale | Employees | Revenue | Key Behavior |
|-------|-----------|---------|--------------|
| STARTUP | Under 100 | Pre-Series B | Founder decisions, fast cycles |
| SMB | 100-500 | $5M-$50M | Growth-focused, outgrowing manual processes |
| MID_MARKET | 500-2000 | $50M-$500M | Digital transformation, technical debt |
| ENTERPRISE | 2000+ | $500M+ | Committee decisions, 6-18 month cycles |

---

## Built At

Built during a 12-hour hackathon by Team ALLYVEX, powered by DataVex.
