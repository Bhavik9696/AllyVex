# utils/parser.py
import json
import re

def parse_json(raw_text: str) -> dict:
    try:
        cleaned = re.sub(r'```json|```', '', raw_text).strip()
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        print(f"Failed to parse agent output: {raw_text}")
        raise ValueError(f"Agent returned malformed JSON: {e}")