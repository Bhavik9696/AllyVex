import re
from agents.bull import run_bull_agent
from agents.bear import run_bear_agent
from agents.detective import run_detective_agent
from agents.orchestrator import run_orchestrator_agent
from utils.document_generator import generate_dossier, generate_executive_summary_pdf

# Fallback CLIENT_INFO — overridden at runtime by the caller passing client_info param
CLIENT_INFO = ""

def extract_company_name(domain: str) -> str:
    name = domain.lower()
    name = re.sub(r'^www\.', '', name)
    name = re.sub(r'\.(com|io|ai|co|net|org|app|dev).*$', '', name)
    name = name.replace('-', ' ').replace('_', ' ')
    return name.title()

def build_bull_thinking(bull_output: dict) -> list:
    thoughts = []

    scale = bull_output.get("companyScale", {})
    if scale:
        thoughts.append({
            "fact": f"Company Scale: {scale.get('scaleCategory', 'UNKNOWN')} — {scale.get('estimatedEmployees', '?')} employees",
            "reasoning": scale.get("scaleReasoning", ""),
            "impact": "NEUTRAL"
        })

    for signal in bull_output.get("customerSignals", [])[:3]:
        thoughts.append({
            "fact": f"[CUSTOMER] {signal.get('signal', '')}",
            "reasoning": signal.get("clientConnection", ""),
            "strength": signal.get("strength", "MEDIUM"),
            "source": signal.get("source", "")
        })

    for signal in bull_output.get("partnerSignals", [])[:2]:
        thoughts.append({
            "fact": f"[PARTNER] {signal.get('signal', '')}",
            "reasoning": signal.get("partnerConnection", ""),
            "strength": signal.get("strength", "MEDIUM"),
            "source": signal.get("source", "")
        })

    for debt in bull_output.get("technicalDebtSignals", [])[:1]:
        thoughts.append({
            "fact": f"[CUSTOMER] Technical debt: {debt.get('observation', '')}",
            "reasoning": debt.get("howClientHelps", ""),
            "strength": "HIGH"
        })

    for fiscal in bull_output.get("fiscalPressureSignals", [])[:1]:
        thoughts.append({
            "fact": f"[CUSTOMER] Fiscal pressure: {fiscal.get('observation', '')}",
            "reasoning": fiscal.get("howClientHelps", ""),
            "strength": "MEDIUM"
        })

    hiring = bull_output.get("hiringSignals", {})
    if hiring.get("isHiringRapidly"):
        roles = ", ".join(hiring.get("relevantRoles", [])[:3])
        thoughts.append({
            "fact": f"Actively hiring: {roles}",
            "reasoning": hiring.get("hiringInsight", ""),
            "strength": "MEDIUM"
        })

    funding = bull_output.get("fundingStatus", {})
    if funding.get("recentFunding"):
        thoughts.append({
            "fact": f"Funding: {funding.get('details', 'Recent funding detected')}",
            "reasoning": funding.get("budgetImplication", ""),
            "strength": "HIGH"
        })

    scores = bull_output.get("overallBullScore", {})
    if isinstance(scores, dict):
        thoughts.append({
            "fact": f"Customer Score: {scores.get('customerScore')}/100 — Partner Score: {scores.get('partnerScore')}/100",
            "reasoning": (
                bull_output.get("keyArgument", {}).get("asCustomer", "")
                if isinstance(bull_output.get("keyArgument"), dict)
                else str(bull_output.get("keyArgument", ""))
            )
        })
    else:
        thoughts.append({
            "fact": f"Bull Score: {scores}/100",
            "reasoning": str(bull_output.get("keyArgument", ""))
        })

    return thoughts


