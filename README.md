# ALLYVEX
### Autonomous Strategic Sales Intelligence Engine

> Give it a company domain. It figures out everything else.

---

## What Is ALLYVEX?

Traditional sales research is slow, biased, and manual.
ALLYVEX replaces that with four specialized AI agents that argue with each other —
and only reach a verdict when the evidence holds up.

No human guidance. No templates. Just a domain name and a dual-track verdict in under 3 minutes.

What makes ALLYVEX different from every other sales tool:

- It evaluates every company from **two angles simultaneously** — as a potential **customer** and as a potential **business partner**
- It **adapts its analysis to company scale** — a 50-person startup is evaluated differently from a 5000-person enterprise
- Every agent's analysis is **specific to what our client sells** — not generic intelligence

---

## Watch It Work

```
Client URL:   datavex.ai
              |
              v
Profile Gen   Scrapes website + searches external sources
              Builds structured client profile document
              Returns to frontend for review
              |
              v
Target:       notion.so
              |
Bull          "Series B closed 3 months ago, hiring 40 engineers — strong customer signal"
              "API-first product with marketplace — strong partner signal"
Bear          "Atlassian enterprise deal signed — competitor lock-in risk for customer track"
              "Notion building their own data layer — partner conflict risk"
Detective     "Bull's funding claim verified. Bear's Atlassian claim is 8 months old — stale"
              "Customer track STRONG. Partner track MODERATE. Recommend CUSTOMER_FIRST"
Orchestrator  "Customer verdict: PURSUE — Confidence 88 — Regret Score 91"
              "Partner verdict: HOLD — revisit when partner program launches"
              |
Output:       Two verdicts. Two outreach emails. Recommended approach. Ready to act.
```

---

## Architecture

```
+----------------------------------------------------------+
|                      USER FLOW                           |
|                                                          |
|  Step 1: Client submits their company URL                |
|          POST /api/generate-client-profile               |
|          -> Scrape + Search -> Structured client profile |
|          -> Returned to frontend for review              |
|                                                          |
|  Step 2: User enters target domain                       |
|          POST /api/analyze                               |
|          -> Full 4-agent War Room runs                   |
|          -> Events streamed in real time via SSE         |
+----------------------------------------------------------+
                           |
                           v
+----------------------------------------------------------+
|                    ALLYVEX CORE                          |
|               orchestration/war_room.py                  |
|                                                          |
|  Coordinates agents  |  Streams SSE events  |  Assembles |
|  dual-track result   |  Handles errors      |  thinking  |
+--------+-------------+------------------+---------------+
         |                                |
         v                                v
  +----------+  +----------+        +----------+
  |   BULL   |  |   BEAR   |        | DETECTIVE|
  |          |  |          |        |          |
  | Customer |  | Customer |        | Audits   |
  | signals  |  | red flags|        | both     |
  |          |  |          |        | sides    |
  | Partner  |  | Partner  |        |          |
  | signals  |  | red flags|        | Split    |
  |          |  |          |        | verdict  |
  | Scale    |  | Scale    |        |          |
  | detection|  | disqualif|        | Scale    |
  |          |  |          |        | verify   |
  | Web Srch |  | Web Srch |        | Web Srch |
  | (Tavily) |  | (Tavily) |        | (Tavily) |
  +----+-----+  +----+-----+        +----+-----+
       |              |                  |
       +--------------+------------------+
                           |
               all findings passed together
                           |
                           v
                 +-------------------+
                 |   ORCHESTRATOR    |
                 |                   |
                 | Customer verdict  |
                 | Partner verdict   |
                 | Recommended       |
                 | approach +        |
                 | sequencing        |
                 | Two outreach      |
                 | emails            |
                 |                   |
                 | [No Web Search]   |
                 +--------+----------+
                          |
                          v
+----------------------------------------------------------+
|                      OUTPUT                              |
|  Customer Verdict  |  Partner Verdict  |  Approach      |
|  Confidence        |  Regret Scores    |  Two Emails    |
|  Decision Makers   |  Next Steps       |  Agent Trace   |
+----------------------------------------------------------+
```

---

## The 4 Agents — Why Each One Exists

### Bull Agent — The Optimist
Searches for every reason this company is worth pursuing — evaluated on BOTH tracks.

**Customer signals:** Funding rounds, hiring sprees, technical debt, fiscal pressure,
job postings revealing gaps our client fills.

**Partner signals:** API ecosystems, partner programs, complementary product offerings,
shared customer base signals.

**Scale adaptation:** Classifies the target as Startup / SMB / Mid-Market / Enterprise
and adjusts every signal's significance to that scale. A Series A round means something
different for a 30-person startup than a 500-person company.

**Why it exists:** Without a champion for the lead, every company looks risky.
Bull forces the system to find the opportunity before writing it off.

---

### Bear Agent — The Skeptic
Searches for every reason to walk away — evaluated on BOTH tracks.

