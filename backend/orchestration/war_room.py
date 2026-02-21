import re
from agents.bull import run_bull_agent
from agents.bear import run_bear_agent
from agents.detective import run_detective_agent
from agents.orchestrator import run_orchestrator_agent

CLIENT_INFO = """
Company: DataVex
What we do: DataVex provides an AI-powered data pipeline and analytics platform
that helps enterprises modernize their data infrastructure, reduce technical debt,
and make faster decisions from real-time data.
Key strengths:
- Replaces legacy ETL pipelines with automated AI-driven ingestion
- Reduces data engineering overhead by 60 percent
- Integrates with any cloud provider in under 48 hours
- Strong ROI story for companies under fiscal pressure to cut engineering costs
- Purpose-built for companies scaling rapidly and needing real-time analytics
Target customers: Mid-market to enterprise companies with 200+ employees,
significant data operations, and either legacy infrastructure or rapid growth needs.
"""

def extract_company_name(domain: str) -> str:
    name = domain.lower()
    name = re.sub(r'^www\.', '', name)
    name = re.sub(r'\.(com|io|ai|co|net|org|app|dev).*$', '', name)
    name = name.replace('-', ' ').replace('_', ' ')
    return name.title()

def build_bull_thinking(bull_output: dict) -> list:
    thoughts = []

    funding = bull_output.get("fundingStatus", {})
    if funding.get("recentFunding"):
        thoughts.append({
            "fact": funding.get("details", "Recent funding detected"),
            "reasoning": funding.get("budgetImplication", "Budget is likely available")
        })

    hiring = bull_output.get("hiringSignals", {})
    if hiring.get("isHiringRapidly"):
        roles = ", ".join(hiring.get("relevantRoles", [])[:3])
        thoughts.append({
            "fact": f"Actively hiring: {roles}",
            "reasoning": hiring.get("hiringInsight", "Rapid hiring signals scaling pain")
        })

    for signal in bull_output.get("clientRelevantSignals", [])[:3]:
        thoughts.append({
            "fact": signal.get("signal", ""),
            "reasoning": signal.get("clientConnection", ""),
            "strength": signal.get("strength", "MEDIUM"),
            "source": signal.get("source", "")
        })

    for debt in bull_output.get("technicalDebtSignals", [])[:2]:
        thoughts.append({
            "fact": f"Technical debt: {debt.get('observation', '')}",
            "reasoning": debt.get("howClientHelps", ""),
            "strength": "HIGH"
        })

    for fiscal in bull_output.get("fiscalPressureSignals", [])[:1]:
        thoughts.append({
            "fact": f"Fiscal pressure: {fiscal.get('observation', '')}",
            "reasoning": fiscal.get("howClientHelps", ""),
            "strength": "MEDIUM"
        })

    thoughts.append({
        "fact": f"Bull Score: {bull_output.get('overallBullScore')}/100",
        "reasoning": bull_output.get("keyArgument", "")
    })

    return thoughts

def build_bear_thinking(bear_output: dict) -> list:
    thoughts = []

    deal_killer = bear_output.get("dealKiller")
    if deal_killer and deal_killer != "null" and deal_killer is not None:
        thoughts.append({
            "fact": "DEAL KILLER FOUND",
            "reasoning": deal_killer,
            "severity": "HIGH"
        })

    competitor = bear_output.get("competitorRisk", {})
    if competitor.get("hasCompetitorContract"):
        thoughts.append({
            "fact": f"Competitor already in: {competitor.get('competitorName', 'Unknown')}",
            "reasoning": competitor.get("details", ""),
            "severity": competitor.get("threatLevel", "HIGH")
        })

    financial = bear_output.get("financialHealth", {})
    if financial.get("concerning"):
        thoughts.append({
            "fact": f"Financial concern: {financial.get('details', '')}",
            "reasoning": "Financial instability reduces likelihood of new vendor spend",
            "severity": "HIGH"
        })

    leadership = bear_output.get("leadershipStability", {})
    if not leadership.get("stable"):
        thoughts.append({
            "fact": f"Leadership instability: {leadership.get('details', '')}",
            "reasoning": "Leadership changes pause vendor decisions until new team settles",
            "severity": "MEDIUM"
        })

    for flag in bear_output.get("clientRelevantRedFlags", [])[:3]:
        thoughts.append({
            "fact": flag.get("flag", ""),
            "reasoning": flag.get("clientImpact", ""),
            "severity": flag.get("severity", "MEDIUM"),
            "source": flag.get("source", "")
        })

    for barrier in bear_output.get("fiscalPressureBarriers", [])[:1]:
        thoughts.append({
            "fact": f"Budget barrier: {barrier.get('observation', '')}",
            "reasoning": barrier.get("budgetRisk", ""),
            "severity": "MEDIUM"
        })

    thoughts.append({
        "fact": f"Bear Score: {bear_output.get('overallBearScore')}/100",
        "reasoning": bear_output.get("keyArgument", "")
    })

    return thoughts