def build_bear_thinking(bear_output: dict) -> list:
    thoughts = []

    scale = bear_output.get("scaleDisqualifiers", {})
    if scale.get("customerScaleIssue"):
        thoughts.append({
            "fact": f"[CUSTOMER] Scale disqualifier: {scale.get('customerScaleIssue')}",
            "reasoning": "Wrong scale makes a customer relationship unviable",
            "severity": "HIGH"
        })

    if scale.get("partnerScaleIssue"):
        thoughts.append({
            "fact": f"[PARTNER] Scale disqualifier: {scale.get('partnerScaleIssue')}",
            "reasoning": "Wrong scale makes a partnership commercially unviable",
            "severity": "HIGH"
        })

    deal_killer = bear_output.get("dealKiller", {})
    if isinstance(deal_killer, dict):
        if deal_killer.get("customerDealKiller"):
            thoughts.append({
                "fact": "[CUSTOMER] DEAL KILLER",
                "reasoning": deal_killer.get("customerDealKiller"),
                "severity": "HIGH"
            })
        if deal_killer.get("partnerDealKiller"):
            thoughts.append({
                "fact": "[PARTNER] DEAL KILLER",
                "reasoning": deal_killer.get("partnerDealKiller"),
                "severity": "HIGH"
            })
    elif deal_killer and deal_killer != "null":
        thoughts.append({
            "fact": "DEAL KILLER FOUND",
            "reasoning": str(deal_killer),
            "severity": "HIGH"
        })

    competitor = bear_output.get("competitorRisk", {})
    customer_competitor = competitor.get("asCustomer", competitor)
    if customer_competitor.get("hasCompetitorContract"):
        thoughts.append({
            "fact": f"[CUSTOMER] Competitor already in: {customer_competitor.get('competitorName', 'Unknown')}",
            "reasoning": customer_competitor.get("details", ""),
            "severity": customer_competitor.get("threatLevel", "HIGH")
        })

    partner_competitor = competitor.get("asPartner", {})
    if partner_competitor.get("competesWithClient"):
        thoughts.append({
            "fact": "[PARTNER] Direct competitor conflict",
            "reasoning": partner_competitor.get("details", ""),
            "severity": partner_competitor.get("threatLevel", "HIGH")
        })

    financial = bear_output.get("financialHealth", {})
    if financial.get("concerning"):
        thoughts.append({
            "fact": f"Financial concern: {financial.get('details', '')}",
            "reasoning": "Financial instability impacts both customer spend and partnership viability",
            "severity": "HIGH"
        })

    leadership = bear_output.get("leadershipStability", {})
    if not leadership.get("stable"):
        thoughts.append({
            "fact": f"Leadership instability: {leadership.get('details', '')}",
            "reasoning": "Leadership changes pause both vendor decisions and partnership conversations",
            "severity": "MEDIUM"
        })

    for flag in bear_output.get("customerRedFlags", bear_output.get("clientRelevantRedFlags", []))[:3]:
        thoughts.append({
            "fact": f"[CUSTOMER] {flag.get('flag', '')}",
            "reasoning": flag.get("clientImpact", flag.get("clientConnection", "")),
            "severity": flag.get("severity", "MEDIUM"),
            "source": flag.get("source", "")
        })

    for flag in bear_output.get("partnerRedFlags", [])[:2]:
        thoughts.append({
            "fact": f"[PARTNER] {flag.get('flag', '')}",
            "reasoning": flag.get("partnershipImpact", ""),
            "severity": flag.get("severity", "MEDIUM"),
            "source": flag.get("source", "")
        })

    scores = bear_output.get("overallBearScore", {})
    if isinstance(scores, dict):
        thoughts.append({
            "fact": f"Customer Risk: {scores.get('customerScore')}/100 — Partner Risk: {scores.get('partnerScore')}/100",
            "reasoning": (
                bear_output.get("keyArgument", {}).get("asCustomer", "")
                if isinstance(bear_output.get("keyArgument"), dict)
                else str(bear_output.get("keyArgument", ""))
            )
        })
    else:
        thoughts.append({
            "fact": f"Bear Score: {scores}/100",
            "reasoning": str(bear_output.get("keyArgument", ""))
        })

    return thoughts