**Customer red flags:** Budget freezes, competitor contracts, acquisition freezes,
leadership vacuums, financial distress.

**Partner red flags:** Direct product competition, exclusive competitor partnerships,
financial instability, no customer base overlap.

**Scale disqualifiers:** Companies too small to afford our client, or too large for
our client to compete with their incumbent vendors, are flagged immediately before
any other analysis runs.

**Why it exists:** Without a devil's advocate, every company looks promising.
Bear protects you from chasing dead leads and wrong-fit partnerships.

---

### Detective Agent — The Auditor
Reads Bull and Bear's findings and audits them for quality — separately per track.

**Scale verification:** Confirms or corrects Bull and Bear's scale estimates.
Scale miscalculation is the most common error in sales intelligence.

**Customer track audit:** Are Bull's customer signals actually relevant to what our
client sells? Are Bear's red flags current and specific? Technical fit, budget fit,
and timing fit scored independently.

**Partner track audit:** Is there real customer base overlap? Does the target have
actual distribution value? Is a formal partnership commercially viable at their scale?

**Split verdict detection:** The most valuable output. Identifies when one track is
strong and the other is weak — recommends customer-only, partner-only, both, or
neither approach with sequencing advice.

**Why it exists:** Bull and Bear are biased by design. The Detective is the reason
the system cannot be gamed by one loud voice. Evidence quality determines how much
weight each claim gets.

---

### Orchestrator Agent — The Judge
Receives everything. Searches nothing. Makes two independent verdicts.

**Customer verdict:** PURSUE / HOLD / AVOID with confidence score, regret score,
target decision maker, and a scale-appropriate outreach email.

**Partner verdict:** PURSUE / HOLD / AVOID with confidence score, regret score,
target BD contact, and a partnership-framed outreach email.

**Recommended approach:** One of six options — CUSTOMER_FIRST, PARTNER_FIRST,
BOTH_SIMULTANEOUSLY, CUSTOMER_NOW_PARTNER_LATER, PARTNER_NOW_CUSTOMER_LATER,
or NEITHER — with sequencing rationale.

**Why it has no web search:** Deliberate constraint. If the Orchestrator could search,
it becomes a fifth researcher. By restricting it to reasoning only, it stays a genuine
decision-maker — not another data collector with a verdict attached.

---

## Why This Architecture?

Most AI pipelines look like this:

```
Agent 1 --> Agent 2 --> Agent 3 --> Output
```

That is a conveyor belt, not intelligence. Each agent just passes a baton.

ALLYVEX uses a debate architecture instead:

```
Bull (customer + partner) --+
                             +--> Detective (auditor) --> Orchestrator (judge) --> Output
Bear (customer + partner) --+
```

This matters for three reasons:

**Bias is structural, not accidental.**
Bull and Bear are supposed to disagree. The tension between them is the feature, not a bug.

**Evidence quality is tracked.**
The Detective scores how well each side's claims hold up. The Orchestrator weighs
verified facts more than assumptions.

**The verdict is earned.**
It is not the output of whoever ran last. It is the conclusion of a genuine argument
evaluated on two independent tracks simultaneously.

---

## Client Onboarding Flow

Before analyzing any leads, ALLYVEX needs to know who its client is.

```
Client submits URL (their company website)
        |
        v
Backend scrapes website (httpx + BeautifulSoup)
        +
Searches external sources (Tavily)
        |
        v
LLM generates structured client profile document
Sections: what they do, who they sell to, problems they solve,
          ideal customer scale, ideal partner profile
        |
        v
Document returned to frontend
User reviews and confirms
        |
        v
Every agent receives this document as context
All analysis is specific to what this client sells
```

This is what separates ALLYVEX from generic sales tools. The agents do not produce
generic market intelligence — they produce intelligence filtered through the lens of
what our specific client offers and who their ideal buyers and partners are.

---

## Company Scale Adaptation

Every agent classifies the target company before running analysis:

| Scale | Employees | Revenue | Behavior |
|-------|-----------|---------|----------|
| STARTUP | Under 100 | Pre-Series B | Founder decisions, fast cycles, build-or-buy mentality |
| SMB | 100-500 | $5M-$50M | Growth-focused, outgrowing manual processes |
| MID_MARKET | 500-2000 | $50M-$500M | Digital transformation, technical debt pain |
| ENTERPRISE | 2000+ | $500M+ | Division-level initiatives, 6-18 month cycles |

Bull adapts its signal interpretation to scale.
Bear adapts its disqualifier thresholds to scale.
Orchestrator writes outreach emails in a tone appropriate to scale.

---

## Folder Structure

