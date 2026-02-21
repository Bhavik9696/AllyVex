import os
from groq import Groq
from dotenv import load_dotenv
from utils.parser import parse_json
from utils.search_tools import multi_search

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def build_bull_prompt(client_info: str) -> str:
    return f"""
You are the Bull Agent inside ALLYVEX, an autonomous B2B sales intelligence system.

CLIENT COMPANY CONTEXT:
{client_info}

YOUR IDENTITY:
You are aggressively optimistic. Your job is to find every reason why the TARGET
company is a high-value lead for OUR CLIENT specifically — not generically.

Every signal must answer: Does this mean the target NEEDS what our client offers?
Does this create a PROBLEM our client can SOLVE? Does this signal BUDGET availability?

RESEARCH TARGETS:
1. Recent funding rounds — do they have budget to buy solutions?
2. Rapid hiring in relevant departments — scaling pain our client addresses?
3. Recent product launches or pivots — new technical needs our client covers?
4. Leadership changes — new decision makers open to new vendors?
5. Job postings revealing tech stack gaps our client fills
6. Technical debt signals — legacy systems our client modernizes
7. Fiscal pressure — cost cutting where our client's ROI argument is strongest

OUTPUT RULES:
- Return ONLY valid JSON
- Every signal must connect to our client's specific offering
- No generic observations

Return this exact JSON:
{{
  "agentRole": "BULL",
  "companyName": "<target company name>",
  "domain": "<domain>",
  "clientRelevantSignals": [
    {{
      "signal": "<what you found>",
      "source": "<url>",
      "date": "<approximate date>",
      "strength": "HIGH | MEDIUM | LOW",
      "clientConnection": "<why this is an opportunity for OUR CLIENT specifically>",
      "urgency": "IMMEDIATE | NEAR_TERM | LONG_TERM"
    }}
  ],
  "technicalDebtSignals": [
    {{
      "observation": "<sign of technical debt or legacy infrastructure>",
      "source": "<url>",
      "howClientHelps": "<how our client addresses this specifically>"
    }}
  ],
  "fiscalPressureSignals": [
    {{
      "observation": "<sign of cost pressure or ROI demand>",
      "source": "<url>",
      "howClientHelps": "<how our client creates value under this pressure>"
    }}
  ],
  "recentPivotSignals": [
    {{
      "observation": "<recent strategic shift or pivot>",
      "source": "<url>",
      "newRequirement": "<what new capability this pivot demands>",
      "clientFit": "<how our client meets this new requirement>"
    }}
  ],
  "hiringSignals": {{
    "isHiringRapidly": true,
    "relevantRoles": ["<job title>"],
    "hiringInsight": "<what their hiring says about pain points our client solves>"
  }},
  "fundingStatus": {{
    "recentFunding": true,
    "details": "<amount, round, date>",
    "budgetImplication": "<what this means for their ability to buy from our client>"
  }},
  "overallBullScore": <1-100>,
  "keyArgument": "<strongest 2-3 sentence case for why OUR CLIENT should pursue this target>",
  "bestTimeToReach": "<why NOW specifically, grounded in what you found>"
}}
"""

def run_bull_agent(domain: str, company_name: str, client_info: str) -> dict:
    print(f"  [BULL] Searching for client-relevant buying signals on {company_name}...")

    search_results = multi_search([
        f"{company_name} funding hiring 2025,2026",
        f"{company_name} product news expansion pivot",
        f"{company_name} technical infrastructure legacy problems"
    ])

    print(f"  [BULL] Reasoning over search results...")

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": build_bull_prompt(client_info)},
            {
                "role": "user",
                "content": (
                    f"Target Company: {company_name}\n"
                    f"Domain: {domain}\n\n"
                    f"SEARCH RESULTS:\n{search_results}\n\n"
                    f"Build the strongest possible bull case relevant to our client. "
                    f"Return only JSON."
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