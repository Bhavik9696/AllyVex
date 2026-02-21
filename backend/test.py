import asyncio
from dotenv import load_dotenv
from utils.doc_generator import generate_client_info
from orchestration.war_room import run_war_room

load_dotenv()

async def test(client_url: str, target_domain: str):

    # Step 1: Generate client profile from their URL
    print(f"\n{'='*60}")
    print(f"STEP 1 — Generating client profile from {client_url}")
    print(f"{'='*60}")

    client_info = generate_client_info(client_url)

    print(f"\nGenerated Client Profile:")
    print("-" * 60)
    print(client_info)
    print("-" * 60)

    # Step 2: Run War Room on target domain
    print(f"\n{'='*60}")
    print(f"STEP 2 — Running War Room on {target_domain}")
    print(f"{'='*60}\n")

    async for event in run_war_room(target_domain, client_info):
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
            customer = result.get("customerTrack", {})
            partner = result.get("partnerTrack", {})
            customer_regret = customer.get("regretScore", {}) or {}
            partner_regret = partner.get("regretScore", {}) or {}
            customer_dm = customer.get("targetDecisionMaker", {}) or {}
            partner_dm = partner.get("targetDecisionMaker", {}) or {}
            customer_email = customer.get("outreachEmail", {}) or {}
            partner_email = partner.get("outreachEmail", {}) or {}

            print("\n" + "=" * 60)
            print("FINAL RESULT")
            print("=" * 60)
            print(f"Company            : {result.get('companyName')}")
            print(f"Confirmed Scale    : {result.get('confirmedScale')}")
            print(f"Recommended Approach: {result.get('recommendedApproach')}")
            print(f"Approach Reason    : {result.get('recommendedApproachReason')}")

            print(f"\n── CUSTOMER TRACK ──")
            print(f"Verdict        : {customer.get('verdict')}")
            print(f"Confidence     : {customer.get('confidence')}/100")
            print(f"Regret Score   : {customer_regret.get('score')}/100")
            print(f"Regret Reason  : {customer_regret.get('reason')}")
            print(f"Target Title   : {customer_dm.get('title')}")
            print(f"Why Them       : {customer_dm.get('why')}")
            print(f"LinkedIn Tip   : {customer_dm.get('linkedinSearchTip')}")
            print(f"Email Subject  : {customer_email.get('subject')}")
            print(f"Email Body:\n{customer_email.get('body')}")
            if customer.get("ifHold"):
                print(f"If HOLD        : {customer.get('ifHold')}")
            if customer.get("ifAvoid"):
                print(f"If AVOID       : {customer.get('ifAvoid')}")

            print(f"\n── PARTNER TRACK ──")
            print(f"Verdict        : {partner.get('verdict')}")
            print(f"Confidence     : {partner.get('confidence')}/100")
            print(f"Regret Score   : {partner_regret.get('score')}/100")
            print(f"Regret Reason  : {partner_regret.get('reason')}")
            print(f"Target Title   : {partner_dm.get('title')}")
            print(f"Why Them       : {partner_dm.get('why')}")
            print(f"LinkedIn Tip   : {partner_dm.get('linkedinSearchTip')}")
            print(f"Email Subject  : {partner_email.get('subject')}")
            print(f"Email Body:\n{partner_email.get('body')}")
            if partner.get("ifHold"):
                print(f"If HOLD        : {partner.get('ifHold')}")
            if partner.get("ifAvoid"):
                print(f"If AVOID       : {partner.get('ifAvoid')}")

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
            print(f"\nGenerated Documents:")
            docs = result.get("documents", {})
            c_docs = docs.get("customer", {})
            p_docs = docs.get("partner", {})
            print(f"  [CUSTOMER] DOCX Dossier     : {c_docs.get('dossier') or 'Not generated'}")
            print(f"  [CUSTOMER] PDF Exec Summary : {c_docs.get('executiveSummary') or 'Not generated'}")
            print(f"  [PARTNER]  DOCX Dossier     : {p_docs.get('dossier') or 'Not generated'}")
            print(f"  [PARTNER]  PDF Exec Summary : {p_docs.get('executiveSummary') or 'Not generated'}")
            print("=" * 60)

        if phase == "ERROR":
            print(f"\nERROR in {event.get('agent', 'UNKNOWN')}: {message}")
            break

if __name__ == "__main__":
    asyncio.run(test(
        client_url="https://datavex.ai",   # Your company URL
        target_domain="amazon.com"          # Target lead to analyze
    ))