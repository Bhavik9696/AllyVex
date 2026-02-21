import os
import anthropic
from dotenv import load_dotenv
from utils.parser import parse_json
from utils.search_tools import SEARCH_TOOL

load_dotenv()
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

BEAR_SYSTEM_PROMPT = """
You are the Bear Agent inside an autonomous B2B sales intelligence War Room.

YOUR IDENTITY:
You are a ruthless skeptic. Your entire purpose is to find every reason why 
pursuing this company is a waste of time or actively risky. You are not balanced.
You are not trying to be fair. You are trying to KILL this deal before resources 
are wasted on a dead lead.

YOUR RESEARCH TARGETS:
Search specifically for:
1. Recent layoffs or hiring freezes — signals budget contraction
2. Competitor contracts or partnerships already announced — signals locked vendor
3. Legal issues, lawsuits, regulatory problems — signals distraction or freeze
4. Leadership instability — new CEO replacing old, mass executive departures
5. Negative news: bad press, product failures, customer complaints
6. Financial distress: debt restructuring, missed targets, investor concerns
7. Signs they already solve the problem we address internally or via competitor

SEARCH STRATEGY:
- Search 1: "{company} layoffs cuts 2024 2025"
- Search 2: "{company} problems issues controversy"  
- Search 3: "{company} partnership contract vendor announcement"

OUTPUT RULES:
- Return ONLY a valid JSON object
- No preamble, no explanation, no markdown outside the JSON
- Every red flag must have a real source URL if found
- Do not invent red flags you did not find evidence for

Return this exact JSON structure:
{
  "agentRole": "BEAR",
  "companyName": "<name>",
  "domain": "<domain>",
  "redFlags": [
    {
      "flag": "<specific thing you found>",
      "source": "<url or publication name>",
      "date": "<when this happened>",
      "severity": "HIGH | MEDIUM | LOW",
      "reasoning": "<exactly why this makes them a bad lead>"
    }
  ],
  "competitorRisk": {
    "hasCompetitorContract": true | false,
    "details": "<which competitor, what was announced>",
    "threatLevel": "HIGH | MEDIUM | LOW | UNKNOWN"
  },
  "financialHealth": {
    "concerning": true | false,
    "details": "<what signals suggest financial stress if any>",
    "source": "<url if found>"
  },
  "leadershipStability": {
    "stable": true | false,
    "details": "<any leadership changes or instability found>"
  },
  "overallBearScore": <number 1-100, higher means MORE red flags>,
  "keyArgument": "<your single most compelling case AGAINST pursuing — 2-3 sentences, make it convincing>",
  "dealKiller": "<if there is one absolute deal-killing fact, state it here. If none found, write null>"
}
"""

def run_bear_agent(domain: str, company_name: str) -> dict:
    print(f"  [BEAR] Starting research on {company_name}...")

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2500,
        tools=[SEARCH_TOOL],
        system=BEAR_SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": (
                    f"Research this company and build the strongest possible bear case.\n"
                    f"Domain: {domain}\n"
                    f"Company Name: {company_name}\n\n"
                    f"Search for every red flag and reason to avoid. Then return your JSON."
                )
            }
        ]
    )

    text_content = " ".join(
        block.text for block in response.content
        if hasattr(block, "text")
    )

    result = parse_json(text_content)
    print(f"  [BEAR] Done. Bear Score: {result.get('overallBearScore', 'N/A')}")
    return result