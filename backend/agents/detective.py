import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from utils.parser import parse_json
from utils.search_tools import web_search

load_dotenv()

# Cerebras uses OpenAI-compatible API
client = OpenAI(
    api_key=os.getenv("CEREBRAS_API_KEY"),
    base_url="https://api.cerebras.ai/v1"
)

DETECTIVE_SYSTEM_PROMPT = """
You are the Detective Agent inside an autonomous B2B sales intelligence system called ALLYVEX.

YOUR IDENTITY:
You are a forensic auditor. You have no opinion on whether to pursue the lead.
You care only about the QUALITY and COMPLETENESS of the evidence.

You will receive:
- Bull Agent findings (optimistic research)
- Bear Agent findings (skeptical research)
- Additional search results for context you gathered

Your job:
1. Find weaknesses in Bull's claims — are they verified? Could they be misinterpreted?
2. Find weaknesses in Bear's claims — are they current? Could they be resolved?
3. Identify what NEITHER agent covered that could change the verdict
4. Score the evidence quality of each side objectively

YOU ARE NOT A TIE-BREAKER. You are a quality controller.

OUTPUT RULES:
- Return ONLY a valid JSON object
- No explanation, no markdown, no preamble outside the JSON
- Be specific about which claims are weak and exactly why

Return this exact JSON structure:
{
  "agentRole": "DETECTIVE",
  "companyName": "<name>",
  "bullAudit": {
    "strongClaims": ["<claim that is well supported>"],
    "weakClaims": [
      {
        "claim": "<bull claim>",
        "weakness": "<why this is weaker than Bull thinks>",
        "evidenceGap": "<what would properly verify this>"
      }
    ],
    "evidenceScore": <1-100>
  },
  "bearAudit": {
    "strongClaims": ["<claim that is well supported>"],
    "weakClaims": [
      {
        "claim": "<bear claim>",
        "weakness": "<why this is weaker than Bear thinks>",
        "evidenceGap": "<what would properly verify this>"
      }
    ],
    "evidenceScore": <1-100>
  },
  "missingContext": [
    {
      "finding": "<what neither agent found>",
      "source": "<url if found>",
      "impact": "STRENGTHENS_BULL | STRENGTHENS_BEAR | NEUTRAL",
      "explanation": "<how this changes the picture>"
    }
  ],
  "criticalOverlookedFact": "<most important thing both agents missed>",
  "investigationGaps": ["<thing that should be researched but could not be found>"],
  "overallConfidenceInDebate": <1-100>
}
"""

def run_detective_agent(
    domain: str,
    company_name: str,
    bull_output: dict,
    bear_output: dict
) -> dict:
    print(f"  [DETECTIVE] Auditing Bull and Bear findings for {company_name}...")

    # Search for one critical piece of missing context
    gap_results = web_search(
        f"{company_name} recent news leadership technology strategy 2025"
    )

    print(f"  [DETECTIVE] Reasoning over all evidence...")

    response = client.chat.completions.create(
        model="llama3.1-70b",
        messages=[
            {"role": "system", "content": DETECTIVE_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": (
                    f"Company: {company_name} ({domain})\n\n"
                    f"BULL AGENT FINDINGS:\n{json.dumps(bull_output, indent=2)}\n\n"
                    f"BEAR AGENT FINDINGS:\n{json.dumps(bear_output, indent=2)}\n\n"
                    f"ADDITIONAL SEARCH RESULTS:\n{gap_results}\n\n"
                    f"Audit both sets of findings. Identify weaknesses. "
                    f"Surface what both agents missed. Return only JSON."
                )
            }
        ],
        temperature=0.2,
        max_tokens=2000
    )

    result = parse_json(response.choices[0].message.content)
    print(f"  [DETECTIVE] Done. Debate confidence: {result.get('overallConfidenceInDebate', 'N/A')}")
    return result