def build_detective_thinking(detective_output: dict) -> list:
    thoughts = []

    scale = detective_output.get("scaleVerification", {})
    if scale:
        thoughts.append({
            "fact": f"Confirmed Scale: {scale.get('confirmedScale', 'UNCONFIRMED')}",
            "reasoning": (
                f"Customer impact: {scale.get('scaleImpactsCustomerTrack', '')} | "
                f"Partner impact: {scale.get('scaleImpactsPartnerTrack', '')}"
            ),
            "impact": "NEUTRAL"
        })
    else:
        bull_score = detective_output.get("bullAudit", {}).get("evidenceScore", "N/A")
        bear_score = detective_output.get("bearAudit", {}).get("evidenceScore", "N/A")
        thoughts.append({
            "fact": f"Bull evidence quality: {bull_score}/100 — Bear evidence quality: {bear_score}/100",
            "reasoning": "Higher score means claims are better supported by real sources"
        })

    customer_audit = detective_output.get("customerTrackAudit", detective_output.get("bullAudit", {}))
    if customer_audit:
        thoughts.append({
            "fact": (
                f"[CUSTOMER] Technical fit: {customer_audit.get('technicalFit', 'N/A')} — "
                f"Budget fit: {customer_audit.get('budgetFit', 'N/A')} — "
                f"Timing fit: {customer_audit.get('timingFit', 'N/A')}"
            ),
            "reasoning": customer_audit.get("timingFitReason", customer_audit.get("fiscalPressureAssessment", ""))
        })

    partner_audit = detective_output.get("partnerTrackAudit", {})
    if partner_audit:
        thoughts.append({
            "fact": (
                f"[PARTNER] Customer overlap: {partner_audit.get('customerBaseOverlap', 'N/A')} — "
                f"Distribution value: {partner_audit.get('distributionValue', 'N/A')}"
            ),
            "reasoning": partner_audit.get("commercialViabilityReason", "")
        })

    split = detective_output.get("splitVerdictAssessment", {})
    if split:
        thoughts.append({
            "fact": f"Split Verdict: Customer {split.get('customerTrackStrength')} — Partner {split.get('partnerTrackStrength')}",
            "reasoning": split.get("splitReasoning", ""),
            "impact": "CRITICAL"
        })
        thoughts.append({
            "fact": f"Recommended approach: {split.get('recommendedApproach')}",
            "reasoning": split.get("sequencingAdvice", "")
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
            "fact": f"[{context.get('impactsTrack', context.get('impact', 'BOTH'))}] Overlooked: {context.get('finding', '')}",
            "reasoning": context.get("clientRelevance", context.get("explanation", "")),
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
        "reasoning": "How well the combined evidence supports reliable verdicts on both tracks"
    })

    return thoughts


