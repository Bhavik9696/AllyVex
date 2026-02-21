import anthropic
import json
import os
from dotenv import load_dotenv

load_dotenv()
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

SEARCH_TOOL = {
    "type": "web_search_20250305",
    "name": "web_search"
}

def run_bull_agent(domain: str, company_name: str) -> dict:
    system_prompt = """
You are the Bull Agent in a sales intelligence system.
Your ONLY job is to find strong reasons to pursue this company as a sales lead.
You are optimistic and looking for buying signals.

Search for: recent funding, rapid hiring, product launches, 
leadership changes, public complaints about current tooling.

Return ONLY valid JSON in this exact format:
{
  "agentRole": "BULL",
  "companyName": "<name>",
  "topSignals": [
    {
      "signal": "<what you found>",
      "source": "<url>",
      "strength": "HIGH | MEDIUM | LOW",
      "reasoning": "<why this is a buying signal>"
    }
  ],
  "overallBullScore": <1-100>,
  "keyArgument": "<strongest case for pursuing in 2 sentences>"
}
"""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        tools=[SEARCH_TOOL],
        system=system_prompt,
        messages=[
            {
                "role": "user",
                "content": f"Research this company and build the bull case: {domain}. Company: {company_name}"
            }
        ]
    )

    # Extract text blocks from response
    text_content = " ".join(
        block.text for block in response.content 
        if hasattr(block, "text")
    )

    return parse_json(text_content)