const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const submitKYC = async (payload) => {
  await delay(2500);
  return {
    success: true,
    message: "Company profile generated and stored successfully.",
  };
};

export const getCompanyDashboard = async () => {
  await delay(1200);
  return {
    overview: {
      name: "Acme Corp",
      description:
        "Acme Corp provides automated enterprise cloud security architecture and zero-trust implementations. Our AI-driven platform continuously monitors compliance, ensures data privacy governance, and offers 24/7 managed proactive threat hunting for Fortune 500 companies.",
    },
    metrics: [
      { title: "Total ICP Matches", value: "1,284" },
      { title: "Active Markets", value: "4 Regions" },
      { title: "Total Engagements", value: "342" },
      { title: "Pipeline Value", value: "$4.2M" },
    ],
    services: [
      {
        name: "Enterprise Cloud Security Architecture",
        description:
          "Full-stack security audits and Zero-Trust implementations for Fortune 500s.",
      },
      {
        name: "Data Privacy & Compliance Governance",
        description:
          "Automated GDPR/CCPA readiness frameworks and continuous monitoring.",
      },
      {
        name: "Managed Threat Intelligence",
        description:
          "24/7 proactive threat hunting and automated incident response integration.",
      },
    ],
    recentSignals: [
      {
        title: "New Product Launch: Auto-Scoring API",
        date: "Oct 24, 2023",
        type: "Product",
      },
      {
        title: "Expanded into EMEA Market via London Office",
        date: "Sep 12, 2023",
        type: "Expansion",
      },
      {
        title: "Series A Funding Round Closed ($12M)",
        date: "Aug 05, 2023",
        type: "Funding",
      },
    ],
    documentsSummmary:
      "Analyzed 45 internal documents, including master service agreements, pitch decks, and architectural schematics.",
  };
};

export const getRecommendations = async () => {
  await delay(1500);
  return [
    {
      id: "1",
      name: "Stripe",
      industry: "FinTech",
      matchScore: 94,
      reason:
        "Strong need for automated compliance monitoring scaling with their new crypto payouts.",
    },
    {
      id: "2",
      name: "Vercel",
      industry: "Developer Tools",
      matchScore: 91,
      reason:
        "Rapidly expanding enterprise tier requiring Zero-Trust security architecture.",
    },
    {
      id: "3",
      name: "Datadog",
      industry: "Cloud Monitoring",
      matchScore: 88,
      reason: "Synergistic managed threat intelligence integration potential.",
    },
  ];
};

const buildDossierFromResult = (result) => {
  const sections = [];

  if (result.executiveSummary) {
    sections.push({
      title: "Executive Summary",
      content: result.executiveSummary,
    });
  }

  const deciding = result.decidingFactors || {};
  const decidingParts = [];
  if (deciding.strongestBullSignal) {
    decidingParts.push(
      `Strongest Bull Signal: ${deciding.strongestBullSignal}`,
    );
  }
  if (deciding.strongestBearSignal) {
    decidingParts.push(
      `Strongest Bear Signal: ${deciding.strongestBearSignal}`,
    );
  }
  if (deciding.detectiveImpact) {
    decidingParts.push(`Detective Impact: ${deciding.detectiveImpact}`);
  }
  if (deciding.technicalDebtVerdict) {
    decidingParts.push(
      `Technical Debt Verdict: ${deciding.technicalDebtVerdict}`,
    );
  }
  if (deciding.fiscalPressureVerdict) {
    decidingParts.push(
      `Fiscal Pressure Verdict: ${deciding.fiscalPressureVerdict}`,
    );
  }
  if (deciding.pivotVerdict) {
    decidingParts.push(`Pivot Verdict: ${deciding.pivotVerdict}`);
  }
  if (deciding.keySwingFactor) {
    decidingParts.push(`Key Swing Factor: ${deciding.keySwingFactor}`);
  }
  if (decidingParts.length) {
    sections.push({
      title: "Deciding Factors",
      content: decidingParts.join("\n"),
    });
  }

  const advantages = result.clientAdvantages || [];
  const disadvantages = result.clientDisadvantages || [];
  if (advantages.length || disadvantages.length) {
    const lines = [];
    if (advantages.length) {
      lines.push("Client Advantages:");
      advantages.forEach((a) => lines.push(`- ${a}`));
    }
    if (disadvantages.length) {
      if (lines.length) {
        lines.push("");
      }
      lines.push("Client Disadvantages:");
      disadvantages.forEach((d) => lines.push(`- ${d}`));
    }
    sections.push({
      title: "Client Fit",
      content: lines.join("\n"),
    });
  }

  const nextSteps = result.proposedNextSteps || [];
  if (nextSteps.length) {
    sections.push({
      title: "Proposed Next Steps",
      content: nextSteps.map((s, idx) => `${idx + 1}. ${s}`).join("\n"),
    });
  }

  return sections;
};