def build_detective_thinking(detective_output: dict) -> list:
    thoughts = []

    bull_score = detective_output.get("bullAudit", {}).get("evidenceScore", "N/A")
    bear_score = detective_output.get("bearAudit", {}).get("evidenceScore", "N/A")
    thoughts.append({
        "fact": f"Bull evidence quality: {bull_score}/100 — Bear evidence quality: {bear_score}/100",
        "reasoning": "Higher score means claims are better supported by real sources"
    })

    fit = detective_output.get("clientFitAssessment", {})
    if fit:
        thoughts.append({
            "fact": f"Technical fit: {fit.get('technicalFit', 'N/A')} — Budget fit: {fit.get('budgetFit', 'N/A')} — Timing fit: {fit.get('timingFit', 'N/A')}",
            "reasoning": fit.get("timingFitReason", "")
        })

    bull_audit = detective_output.get("bullAudit", {})
    if bull_audit.get("technicalDebtAssessment"):
        thoughts.append({
            "fact": "Technical debt assessment",
            "reasoning": bull_audit.get("technicalDebtAssessment", ""),
            "impact": "NEUTRAL"
        })

    if bull_audit.get("fiscalPressureAssessment"):
        thoughts.append({
            "fact": "Fiscal pressure assessment",
            "reasoning": bull_audit.get("fiscalPressureAssessment", ""),
            "impact": "NEUTRAL"
        })

    for weak in detective_output.get("bullAudit", {}).get("weakClaims", [])[:2]:
        thoughts.append({
            "fact": f"Bull claim challenged: {weak.get('claim', '')}",
            "reasoning": weak.get("weakness", ""),
            "impact": "STRENGTHENS_BEAR"
        })

    for weak in detective_output.get("bearAudit", {}).get("weakClaims", [])[:2]:
        thoughts.append({
            "fact": f"Bear claim challenged: {weak.get('claim', '')}",
            "reasoning": weak.get("weakness", ""),
            "impact": "STRENGTHENS_BULL"
        })

    for context in detective_output.get("missingContext", [])[:2]:
        thoughts.append({
            "fact": f"Overlooked: {context.get('finding', '')}",
            "reasoning": context.get("clientRelevance", ""),
            "impact": context.get("impact", "NEUTRAL")
        })

    critical = detective_output.get("criticalOverlookedFact")
    if critical:
        thoughts.append({
            "fact": "Most important overlooked fact",
            "reasoning": critical,
            "impact": "CRITICAL"
        })

    thoughts.append({
        "fact": f"Debate confidence: {detective_output.get('overallConfidenceInDebate')}/100",
        "reasoning": "How well the combined evidence supports a reliable verdict"
    })

    return thoughts

def build_orchestrator_thinking(
    orchestrator_output: dict,
    bull_output: dict,
    bear_output: dict
) -> list:
    thoughts = []

    factors = orchestrator_output.get("decidingFactors", {})

    thoughts.append({
        "fact": f"Strongest signal FOR: {factors.get('strongestBullSignal', '')}",
        "reasoning": f"Bull scored {bull_output.get('overallBullScore')}/100 — most credible positive evidence"
    })

    thoughts.append({
        "fact": f"Strongest signal AGAINST: {factors.get('strongestBearSignal', '')}",
        "reasoning": f"Bear scored {bear_output.get('overallBearScore')}/100 — most credible risk factor"
    })

    if factors.get("technicalDebtVerdict"):
        thoughts.append({
            "fact": "Technical debt ruling",
            "reasoning": factors.get("technicalDebtVerdict", "")
        })

    if factors.get("fiscalPressureVerdict"):
        thoughts.append({
            "fact": "Fiscal pressure ruling",
            "reasoning": factors.get("fiscalPressureVerdict", "")
        })

    if factors.get("pivotVerdict"):
        thoughts.append({
            "fact": "Recent pivot ruling",
            "reasoning": factors.get("pivotVerdict", "")
        })

    if factors.get("detectiveImpact"):
        thoughts.append({
            "fact": "How Detective changed the picture",
            "reasoning": factors.get("detectiveImpact", "")
        })

    thoughts.append({
        "fact": f"Decision swing factor: {factors.get('keySwingFactor', '')}",
        "reasoning": "This single piece of evidence tipped the final verdict"
    })

    regret = orchestrator_output.get("regretScore", {})
    thoughts.append({
        "fact": f"Regret Score: {regret.get('score')}/100",
        "reasoning": regret.get("reason", "")
    })

    thoughts.append({
        "fact": f"VERDICT: {orchestrator_output.get('verdict')} — Confidence {orchestrator_output.get('confidence')}/100",
        "reasoning": orchestrator_output.get("executiveSummary", "")
    })

    return thoughts


