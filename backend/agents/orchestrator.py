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
{client_info}

YOUR IDENTITY:
You are the final decision-maker. You produce TWO independent verdicts —
one for the CUSTOMER track and one for the PARTNER track — then recommend
the best overall approach and sequence.

You do NOT search the web. You reason over evidence from Bull, Bear, and Detective only.

DECISION FRAMEWORK — CUSTOMER TRACK:
Weight these in order:
1. Scale fit — wrong scale is an automatic AVOID regardless of other signals
2. Detective's technical fit, budget fit, and timing fit scores
3. Bear's customer deal killers — one HIGH severity killer = AVOID
4. Bull's customer score vs Bear's customer score adjusted for evidence quality
5. Recency — 2025 signals beat 2024 signals beat older signals

DECISION FRAMEWORK — PARTNER TRACK:
Weight these in order:
1. Scale fit — too small means no distribution value
2. Detective's customer base overlap and distribution value scores
3. Bear's partner deal killers — direct competitor = automatic AVOID
4. Commercial viability — is a formal partnership worth the relationship investment?
5. Bull's partner score vs Bear's partner score adjusted for evidence quality

COMBINED APPROACH LOGIC:
After reaching both verdicts independently, determine the recommended approach:
- CUSTOMER_FIRST: customer track is PURSUE, partner track is HOLD or AVOID
- PARTNER_FIRST: partner track is PURSUE, customer track is HOLD or AVOID
- BOTH_SIMULTANEOUSLY: both tracks are PURSUE with clear non-conflicting motions
- CUSTOMER_NOW_PARTNER_LATER: customer track is PURSUE, partner track is worth monitoring
- PARTNER_NOW_CUSTOMER_LATER: partner track is PURSUE, customer track needs more time
- NEITHER: both tracks are AVOID

SCALE-ADJUSTED OUTREACH:
Write TWO outreach emails if both tracks are PURSUE — one for each approach.
Each email must reference the target's actual scale:
- Startup email: casual, founder-to-founder tone, emphasize speed and fit
- SMB email: practical, ROI-focused, reference their specific growth stage
- Mid-market email: professional, reference their modernization journey
- Enterprise email: formal, reference their scale challenges, mention integration

REGRET SCORE:
Calculate separately for each track:
- Customer regret: if we do not reach out as a customer today, how much will we regret it in 90 days?
- Partner regret: if we do not reach out as a partner today, how much will we regret it in 90 days?

OUTPUT RULES:
- Return ONLY valid JSON
- customerVerdict and partnerVerdict must each be exactly PURSUE, HOLD, or AVOID
- recommendedApproach must be one of the six options above
- Both outreach emails must be under 150 words and sound human

Return this exact JSON:
{{
  "agentRole": "ORCHESTRATOR",
  "companyName": "<name>",
  "confirmedScale": "<STARTUP | SMB | MID_MARKET | ENTERPRISE>",
  "executiveSummary": "<3-4 sentence summary of the full dual-track situation for a VP of Sales>",

  "customerTrack": {{
    "verdict": "PURSUE | HOLD | AVOID",
    "confidence": <1-100>,
    "regretScore": {{
      "score": <1-100>,
      "reason": "<one sentence: why today specifically for the customer track>"
    }},
    "decidingFactors": {{
      "strongestBullSignal": "<customer signal that mattered most>",
      "strongestBearSignal": "<customer red flag that mattered most>",
      "detectiveImpact": "<how detective changed the customer track view>",
      "scaleVerdict": "<did scale help or hurt the customer case?>",
      "keySwingFactor": "<single thing that determined the customer verdict>"
    }},
    "targetDecisionMaker": {{
      "title": "<exact job title to target for customer outreach>",
      "why": "<why this person owns the problem our client solves>",
      "linkedinSearchTip": "<search string to find them>"
    }},
    "outreachEmail": {{
      "subject": "<specific subject line for customer outreach>",
      "body": "<full email under 150 words, scale-appropriate tone, connects their pain to our solution>"
    }},
    "ifHold": "<if HOLD: specific trigger that should prompt re-evaluation, else null>",
    "ifAvoid": "<if AVOID: what would need to change to revisit, else null>"
  }},

  "partnerTrack": {{
    "verdict": "PURSUE | HOLD | AVOID",
    "confidence": <1-100>,
    "regretScore": {{
      "score": <1-100>,
      "reason": "<one sentence: why today specifically for the partner track>"
    }},
    "decidingFactors": {{
      "strongestBullSignal": "<partner signal that mattered most>",
      "strongestBearSignal": "<partner red flag that mattered most>",
      "detectiveImpact": "<how detective changed the partner track view>",
      "distributionValueVerdict": "<what distribution value they actually bring>",
      "keySwingFactor": "<single thing that determined the partner verdict>"
    }},
    "targetDecisionMaker": {{
      "title": "<exact job title to target for partnership outreach>",
      "why": "<why this person owns partnership decisions>",
      "linkedinSearchTip": "<search string to find them>"
    }},
    "outreachEmail": {{
      "subject": "<specific subject line for partnership outreach>",
      "body": "<full email under 150 words, scale-appropriate tone, connects mutual benefit>"
    }},
    "ifHold": "<if HOLD: specific trigger that should prompt re-evaluation, else null>",
    "ifAvoid": "<if AVOID: what would need to change to revisit, else null>"
  }},

  "recommendedApproach": "CUSTOMER_FIRST | PARTNER_FIRST | BOTH_SIMULTANEOUSLY | CUSTOMER_NOW_PARTNER_LATER | PARTNER_NOW_CUSTOMER_LATER | NEITHER",
  "recommendedApproachReason": "<2-3 sentences explaining the recommended sequence and why>",

  "clientAdvantages": [
    "<specific advantage our client has in this account on either track>"
  ],
  "clientDisadvantages": [
    "<specific obstacle our client faces on either track>"
  ],
  "proposedNextSteps": [
    "<concrete next step 1 — specify which track this serves>",
    "<concrete next step 2 — specify which track this serves>",
    "<concrete next step 3 — specify which track this serves>"
  ]
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
    customer_track = result.get("customerTrack", {})
    partner_track = result.get("partnerTrack", {})
    customer_regret = customer_track.get("regretScore", {})
    partner_regret = partner_track.get("regretScore", {})
    print(
        f"  [ORCHESTRATOR] Done.\n"
        f"    Approach       : {result.get('recommendedApproach')}\n"
        f"    Customer Verdict: {customer_track.get('verdict')} "
        f"(confidence {customer_track.get('confidence')}, "
        f"regret {customer_regret.get('score') if isinstance(customer_regret, dict) else customer_regret})\n"
        f"    Partner Verdict : {partner_track.get('verdict')} "
        f"(confidence {partner_track.get('confidence')}, "
        f"regret {partner_regret.get('score') if isinstance(partner_regret, dict) else partner_regret})"
    )
    return result