const buildAgentTraceFromOutputs = (agentOutputs) => {
  if (!agentOutputs) {
    return [];
  }

  const trace = [];
  const bull = agentOutputs.bull || {};
  const bear = agentOutputs.bear || {};
  const detective = agentOutputs.detective || {};
  const orchestrator = agentOutputs.orchestrator || {};

  if (Object.keys(bull).length) {
    const signals = bull.clientRelevantSignals || [];
    trace.push({
      id: "bull",
      name: "Bull Agent",
      details: `Found ${signals.length} buying signals. Bull Score ${bull.overallBullScore || "N/A"}/100.`,
    });
  }

  if (Object.keys(bear).length) {
    const flags = bear.clientRelevantRedFlags || [];
    trace.push({
      id: "bear",
      name: "Bear Agent",
      details: `Found ${flags.length} red flags. Bear Score ${bear.overallBearScore || "N/A"}/100.`,
    });
  }

  if (Object.keys(detective).length) {
    trace.push({
      id: "detective",
      name: "Detective Agent",
      details: `Audited both Bull and Bear. Overall confidence in debate ${detective.overallConfidenceInDebate || "N/A"}/100.`,
    });
  }

  if (Object.keys(orchestrator).length) {
    trace.push({
      id: "orchestrator",
      name: "Orchestrator",
      details: `Issued final verdict ${orchestrator.verdict || ""} with confidence ${orchestrator.confidence || "N/A"}/100.`,
    });
  }

  return trace;
};

const buildOutreachStrategy = (result) => {
  const parts = [];
  const decisionMaker = result.targetDecisionMaker || {};
  const outreach = result.outreachEmail || {};

  if (outreach.subject) {
    parts.push(`Subject: ${outreach.subject}`);
    parts.push("");
  }
  if (outreach.body) {
    parts.push(outreach.body);
  }

  const extras = [];
  if (decisionMaker.title) {
    extras.push(`Target Decision Maker: ${decisionMaker.title}`);
  }
  if (decisionMaker.why) {
    extras.push(`Why Them: ${decisionMaker.why}`);
  }
  if (decisionMaker.linkedinSearchTip) {
    extras.push(`LinkedIn Search Tip: ${decisionMaker.linkedinSearchTip}`);
  }
  if (extras.length) {
    if (parts.length) {
      parts.push("");
    }
    parts.push(extras.join("\n"));
  }

  return parts.join("\n");
};

export const runTargetAnalysis = async (domain, onStageChange) => {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ domain }),
  });

  if (!response.ok || !response.body) {
    throw new Error("Failed to start analysis");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let finalResult = null;
  let doneStreaming = false;

  while (!doneStreaming) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    let separatorIndex;
    while ((separatorIndex = buffer.indexOf("\n\n")) !== -1) {
      const rawEvent = buffer.slice(0, separatorIndex).trim();
      buffer = buffer.slice(separatorIndex + 2);

      if (!rawEvent.startsWith("data:")) {
        continue;
      }

      const dataStr = rawEvent.slice(5).trim();
      if (!dataStr) {
        continue;
      }

      if (dataStr === "[DONE]") {
        doneStreaming = true;
        break;
      }

      try {
        const event = JSON.parse(dataStr);
        if (
          event.phase &&
          event.message &&
          typeof onStageChange === "function"
        ) {
          onStageChange(event.message);
        }
        if (event.phase === "COMPLETE" && event.result) {
          finalResult = event.result;
        }
      } catch (e) {
        continue;
      }
    }
  }

  if (!finalResult) {
    throw new Error("Analysis did not complete");
  }

  const verdictRaw = finalResult.verdict || "";
  let verdictDisplay = verdictRaw;
  if (verdictRaw === "PURSUE") {
    verdictDisplay = "STRONG BUY";
  }

  return {
    dossier: buildDossierFromResult(finalResult),
    verdict: verdictDisplay,
    confidence: finalResult.confidence || 0,
    outreachStrategy: buildOutreachStrategy(finalResult),
    agentTrace: buildAgentTraceFromOutputs(finalResult.agentOutputs),
  };
};

export const generatePDF = async (url) => {
  await delay(2000);
  return {
    success: true,
    downloadUrl: "#",
  };
};
