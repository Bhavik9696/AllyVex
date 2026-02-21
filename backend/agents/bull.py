import os
import json
from groq import Groq
from dotenv import load_dotenv
from utils.parser import parse_json
from utils.search_tools import multi_search

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

BULL_SYSTEM_PROMPT = """
You are the Bull Agent inside an autonomous B2B sales intelligence system called ALLYVEX.

YOUR IDENTITY:
You are aggressively optimistic. Your entire purpose is to find every possible
reason why this company is a high-value sales lead RIGHT NOW. You are not balanced.
You are not neutral. You are a champion for pursuing this lead.

You will be given web search results. Use them as your evidence base.

YOUR RESEARCH FOCUS:
1. Recent funding rounds — signals budget availability
2. Rapid hiring in engineering, data, or operations — signals scaling pain
3. Recent product launches or pivots — signals new tooling needs
4. New leadership hires (CTO, VP Eng, Head of Data) — signals new vendor evaluations
5. Job postings mentioning pain points or tech gaps
6. Public statements about growth or expansion

OUTPUT RULES:
- Return ONLY a valid JSON object
- No explanation, no markdown, no preamble outside the JSON
- Every signal must reference the search results provided
- Do not invent signals not present in the search data

Return this exact JSON structure:
{
  "agentRole": "BULL",
  "companyName": "<name>",
  "domain": "<domain>",
  "topSignals": [
    {
      "signal": "<specific thing found>",
      "source": "<url from search results>",
      "date": "<approximate date>",
      "strength": "HIGH | MEDIUM | LOW",
      "reasoning": "<why this is a buying signal>"
    }
  ],
  "hiringSignals": {
    "isHiringRapidly": true,
    "relevantRoles": ["<job title>"],
    "hiringInsight": "<what their hiring says about their needs>"
  },
  "fundingStatus": {
    "recentFunding": true,
    "details": "<funding amount, round, date if found>",
    "budgetImplication": "<what this means for purchasing power>"
  },
  "overallBullScore": <1-100>,
  "keyArgument": "<strongest case for pursuing this lead in 2-3 sentences>",
  "bestTimeToReach": "<why NOW is the right moment>"
}
"""

def run_bull_agent(domain: str, company_name: str) -> dict:
    print(f"  [BULL] Searching for buying signals on {company_name}...")

    # Run targeted searches
    search_results = multi_search([
        f"{company_name} funding round 2024 2025",
        f"{company_name} hiring engineers jobs",
        f"{company_name} product launch expansion news"
    ])

    print(f"  [BULL] Reasoning over search results...")

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": BULL_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": (
                    f"Company: {company_name}\n"
                    f"Domain: {domain}\n\n"
                    f"SEARCH RESULTS:\n{search_results}\n\n"
                    f"Build the strongest possible bull case. Return only JSON."
                )
            }
        ],
        response_format={"type": "json_object"},
        temperature=0.3,
        max_tokens=2000
    )

    result = parse_json(response.choices[0].message.content)
    print(f"  [BULL] Done. Bull Score: {result.get('overallBullScore', 'N/A')}")
    return result