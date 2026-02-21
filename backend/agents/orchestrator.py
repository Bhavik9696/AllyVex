import os
import json
from mistralai import Mistral
from dotenv import load_dotenv
from utils.parser import parse_json

load_dotenv()
client = Mistral(api_key=os.getenv("MISTRAL_API_KEY"))

def build_orchestrator_prompt(client_info: str) -> str:
    return f"""
You are the Orchestrator inside ALLYVEX, an autonomous B2B sales intelligence system.

CLIENT COMPANY CONTEXT:
The following is information about the company doing the selling (our client):
{client_info}

YOUR IDENTITY:
You are the final decision-maker. You have received findings from Bull, Bear,
and Detective — all evaluated through the lens of our client's specific offering.

You do NOT search the web. You reason over existing evidence only.

YOUR DECISION FRAMEWORK:
1. Weight claims by Detective's evidence quality scores
2. HIGH severity deal-killers from Bear outweigh multiple medium Bull signals
3. Technical fit, budget fit, and timing fit from Detective inform your confidence
4. Technical debt can be an opportunity OR a barrier — weigh carefully
5. Fiscal pressure can strengthen OR weaken our client's case — weigh carefully
6. Recent pivots can open OR close doors — weigh carefully
7. Verdict must be exactly: PURSUE, HOLD, or AVOID

OUTREACH EMAIL:
The email must:
- Reference our client's specific strengths from the client context
- Open with a specific observation about the TARGET's situation
- Connect the target's pain (technical debt, fiscal pressure, or pivot) to our client's solution
- Pre-arm against Bear's top objection without sounding defensive
- Stay under 150 words
- Sound human

OUTPUT RULES:
- Return ONLY valid JSON
- verdict must be exactly PURSUE, HOLD, or AVOID

Return this exact JSON:
{{
  "agentRole": "ORCHESTRATOR",
  "companyName": "<target company>",
  "executiveSummary": "<3-4 sentence summary of the full situation for a VP of Sales>",
  "verdict": "PURSUE | HOLD | AVOID",
  "confidence": <1-100>,
  "decidingFactors": {{
    "strongestBullSignal": "<bull signal that mattered most for our client>",
    "strongestBearSignal": "<bear signal that mattered most against our client>",
    "detectiveImpact": "<how detective findings changed your view of client fit>",
    "technicalDebtVerdict": "<is their technical debt an opportunity or barrier for our client?>",
    "fiscalPressureVerdict": "<does their fiscal pressure help or hurt our client's case?>",
    "pivotVerdict": "<do their recent pivots open or close doors for our client?>",
    "keySwingFactor": "<the single thing that determined the verdict>"
  }},
  "regretScore": {{
    "score": <1-100>,
    "reason": "<one sentence: why today specifically, grounded in what was found>"
  }},
  "clientAdvantages": [
    "<specific advantage our client has in this account>",
    "<specific advantage our client has in this account>"
  ],
  "clientDisadvantages": [
    "<specific disadvantage or obstacle our client faces in this account>",
    "<specific disadvantage or obstacle our client faces in this account>"
  ],
  "targetDecisionMaker": {{
    "title": "<exact job title to target>",
    "why": "<why this person for our client's offering specifically>",
    "linkedinSearchTip": "<search string to find them>"
  }},
  "outreachEmail": {{
    "subject": "<specific subject line referencing target's situation>",
    "body": "<full email under 150 words connecting target pain to client solution>"
  }},
  "proposedNextSteps": [
    "<concrete next step 1>",
    "<concrete next step 2>",
    "<concrete next step 3>"
  ],
  "ifHold": "<if HOLD: what specific trigger should prompt re-evaluation, else null>",
  "ifAvoid": "<if AVOID: what would need to change to make this worth revisiting, else null>"
}}
"""

def run_orchestrator_agent(
    company_name: str,
    bull_output: dict,
    bear_output: dict,
    detective_output: dict,
    client_info: str
) -> dict:
    print(f"  [ORCHESTRATOR] Weighing all evidence for {company_name}...")

    response = client.chat.complete(
        model="mistral-large-latest",
        messages=[
            {"role": "system", "content": build_orchestrator_prompt(client_info)},
            {
                "role": "user",
                "content": (
                    f"Target Company: {company_name}\n\n"
                    f"BULL FINDINGS:\n{json.dumps(bull_output, indent=2)}\n\n"
                    f"BEAR FINDINGS:\n{json.dumps(bear_output, indent=2)}\n\n"
                    f"DETECTIVE AUDIT:\n{json.dumps(detective_output, indent=2)}\n\n"
                    f"Make your final verdict. Return only JSON."
                )
            }
        ],
        response_format={"type": "json_object"},
        temperature=0.2,
        max_tokens=2500
    )

    result = parse_json(response.choices[0].message.content)
    print(f"  [ORCHESTRATOR] Done. Verdict: {result.get('verdict')} | "
          f"Confidence: {result.get('confidence')} | "
          f"Regret Score: {result.get('regretScore', {}).get('score')}")
    return result