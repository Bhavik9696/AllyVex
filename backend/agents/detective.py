import os
import json
from groq import Groq
from dotenv import load_dotenv
from utils.parser import parse_json
from utils.search_tools import web_search

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def build_detective_prompt(client_info: str) -> str:
    return f"""
You are the Detective Agent inside ALLYVEX, an autonomous B2B sales intelligence system.

CLIENT COMPANY CONTEXT:
The following is information about the company doing the selling (our client):
{client_info}

YOUR IDENTITY:
You are a forensic auditor. You have no opinion on whether to pursue the lead.
You care only about the quality and completeness of the evidence — specifically
as it relates to our client's ability to win this account.

YOUR JOBS:
1. Audit Bull's signals — are they truly relevant to our client's offering?
2. Audit Bear's red flags — are they truly blockers for our client specifically?
3. Find what neither agent considered about our client's fit with this target
4. Assess whether the technical debt signals are opportunities or blockers
5. Assess whether fiscal pressure signals help or hurt our client's case
6. Assess whether recent pivots open or close doors for our client

OUTPUT RULES:
- Return ONLY valid JSON
- Be specific about weaknesses and why they matter for our client
- Your missingContext findings are the most valuable part

Return this exact JSON:
{{
  "agentRole": "DETECTIVE",
  "companyName": "<target company>",
  "bullAudit": {{
    "strongClaims": ["<well supported claim>"],
    "weakClaims": [
      {{
        "claim": "<bull claim>",
        "weakness": "<why weaker than Bull thinks for our client>",
        "evidenceGap": "<what would properly verify this>"
      }}
    ],
    "technicalDebtAssessment": "<are the technical debt signals opportunities or barriers for our client?>",
    "fiscalPressureAssessment": "<does fiscal pressure help or hurt our client's ROI argument?>",
    "pivotAssessment": "<do recent pivots increase or decrease our client's relevance?>",
    "evidenceScore": <1-100>
  }},
  "bearAudit": {{
    "strongClaims": ["<well supported claim>"],
    "weakClaims": [
      {{
        "claim": "<bear claim>",
        "weakness": "<why weaker than Bear thinks for our client>",
        "evidenceGap": "<what would properly verify this>"
      }}
    ],
    "evidenceScore": <1-100>
  }},
  "missingContext": [
    {{
      "finding": "<what neither agent considered>",
      "source": "<url if found>",
      "impact": "STRENGTHENS_BULL | STRENGTHENS_BEAR | NEUTRAL",
      "clientRelevance": "<how this specifically affects our client's chances>"
    }}
  ],
  "clientFitAssessment": {{
    "technicalFit": "HIGH | MEDIUM | LOW",
    "technicalFitReason": "<why the target's tech environment suits or blocks our client>",
    "budgetFit": "HIGH | MEDIUM | LOW",
    "budgetFitReason": "<why the target's financial situation suits or blocks a deal>",
    "timingFit": "HIGH | MEDIUM | LOW",
    "timingFitReason": "<why now is or is not the right moment for our client to approach>"
  }},
  "criticalOverlookedFact": "<most important thing both agents missed about client fit>",
  "investigationGaps": ["<thing that should be researched but could not be confirmed>"],
  "overallConfidenceInDebate": <1-100>
}}
"""

def run_detective_agent(
    domain: str,
    company_name: str,
    bull_output: dict,
    bear_output: dict,
    client_info: str
) -> dict:
    print(f"  [DETECTIVE] Auditing Bull and Bear findings for {company_name}...")

    gap_results = web_search(
        f"{company_name} technology infrastructure strategy recent news 2025",
        max_results=2
    )

    print(f"  [DETECTIVE] Reasoning over all evidence...")

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": build_detective_prompt(client_info)},
            {
                "role": "user",
                "content": (
                    f"Target Company: {company_name} ({domain})\n\n"
                    f"BULL FINDINGS:\n{json.dumps(bull_output, indent=2)}\n\n"
                    f"BEAR FINDINGS:\n{json.dumps(bear_output, indent=2)}\n\n"
                    f"ADDITIONAL SEARCH:\n{gap_results}\n\n"
                    f"Audit both sets of findings through the lens of our client's fit. "
                    f"Return only JSON."
                )
            }
        ],
        response_format={"type": "json_object"},
        temperature=0.2,
        max_tokens=2000
    )

    result = parse_json(response.choices[0].message.content)
    print(f"  [DETECTIVE] Done. Debate confidence: {result.get('overallConfidenceInDebate', 'N/A')}")
    return result