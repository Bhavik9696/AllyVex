# ALLYVEX 
### Autonomous Strategic Sales Intelligence Engine

> Give it a company domain. It figures out everything else.

---

## What Is ALLYVEX?

Traditional sales research is slow, biased, and manual.
ALLYVEX replaces that with four specialized AI agents that argue with each other — and only reach a verdict when the evidence holds up.

No human guidance. No templates. Just a domain name and a verdict in under 2 minutes.

---

## Watch It Work

```
Input:        notion.so
              |
Bull          "They raised $275M, hiring 40 engineers — strong buy signal"
Bear          "Atlassian just signed an enterprise deal, potential lock-in risk"
Detective     "Bull's claim checks out. Bear's claim is 8 months old — likely stale"
Orchestrator  "Evidence favors Bull. Verdict: PURSUE — Regret Score 84/100"
              |
Output:       Dossier + Verdict + Personalized outreach email. Ready to send.
```

---

## Architecture

```
+-----------------------------------------------------+
|                     USER INPUT                      |
|                   "notion.so"                       |
+---------------------+-------------------------------+
                      |
                      v
+-----------------------------------------------------+
|                  ALLYVEX CORE                       |
|             orchestration/war_room.py               |
|                                                     |
|  Coordinates agents  |  Streams events  |  Assembles|
|  final result        |  Handles errors per agent    |
+------+---------------+---------------+--------------+
       |               |               |
       v               v               v
+------------+  +------------+  +------------+
|    BULL    |  |    BEAR    |  | DETECTIVE  |
|            |  |            |  |            |
| Finds why  |  | Finds why  |  | Audits     |
| to pursue  |  | to avoid   |  | both sides |
|            |  |            |  |            |
| Web Search |  | Web Search |  | Web Search |
+------+-----+  +------+-----+  +------+-----+
       |               |               |
       +---------------+---------------+
                       |
              all findings passed together
                       |
                       v
             +-------------------+
             |   ORCHESTRATOR    |
             |                   |
             | Weighs evidence   |
             | Makes verdict     |
             | Writes email      |
             |                   |
             | [No Web Search]   |
             +--------+----------+
                      |
                      v
+-----------------------------------------------------+
|                     OUTPUT                          |
|  Verdict  |  Confidence  |  Regret Score  |  Email  |
+-----------------------------------------------------+
```

---

## The 4 Agents — Why Each One Exists

### Bull Agent — The Optimist

Searches for every reason this company is worth pursuing right now. Funding rounds, hiring sprees, product launches, leadership changes — anything that signals a buying window is open.

**Why it exists:** Without a champion for the lead, every company looks risky. Bull forces the system to find the opportunity before writing it off.

---

### Bear Agent — The Skeptic

Searches for every reason to walk away. Layoffs, competitor contracts, legal trouble, financial distress — anything that signals wasted effort or active risk.

**Why it exists:** Without a devil's advocate, every company looks promising. Bear protects you from chasing dead leads.

---

### Detective Agent — The Auditor

Reads Bull and Bear's findings and asks one question: is this evidence actually solid? It does not take sides. It finds what both agents missed and scores the quality of their arguments.

**Why it exists:** Bull and Bear are biased by design. Someone has to hold them accountable. The Detective is the reason the system cannot be gamed by one loud voice.

---

### Orchestrator Agent — The Judge

Receives everything. Searches nothing. Weighs Bull vs Bear based on evidence quality scores from the Detective. Makes a final call: PURSUE, HOLD, or AVOID.

**Why it has no web search:** This is a deliberate constraint. If the Orchestrator could search, it becomes a fifth researcher. By restricting it to reasoning only, it stays a genuine decision-maker — not just another data collector with a verdict attached.

---

## Why This Architecture?

Most AI pipelines look like this:

```
Agent 1 --> Agent 2 --> Agent 3 --> Output
```

That is a conveyor belt, not intelligence. Each agent just passes a baton.

ALLYVEX uses a debate architecture instead:

```
Researcher A  --+
                +--> Auditor --> Judge --> Output
Researcher B  --+
```

This matters for three reasons.

**Bias is structural, not accidental.** Bull and Bear are supposed to disagree. The tension between them is the feature, not a bug.

**Evidence quality is tracked.** The Detective scores how well each side's claims hold up — the Orchestrator weighs verified facts more than assumptions.

**The verdict is earned.** It is not the output of whoever ran last. It is the conclusion of a genuine argument.

---

## Folder Structure

```
allyvex/
|
+-- agents/
|   +-- bull.py               # Buying signal researcher
|   +-- bear.py               # Red flag researcher
|   +-- detective.py          # Evidence auditor
|   +-- orchestrator.py       # Final verdict and email writer
|
+-- orchestration/
|   +-- war_room.py           # Runs agents in order, streams events to frontend
|
+-- utils/
|   +-- parser.py             # Cleans JSON out of agent responses
|   +-- search_tools.py       # Web search tool config, shared across all agents
|
+-- main.py                   # FastAPI server, one endpoint, SSE streaming
+-- test.py                   # Run the full pipeline locally before touching UI
+-- requirements.txt
+-- Procfile                  # Railway deployment config
+-- .env                      # API keys — never commit this file
```

Every folder has exactly one responsibility. Agents think. Orchestration coordinates. Utils handle shared concerns. Main serves.

---

## Use Cases

| Role                    | How They Use ALLYVEX                                                        |
|-------------------------|-----------------------------------------------------------------------------|
| SDR / Sales Rep         | Drop a prospect domain, get a verdict and a ready-to-send email in 2 min   |
| Sales Manager           | Prioritize a list of domains — ALLYVEX ranks which leads to contact first   |
| Founder doing outbound  | Research a target enterprise account without hiring a dedicated researcher  |
| Investor doing diligence| Quick competitive signal scan on a company before a call                   |
| BD Team                 | Identify partnership opportunities with justified reasoning, not gut feel   |

---

## Tech Stack

| Technology          | Reason                                                                      |
|---------------------|-----------------------------------------------------------------------------|
| Python              | Team's primary language — no context switching under time pressure          |
| FastAPI             | Async-native, built-in SSE support, clean and minimal                       |
| Anthropic Claude API| Web search is built in — no third-party search APIs required                |
| Server-Sent Events  | One-way stream from server to browser, ideal for live agent progress        |
| Railway             | Python deployment in three commands, free tier, no infrastructure overhead  |

---

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Configure environment
echo "ANTHROPIC_API_KEY=your_key_here" > .env

# Test the agent pipeline before starting the server
python test.py

# Start the server
uvicorn main:app --reload --port 8000
```

Test the endpoint directly:

```bash
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"domain": "stripe.com"}' \
  --no-buffer
```

---

## Sample Output

```json
{
  "verdict": "PURSUE",
  "confidence": 87,
  "regretScore": {
    "score": 91,
    "reason": "Series B closed 4 months ago, 23 open engineering roles, budget window is active"
  },
  "outreachEmail": {
    "subject": "Scaling your data pipeline after the raise",
    "body": "Hi [Name], noticed the engineering team has grown 40% since the Series B..."
  },
  "targetDecisionMaker": {
    "title": "VP of Engineering",
    "why": "Owns the tooling budget and was publicly quoted on infrastructure scaling"
  }
}
```

---

## The One Rule

Run `python test.py` before touching the frontend.

The agents are only as good as their prompts. If the output looks wrong, the fix is in the system prompt — not the code. Invest time here before building the UI layer.

---

ALLYVEX — Autonomous Lead Intelligence, powered by DataVex.