async def run_war_room(domain: str, client_info: str = CLIENT_INFO):
    company_name = extract_company_name(domain)
    print(f"\n{'='*50}")
    print(f"ALLYVEX INITIATED: {company_name} ({domain})")
    print(f"{'='*50}\n")

    # Phase 1: Bull
    yield {
        "phase": "BULL_START",
        "message": f"Bull Agent building the case FOR {company_name}...",
        "companyName": company_name
    }
    try:
        bull_output = run_bull_agent(domain, company_name, client_info)
        yield {
            "phase": "BULL_DONE",
            "message": f"Bull found {len(bull_output.get('clientRelevantSignals', []))} buying signals",
            "data": bull_output,
            "thinking": build_bull_thinking(bull_output)
        }
    except Exception as e:
        yield {"phase": "ERROR", "agent": "BULL", "message": str(e)}
        return

    # Phase 2: Bear
    yield {
        "phase": "BEAR_START",
        "message": f"Bear Agent searching for red flags on {company_name}..."
    }
    try:
        bear_output = run_bear_agent(domain, company_name, client_info)
        yield {
            "phase": "BEAR_DONE",
            "message": f"Bear found {len(bear_output.get('clientRelevantRedFlags', []))} red flags",
            "data": bear_output,
            "thinking": build_bear_thinking(bear_output)
        }
    except Exception as e:
        yield {"phase": "ERROR", "agent": "BEAR", "message": str(e)}
        return

    # Phase 3: Detective
    yield {
        "phase": "DETECTIVE_START",
        "message": "Detective Agent auditing both arguments..."
    }
    try:
        detective_output = run_detective_agent(
            domain, company_name, bull_output, bear_output, client_info
        )
        yield {
            "phase": "DETECTIVE_DONE",
            "message": f"Detective found {len(detective_output.get('missingContext', []))} overlooked facts",
            "data": detective_output,
            "thinking": build_detective_thinking(detective_output)
        }
    except Exception as e:
        yield {"phase": "ERROR", "agent": "DETECTIVE", "message": str(e)}
        return

    # Phase 4: Orchestrator
    yield {
        "phase": "ORCHESTRATOR_START",
        "message": "Orchestrator weighing all evidence and making the final call..."
    }
    try:
        orchestrator_output = run_orchestrator_agent(
            company_name, bull_output, bear_output, detective_output, client_info
        )
        yield {
            "phase": "ORCHESTRATOR_DONE",
            "message": f"Verdict: {orchestrator_output.get('verdict')}",
            "data": orchestrator_output,
            "thinking": build_orchestrator_thinking(
                orchestrator_output, bull_output, bear_output
            )
        }
    except Exception as e:
        yield {"phase": "ERROR", "agent": "ORCHESTRATOR", "message": str(e)}
        return

    # Final result
    yield {
        "phase": "COMPLETE",
        "result": {
            "companyName": company_name,
            "domain": domain,
            "verdict": orchestrator_output.get("verdict"),
            "confidence": orchestrator_output.get("confidence"),
            "regretScore": orchestrator_output.get("regretScore"),
            "outreachEmail": orchestrator_output.get("outreachEmail"),
            "targetDecisionMaker": orchestrator_output.get("targetDecisionMaker"),
            "executiveSummary": orchestrator_output.get("executiveSummary"),
            "decidingFactors": orchestrator_output.get("decidingFactors"),
            "clientAdvantages": orchestrator_output.get("clientAdvantages", []),
            "clientDisadvantages": orchestrator_output.get("clientDisadvantages", []),
            "proposedNextSteps": orchestrator_output.get("proposedNextSteps", []),
            "ifHold": orchestrator_output.get("ifHold"),
            "ifAvoid": orchestrator_output.get("ifAvoid"),
            "agentOutputs": {
                "bull": bull_output,
                "bear": bear_output,
                "detective": detective_output,
                "orchestrator": orchestrator_output
            }
        }
    }