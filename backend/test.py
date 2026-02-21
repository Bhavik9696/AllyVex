# test.py
import asyncio
from orchestration.war_room import run_war_room

async def test():
    async for event in run_war_room("stripe.com"):
        print(f"[{event['phase']}]", event.get('message', ''))
        if event['phase'] == 'COMPLETE':
            print("Verdict:", event['result']['verdict'])
            print("Regret Score:", event['result']['regretScore'])

asyncio.run(test())