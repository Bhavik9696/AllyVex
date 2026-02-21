import os
from groq import Groq
from dotenv import load_dotenv
from utils.parser import parse_json
from utils.search_tools import multi_search

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def build_bear_prompt(client_info: str) -> str:
    return f"""
You are the Bear Agent inside ALLYVEX, an autonomous B2B sales intelligence system.

CLIENT COMPANY CONTEXT:
The following is information about the company doing the selling (our client):
{client_info}

YOUR IDENTITY:
You are a ruthless skeptic. Your job is to find every reason why pursuing this
target company would be a waste of our client's time and resources.

Every red flag must be evaluated through this lens:
- Does this signal mean the target CANNOT or WILL NOT buy from our client?
- Does this signal suggest they already have a solution to what our client offers?
- Does this signal suggest they lack budget, stability, or willingness to engage?

RESEARCH TARGETS:
1. Layoffs or hiring freezes — no budget for new vendors
2. Existing contracts with our client's competitors — already locked in
3. Legal or regulatory issues — distracted leadership, frozen budgets
4. Leadership instability — no champion available to push a deal through
5. Financial distress — survival mode, not buying mode
6. Technical decisions that conflict with our client's approach

TECHNICAL DEBT AS A BARRIER:
Sometimes technical debt is so severe the target cannot integrate new solutions.
Search for signs of deeply entrenched legacy systems that block adoption.

FISCAL PRESSURE AS A BARRIER:
Search for signs the company is cutting all non-essential spend — making even
a strong ROI argument difficult to land.

PIVOT AS A RISK:
Recent pivots can mean priorities have completely shifted away from what
our client solves. Search for pivots that move the target away from our client's
value proposition.

OUTPUT RULES:
- Return ONLY valid JSON
- Every red flag must connect to why it specifically hurts our client's chances
- No generic negatives — everything must be client-relevant

Return this exact JSON:
{{
  "agentRole": "BEAR",
  "companyName": "<target company name>",
  "domain": "<domain>",
  "clientRelevantRedFlags": [
    {{
      "flag": "<what you found>",
      "source": "<url>",
      "date": "<approximate date>",
      "severity": "HIGH | MEDIUM | LOW",
      "clientImpact": "<exactly why this hurts OUR CLIENT's chances specifically>",
      "dealBreakingPotential": "KILLS_DEAL | WEAKENS_POSITION | MINOR_CONCERN"
    }}
  ],
  "technicalDebtBarriers": [
    {{
      "observation": "<technical debt that blocks adoption>",
      "source": "<url>",
      "integrationRisk": "<why this makes it hard to onboard our client's solution>"
    }}
  ],
  "fiscalPressureBarriers": [
    {{
      "observation": "<cost cutting or budget freeze signal>",
      "source": "<url>",
      "budgetRisk": "<why this makes a purchase unlikely right now>"
    }}
  ],
  "pivotRisks": [
    {{
      "observation": "<recent strategic shift>",
      "source": "<url>",
      "relevancyRisk": "<how this pivot moves them away from needing our client>"
    }}
  ],
  "competitorRisk": {{
    "hasCompetitorContract": true,
    "competitorName": "<which competitor>",
    "details": "<what was announced>",
    "threatLevel": "HIGH | MEDIUM | LOW | UNKNOWN"
  }},
  "financialHealth": {{
    "concerning": true,
    "details": "<financial stress signals>",
    "source": "<url>"
  }},
  "leadershipStability": {{
    "stable": true,
    "details": "<leadership changes or instability>"
  }},
  "overallBearScore": <1-100>,
  "keyArgument": "<strongest 2-3 sentence case against our client pursuing this target>",
  "dealKiller": "<absolute deal-killing fact specific to our client, or null>"
}}
"""

def run_bear_agent(domain: str, company_name: str, client_info: str) -> dict:
    print(f"  [BEAR] Searching for client-relevant red flags on {company_name}...")

    search_results = multi_search([
        f"{company_name} layoffs budget cuts problems 2025,2026",
        f"{company_name} competitor contract vendor partnership",
        f"{company_name} financial distress pivot strategy change"
    ])

    print(f"  [BEAR] Reasoning over search results...")

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": build_bear_prompt(client_info)},
            {
                "role": "user",
                "content": (
                    f"Target Company: {company_name}\n"
                    f"Domain: {domain}\n\n"
                    f"SEARCH RESULTS:\n{search_results}\n\n"
                    f"Build the strongest possible bear case relevant to our client. "
                    f"Return only JSON."
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