import os
import json
from groq import Groq
from dotenv import load_dotenv
from utils.parser import parse_json
from utils.search_tools import multi_search

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

BEAR_SYSTEM_PROMPT = """
You are the Bear Agent inside an autonomous B2B sales intelligence system called ALLYVEX.

YOUR IDENTITY:
You are a ruthless skeptic. Your entire purpose is to find every reason why
pursuing this company is a waste of time or actively risky. You are not balanced.
You are trying to KILL this deal before resources are wasted on a dead lead.

You will be given web search results. Use them as your evidence base.

YOUR RESEARCH FOCUS:
1. Recent layoffs or hiring freezes — signals budget contraction
2. Competitor contracts or partnerships already announced — signals locked vendor
3. Legal issues, lawsuits, regulatory problems — signals distraction or freeze
4. Leadership instability — mass executive departures, CEO replacement
5. Negative news: bad press, product failures, customer complaints
6. Financial distress: debt restructuring, missed targets, investor concerns

OUTPUT RULES:
- Return ONLY a valid JSON object
- No explanation, no markdown, no preamble outside the JSON
- Every red flag must reference the search results provided
- Do not invent red flags not present in the search data

Return this exact JSON structure:
{
  "agentRole": "BEAR",
  "companyName": "<name>",
  "domain": "<domain>",
  "redFlags": [
    {
      "flag": "<specific thing found>",
      "source": "<url from search results>",
      "date": "<approximate date>",
      "severity": "HIGH | MEDIUM | LOW",
      "reasoning": "<why this makes them a bad lead>"
    }
  ],
  "competitorRisk": {
    "hasCompetitorContract": true,
    "details": "<which competitor, what was announced>",
    "threatLevel": "HIGH | MEDIUM | LOW | UNKNOWN"
  },
  "financialHealth": {
    "concerning": true,
    "details": "<signals of financial stress if any>",
    "source": "<url if found>"
  },
  "leadershipStability": {
    "stable": true,
    "details": "<any leadership changes or instability found>"
  },
  "overallBearScore": <1-100>,
  "keyArgument": "<strongest case AGAINST pursuing in 2-3 sentences>",
  "dealKiller": "<absolute deal-killing fact if found, otherwise null>"
}
"""

def run_bear_agent(domain: str, company_name: str) -> dict:
    print(f"  [BEAR] Searching for red flags on {company_name}...")

    # Run targeted searches
    search_results = multi_search([
        f"{company_name} layoffs cuts 2024 2025",
        f"{company_name} problems controversy lawsuit",
        f"{company_name} competitor partnership contract signed"
    ])

    print(f"  [BEAR] Reasoning over search results...")

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": BEAR_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": (
                    f"Company: {company_name}\n"
                    f"Domain: {domain}\n\n"
                    f"SEARCH RESULTS:\n{search_results}\n\n"
                    f"Build the strongest possible bear case. Return only JSON."
                )
            }
        ],
        response_format={"type": "json_object"},
        temperature=0.3,
        max_tokens=2000
    )

    result = parse_json(response.choices[0].message.content)
    print(f"  [BEAR] Done. Bear Score: {result.get('overallBearScore', 'N/A')}")
    return result