```
allyvex/
|
+-- agents/
|   +-- bull.py           # Dual-track buying signal researcher
|   +-- bear.py           # Dual-track red flag researcher
|   +-- detective.py      # Evidence auditor and split verdict generator
|   +-- orchestrator.py   # Final dual-track verdict and email writer
|
+-- orchestration/
|   +-- war_room.py       # Pipeline coordination, SSE event streaming,
|                         # thinking builders for frontend display
|
+-- utils/
|   +-- parser.py         # JSON extraction and error handling
|   +-- search_tools.py   # Tavily web search wrapper
|   +-- scraper.py        # Website content extraction (httpx + BeautifulSoup)
|   +-- doc_generator.py  # Client profile generation from URL
|
+-- main.py               # FastAPI server
|                         # POST /api/generate-client-profile
|                         # POST /api/analyze (SSE stream)
+-- test.py               # Local full pipeline test runner
+-- requirements.txt
+-- .env                  # API keys — never commit this file
```

---

## API Endpoints

### POST /api/generate-client-profile
Accepts client company URL. Returns structured client profile document.

```json
Request:  { "url": "https://datavex.ai" }
Response: { "status": "success", "clientProfile": "Company: DataVex\n..." }
```

### POST /api/analyze
Accepts target domain and client profile. Returns SSE stream.

```json
Request:  { "domain": "stripe.com", "client_info": "Company: DataVex..." }
Response: text/event-stream

Events:
  data: {"phase": "BULL_START",         "message": "...", "companyName": "Stripe"}
  data: {"phase": "BULL_DONE",          "data": {...}, "thinking": [...]}
  data: {"phase": "BEAR_START",         "message": "..."}
  data: {"phase": "BEAR_DONE",          "data": {...}, "thinking": [...]}
  data: {"phase": "DETECTIVE_START",    "message": "..."}
  data: {"phase": "DETECTIVE_DONE",     "data": {...}, "thinking": [...]}
  data: {"phase": "ORCHESTRATOR_START", "message": "..."}
  data: {"phase": "ORCHESTRATOR_DONE",  "data": {...}, "thinking": [...]}
  data: {"phase": "COMPLETE",           "result": {...}}
  data: [DONE]
```

Every DONE event includes a thinking array of {fact, reasoning} objects
that the frontend renders as the agent's visible reasoning process.

---

## Use Cases

| Role | How They Use ALLYVEX |
|------|----------------------|
| SDR / Sales Rep | Drop a prospect domain, get a verdict and ready-to-send email in 3 min |
| Sales Manager | Prioritize a list of domains — system ranks which to contact first |
| Founder doing outbound | Research a target enterprise without hiring a dedicated researcher |
| BD Team | Identify partnership opportunities with justified reasoning, not gut feel |
| Investor doing diligence | Quick competitive signal scan before a call |

---

## Tech Stack

| Technology | Reason |
|------------|--------|
| Python 3.13 | Team's primary language — no context switching under pressure |
| FastAPI | Async-native, SSE support, clean and minimal |
| Groq LLaMA 3.3 70B | Fast, free, JSON mode — handles Bull, Bear, Detective |
| Mistral Large | Strong reasoning for Orchestrator's dual verdict |
| Tavily API | Web search for all agents — free tier, structured results |
| httpx + BeautifulSoup | Website scraping for client profile generation |
| Server-Sent Events | One-way real-time stream from server to browser |

---

## Sample Output

```json
{
  "companyName": "Stripe",
  "confirmedScale": "ENTERPRISE",
  "recommendedApproach": "CUSTOMER_FIRST",
  "recommendedApproachReason": "Customer signals are strong and immediate. Partner track viable but secondary.",
  "customerTrack": {
    "verdict": "PURSUE",
    "confidence": 88,
    "regretScore": {
      "score": 91,
      "reason": "Infrastructure expansion into APAC announced last month — tooling decisions being made now"
    },
    "targetDecisionMaker": {
      "title": "VP of Data Engineering",
      "why": "Owns pipeline infrastructure decisions and was quoted on data modernization goals"
    },
    "outreachEmail": {
      "subject": "Data pipeline for your Asia-Pacific expansion",
      "body": "Hi [Name], saw Stripe's announcement about expanding infrastructure into APAC last month..."
    }
  },
  "partnerTrack": {
    "verdict": "HOLD",
    "confidence": 61,
    "regretScore": {
      "score": 45,
      "reason": "No active partner program — revisit when Stripe launches their next marketplace cycle"
    }
  }
}
```

---

## Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Create .env file
GROQ_API_KEY=your_groq_key
MISTRAL_API_KEY=your_mistral_key
TAVILY_API_KEY=your_tavily_key

# 3. Test the pipeline locally
python test.py

# 4. Start the server
uvicorn main:app --reload --port 8000
```

---

## The One Rule

Run python test.py before touching the frontend.

The agents are only as good as their prompts. If the output looks wrong,
the fix is in the system prompt — not the code.

---

ALLYVEX — Autonomous Dual-Track Sales Intelligence, powered by DataVex.
