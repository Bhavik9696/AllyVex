import asyncio
from dotenv import load_dotenv
from orchestration.war_room import run_war_room

load_dotenv()

async def test(domain: str):
    print(f"\nALLYVEX WAR ROOM — Testing: {domain}\n")

    async for event in run_war_room(domain):
        phase = event.get("phase")
        message = event.get("message", "")
        thinking = event.get("thinking", [])

        print(f"\n[{phase}] {message}")

        if thinking:
            print("-" * 50)
            for thought in thinking:
                print(f"  FACT      : {thought.get('fact', '')}")
                print(f"  REASONING : {thought.get('reasoning', '')}")
                if thought.get("strength"):
                    print(f"  STRENGTH  : {thought.get('strength')}")
                if thought.get("severity"):
                    print(f"  SEVERITY  : {thought.get('severity')}")
                if thought.get("impact"):
                    print(f"  IMPACT    : {thought.get('impact')}")
                if thought.get("source"):
                    print(f"  SOURCE    : {thought.get('source')}")
                print()

        if phase == "COMPLETE":
            result = event.get("result", {})
            print("\n" + "=" * 60)
            print("FINAL RESULT")
            print("=" * 60)
            print(f"Company        : {result.get('companyName')}")
            print(f"Verdict        : {result.get('verdict')}")
            print(f"Confidence     : {result.get('confidence')}/100")
            print(f"Regret Score   : {result.get('regretScore', {}).get('score')}/100")
            print(f"Regret Reason  : {result.get('regretScore', {}).get('reason')}")
            print(f"\nTarget Title   : {result.get('targetDecisionMaker', {}).get('title')}")
            print(f"Why Them       : {result.get('targetDecisionMaker', {}).get('why')}")
            print(f"LinkedIn Tip   : {result.get('targetDecisionMaker', {}).get('linkedinSearchTip')}")
            print(f"\nEmail Subject  : {result.get('outreachEmail', {}).get('subject')}")
            print(f"\nEmail Body:\n{result.get('outreachEmail', {}).get('body')}")
            print(f"\nExecutive Summary:\n{result.get('executiveSummary', '')}")
            print(f"\nClient Advantages:")
            for a in result.get("clientAdvantages", []):
                print(f"  + {a}")
            print(f"\nClient Disadvantages:")
            for d in result.get("clientDisadvantages", []):
                print(f"  - {d}")
            print(f"\nNext Steps:")
            for s in result.get("proposedNextSteps", []):
                print(f"  -> {s}")
            print("=" * 60)

        if phase == "ERROR":
            print(f"\nERROR in {event.get('agent', 'UNKNOWN')}: {message}")
            break

if __name__ == "__main__":
    asyncio.run(test("stripe.com"))