def build_orchestrator_thinking(
    orchestrator_output: dict,
    bull_output: dict,
    bear_output: dict
) -> list:
    thoughts = []

    thoughts.append({
        "fact": f"Confirmed Scale: {orchestrator_output.get('confirmedScale', 'UNKNOWN')}",
        "reasoning": orchestrator_output.get("executiveSummary", "")
    })

    customer = orchestrator_output.get("customerTrack", {})
    if customer:
        customer_factors = customer.get("decidingFactors", {})
        thoughts.append({
            "fact": f"[CUSTOMER VERDICT] {customer.get('verdict')} — Confidence {customer.get('confidence')}/100",
            "reasoning": customer_factors.get("keySwingFactor", "")
        })
        thoughts.append({
            "fact": f"[CUSTOMER] Strongest FOR: {customer_factors.get('strongestBullSignal', '')}",
            "reasoning": f"Scale verdict: {customer_factors.get('scaleVerdict', '')}"
        })
        thoughts.append({
            "fact": f"[CUSTOMER] Strongest AGAINST: {customer_factors.get('strongestBearSignal', '')}",
            "reasoning": customer_factors.get("detectiveImpact", "")
        })
        customer_regret = customer.get("regretScore", {})
        if isinstance(customer_regret, dict):
            thoughts.append({
                "fact": f"[CUSTOMER] Regret Score: {customer_regret.get('score')}/100",
                "reasoning": customer_regret.get("reason", "")
            })
    else:
        factors = orchestrator_output.get("decidingFactors", {})
        bull_score = bull_output.get("overallBullScore", {})
        bear_score = bear_output.get("overallBearScore", {})
        thoughts.append({
            "fact": f"Strongest signal FOR: {factors.get('strongestBullSignal', '')}",
            "reasoning": f"Bull scored {bull_score.get('combinedScore') if isinstance(bull_score, dict) else bull_score}/100"
        })
        thoughts.append({
            "fact": f"Strongest signal AGAINST: {factors.get('strongestBearSignal', '')}",
            "reasoning": f"Bear scored {bear_score.get('combinedScore') if isinstance(bear_score, dict) else bear_score}/100"
        })
        regret = orchestrator_output.get("regretScore", {})
        if isinstance(regret, dict):
            thoughts.append({
                "fact": f"Regret Score: {regret.get('score')}/100",
                "reasoning": regret.get("reason", "")
            })

    partner = orchestrator_output.get("partnerTrack", {})
    if partner:
        partner_factors = partner.get("decidingFactors", {})
        thoughts.append({
            "fact": f"[PARTNER VERDICT] {partner.get('verdict')} — Confidence {partner.get('confidence')}/100",
            "reasoning": partner_factors.get("keySwingFactor", "")
        })
        thoughts.append({
            "fact": f"[PARTNER] Distribution value: {partner_factors.get('distributionValueVerdict', '')}",
            "reasoning": f"Strongest partner signal: {partner_factors.get('strongestBullSignal', '')}"
        })
        partner_regret = partner.get("regretScore", {})
        if isinstance(partner_regret, dict):
            thoughts.append({
                "fact": f"[PARTNER] Regret Score: {partner_regret.get('score')}/100",
                "reasoning": partner_regret.get("reason", "")
            })

    recommended = orchestrator_output.get("recommendedApproach")
    if recommended:
        thoughts.append({
            "fact": f"RECOMMENDED APPROACH: {recommended}",
            "reasoning": orchestrator_output.get("recommendedApproachReason", ""),
            "impact": "CRITICAL"
        })
    else:
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
            "message": f"Bull found {len(bull_output.get('customerSignals', bull_output.get('clientRelevantSignals', [])))} buying signals",
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
            "message": f"Bear found {len(bear_output.get('customerRedFlags', bear_output.get('clientRelevantRedFlags', [])))} red flags",
            "data": bear_output,
            "thinking": build_bear_thinking(bear_output)
        }
    except Exception as e:
        yield {"phase": "ERROR", "agent": "BEAR", "message": str(e)}
        return

    # NOTE: Sentiment agent is not implemented — skipped gracefully
    sentiment_output = {}

    # Phase 3: Detective
    yield {
        "phase": "DETECTIVE_START",
        "message": "Detective Agent auditing all evidence..."
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
            "message": f"Approach: {orchestrator_output.get('recommendedApproach', orchestrator_output.get('verdict', 'COMPLETE'))}",
            "data": orchestrator_output,
            "thinking": build_orchestrator_thinking(
                orchestrator_output, bull_output, bear_output
            )
        }
    except Exception as e:
        yield {"phase": "ERROR", "agent": "ORCHESTRATOR", "message": str(e)}
        return

    # Generate DOCX and PDF for BOTH tracks
    customer_docx = None
    partner_docx  = None
    customer_pdf  = None
    partner_pdf   = None

    # ── Customer Track Documents ──
    try:
        print(f"  [WAR_ROOM] Generating CUSTOMER DOCX dossier for {company_name}...")
        customer_docx = generate_dossier(
            company_name=company_name,
            domain=domain,
            client_info=client_info,
            bull_output=bull_output,
            bear_output=bear_output,
            detective_output=detective_output,
            orchestrator_output=orchestrator_output,
            track="customer"
        )
        print(f"  [WAR_ROOM] Customer DOCX saved: {customer_docx}")
    except Exception as e:
        print(f"  [WAR_ROOM] Customer DOCX generation failed: {e}")

    try:
        print(f"  [WAR_ROOM] Generating CUSTOMER PDF executive summary for {company_name}...")
        customer_pdf = generate_executive_summary_pdf(
            company_name=company_name,
            domain=domain,
            orchestrator_output=orchestrator_output,
            track="customer"
        )
        print(f"  [WAR_ROOM] Customer PDF saved: {customer_pdf}")
    except Exception as e:
        print(f"  [WAR_ROOM] Customer PDF generation failed: {e}")

    # ── Partner Track Documents ──
    try:
        print(f"  [WAR_ROOM] Generating PARTNER DOCX dossier for {company_name}...")
        partner_docx = generate_dossier(
            company_name=company_name,
            domain=domain,
            client_info=client_info,
            bull_output=bull_output,
            bear_output=bear_output,
            detective_output=detective_output,
            orchestrator_output=orchestrator_output,
            track="partner"
        )
        print(f"  [WAR_ROOM] Partner DOCX saved: {partner_docx}")
    except Exception as e:
        print(f"  [WAR_ROOM] Partner DOCX generation failed: {e}")

    try:
        print(f"  [WAR_ROOM] Generating PARTNER PDF executive summary for {company_name}...")
        partner_pdf = generate_executive_summary_pdf(
            company_name=company_name,
            domain=domain,
            orchestrator_output=orchestrator_output,
            track="partner"
        )
        print(f"  [WAR_ROOM] Partner PDF saved: {partner_pdf}")
    except Exception as e:
        print(f"  [WAR_ROOM] Partner PDF generation failed: {e}")

    # Final result
    customer_track = orchestrator_output.get("customerTrack", {})
    partner_track = orchestrator_output.get("partnerTrack", {})

    yield {
        "phase": "COMPLETE",
        "message": "Analysis complete.",
        "result": {
            "companyName": company_name,
            "domain": domain,
            "confirmedScale": orchestrator_output.get("confirmedScale"),
            "recommendedApproach": orchestrator_output.get("recommendedApproach", "CUSTOMER_FIRST"),
            "recommendedApproachReason": orchestrator_output.get("recommendedApproachReason"),
            "executiveSummary": orchestrator_output.get("executiveSummary"),

            # Dual track results
            "customerTrack": {
                "verdict": customer_track.get("verdict", orchestrator_output.get("verdict")),
                "confidence": customer_track.get("confidence", orchestrator_output.get("confidence")),
                "regretScore": customer_track.get("regretScore", orchestrator_output.get("regretScore")),
                "targetDecisionMaker": customer_track.get("targetDecisionMaker", orchestrator_output.get("targetDecisionMaker")),
                "outreachEmail": customer_track.get("outreachEmail", orchestrator_output.get("outreachEmail")),
                "decidingFactors": customer_track.get("decidingFactors", orchestrator_output.get("decidingFactors")),
                "ifHold": customer_track.get("ifHold", orchestrator_output.get("ifHold")),
                "ifAvoid": customer_track.get("ifAvoid", orchestrator_output.get("ifAvoid"))
            },
            "partnerTrack": {
                "verdict": partner_track.get("verdict"),
                "confidence": partner_track.get("confidence"),
                "regretScore": partner_track.get("regretScore"),
                "targetDecisionMaker": partner_track.get("targetDecisionMaker"),
                "outreachEmail": partner_track.get("outreachEmail"),
                "decidingFactors": partner_track.get("decidingFactors"),
                "ifHold": partner_track.get("ifHold"),
                "ifAvoid": partner_track.get("ifAvoid")
            },

            # Shared fields
            "clientAdvantages": orchestrator_output.get("clientAdvantages", []),
            "clientDisadvantages": orchestrator_output.get("clientDisadvantages", []),
            "proposedNextSteps": orchestrator_output.get("proposedNextSteps", []),

            # Full agent outputs for frontend drill-down
            "agentOutputs": {
                "bull": bull_output,
                "bear": bear_output,
                "detective": detective_output,
                "orchestrator": orchestrator_output
            },

            # Generated document filenames (4 files: customer + partner × docx + pdf)
            "documents": {
                "customer": {
                    "dossier": customer_docx,
                    "executiveSummary": customer_pdf
                },
                "partner": {
                    "dossier": partner_docx,
                    "executiveSummary": partner_pdf
                }
            }
        }
    }