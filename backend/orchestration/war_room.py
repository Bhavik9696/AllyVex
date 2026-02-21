# orchestration/war_room.py
from agents.bull import run_bull_agent
from agents.bear import run_bear_agent
from agents.detective import run_detective_agent
from agents.orchestrator import run_orchestrator_agent
import asyncio

async def run_war_room(domain: str):
    company_name = domain\\
        .replace("www.", "")\\
        .split(".")[0]\\
        .replace("-", " ")\\
        .title()

    yield {"phase": "BULL_START", "message": f"Bull Agent building case FOR {company_name}..."}
    bull_output = run_bull_agent(domain, company_name)
    yield {"phase": "BULL_DONE", "data": bull_output}

    yield {"phase": "BEAR_START", "message": "Bear Agent looking for red flags..."}
    bear_output = run_bear_agent(domain, company_name)
    yield {"phase": "BEAR_DONE", "data": bear_output}

    yield {"phase": "DETECTIVE_START", "message": "Detective Agent auditing both arguments..."}
    detective_output = run_detective_agent(domain, company_name, bull_output, bear_output)
    yield {"phase": "DETECTIVE_DONE", "data": detective_output}

    yield {"phase": "ORCHESTRATOR_START", "message": "Orchestrator weighing the evidence..."}
    orchestrator_output = run_orchestrator_agent(company_name, bull_output, bear_output, detective_output)
    yield {"phase": "ORCHESTRATOR_DONE", "data": orchestrator_output}

    yield {
        "phase": "COMPLETE",
        "result": {
            "companyName": company_name,
            "domain": domain,
            "verdict": orchestrator_output["verdict"],
            "regretScore": orchestrator_output["regretScore"],
            "outreachEmail": orchestrator_output["outreachEmail"],
            "confidence": orchestrator_output["confidence"],
            "agentOutputs": {
                "bull": bull_output,
                "bear": bear_output,
                "detective": detective_output,
                "orchestrator": orchestrator_output
            }
        }
    }