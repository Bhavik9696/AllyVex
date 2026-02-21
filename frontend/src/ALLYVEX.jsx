import { useState, useRef, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:8000";

const VERDICT_CONFIG = {
  PURSUE: { color: "#00ff88", bg: "rgba(0,255,136,0.1)", border: "rgba(0,255,136,0.3)", label: "PURSUE" },
  HOLD:   { color: "#ffb800", bg: "rgba(255,184,0,0.1)", border: "rgba(255,184,0,0.3)", label: "HOLD" },
  AVOID:  { color: "#ff3b5c", bg: "rgba(255,59,92,0.1)", border: "rgba(255,59,92,0.3)", label: "AVOID" },
};

const APPROACH_LABELS = {
  CUSTOMER_FIRST:           "Customer First",
  PARTNER_FIRST:            "Partner First",
  BOTH_SIMULTANEOUSLY:      "Both Simultaneously",
  CUSTOMER_NOW_PARTNER_LATER:"Customer Now, Partner Later",
  PARTNER_NOW_CUSTOMER_LATER:"Partner Now, Customer Later",
  NEITHER:                  "Neither",
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const injectStyles = () => `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Syne:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #080c10;
    color: #c8d4e0;
    font-family: 'IBM Plex Mono', monospace;
    min-height: 100vh;
  }

  .allyvex-root {
    min-height: 100vh;
    background: #080c10;
    background-image:
      radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,180,255,0.06) 0%, transparent 60%),
      linear-gradient(180deg, #080c10 0%, #050810 100%);
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0d1117; }
  ::-webkit-scrollbar-thumb { background: #1e2d3d; border-radius: 2px; }

  /* Animations */
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  @keyframes scan-line {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes thinking-appear {
    from { opacity: 0; transform: translateX(-8px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  @keyframes progress-fill {
    from { width: 0%; }
    to { width: 100%; }
  }

  .fade-in-up { animation: fade-in-up 0.4s ease forwards; }
  .thinking-appear { animation: thinking-appear 0.3s ease forwards; }
`;

// ─── Sub-components ───────────────────────────────────────────────────────────

const Header = () => (
  <header style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 40px", borderBottom: "1px solid #0e1a26",
    background: "rgba(8,12,16,0.95)", backdropFilter: "blur(10px)",
    position: "sticky", top: 0, zIndex: 100,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{
        width: 36, height: 36, background: "linear-gradient(135deg, #00b4ff, #0066cc)",
        borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, fontWeight: 700, color: "#fff", fontFamily: "Syne, sans-serif",
      }}>A</div>
      <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, color: "#e8f0fa", letterSpacing: 3 }}>
        ALLYVEX
      </span>
      <span style={{ fontSize: 10, color: "#3a5570", letterSpacing: 2, marginLeft: 4 }}>WAR ROOM</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88",
        animation: "pulse-dot 2s ease infinite", display: "inline-block" }} />
      <span style={{ fontSize: 11, color: "#3a5570", letterSpacing: 1 }}>SYSTEM ONLINE</span>
    </div>
  </header>
);

const Card = ({ children, style = {}, className = "" }) => (
  <div className={className} style={{
    background: "rgba(13,17,23,0.8)",
    border: "1px solid #0e1a26",
    borderRadius: 8,
    ...style,
  }}>{children}</div>
);

const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 10, color: "#3a5570", letterSpacing: 3, marginBottom: 12, textTransform: "uppercase" }}>
    {children}
  </div>
);

const Input = ({ value, onChange, placeholder, disabled }) => (
  <input
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    disabled={disabled}
    style={{
      width: "100%", padding: "12px 16px", background: "#0a1018",
      border: "1px solid #0e1a26", borderRadius: 6, color: "#c8d4e0",
      fontFamily: "IBM Plex Mono, monospace", fontSize: 13, outline: "none",
      transition: "border-color 0.2s",
    }}
    onFocus={e => e.target.style.borderColor = "#00b4ff"}
    onBlur={e => e.target.style.borderColor = "#0e1a26"}
  />
);

const Button = ({ children, onClick, disabled, loading, variant = "primary", style = {} }) => {
  const variants = {
    primary: { background: "linear-gradient(135deg, #0077cc, #005599)", color: "#fff", border: "none" },
    ghost:   { background: "transparent", color: "#00b4ff", border: "1px solid #0e3a5c" },
    danger:  { background: "transparent", color: "#ff3b5c", border: "1px solid #3a1020" },
    success: { background: "rgba(0,255,136,0.08)", color: "#00ff88", border: "1px solid rgba(0,255,136,0.2)" },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        padding: "10px 20px", borderRadius: 6, fontFamily: "IBM Plex Mono, monospace",
        fontSize: 12, fontWeight: 500, cursor: disabled || loading ? "not-allowed" : "pointer",
        letterSpacing: 1, opacity: disabled || loading ? 0.5 : 1,
        transition: "all 0.2s", ...variants[variant], ...style,
      }}
    >
      {loading ? "PROCESSING..." : children}
    </button>
  );
};

const VerdictBadge = ({ verdict, size = "sm" }) => {
  const cfg = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.AVOID;
  return (
    <span style={{
      padding: size === "lg" ? "6px 16px" : "3px 10px",
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      color: cfg.color, borderRadius: 4,
      fontSize: size === "lg" ? 13 : 10, fontWeight: 600, letterSpacing: 2,
    }}>{verdict}</span>
  );
};

const ScoreRing = ({ score, label, color = "#00b4ff", size = 80 }) => {
  const r = 30, c = 2 * Math.PI * r;
  const fill = (score / 100) * c;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width={size} height={size} viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="40" cy="40" r={r} fill="none" stroke="#0e1a26" strokeWidth="4" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={`${fill} ${c}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 1s ease" }} />
      </svg>
      <div style={{ textAlign: "center", marginTop: -size/2 - 4, position: "relative", top: -size/2 + 8 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 9, color: "#3a5570", letterSpacing: 1 }}>{label}</div>
      </div>
    </div>
  );
};

// ─── Thinking Feed ────────────────────────────────────────────────────────────
const ThinkingItem = ({ item, index }) => {
  const isDealKiller = item.fact?.includes("DEAL KILLER");
  const isCritical = item.impact === "CRITICAL";
  const isStrengthHigh = item.strength === "HIGH";
  const isSeverityHigh = item.severity === "HIGH";

  let accentColor = "#3a5570";
  if (isDealKiller || isSeverityHigh) accentColor = "#ff3b5c";
  else if (isStrengthHigh) accentColor = "#00ff88";
  else if (item.impact === "STRENGTHENS_BULL") accentColor = "#00ff88";
  else if (item.impact === "STRENGTHENS_BEAR") accentColor = "#ffb800";
  else if (isCritical) accentColor = "#ffb800";

  return (
    <div className="thinking-appear" style={{
      animationDelay: `${index * 0.05}s`,
      padding: "10px 12px",
      borderLeft: `2px solid ${accentColor}`,
      background: isDealKiller ? "rgba(255,59,92,0.05)" : isCritical ? "rgba(255,184,0,0.04)" : "transparent",
      borderRadius: "0 4px 4px 0",
      marginBottom: 8,
    }}>
      <div style={{ fontSize: 11, color: isDealKiller ? "#ff3b5c" : isCritical ? "#ffb800" : "#8baabb", fontWeight: 500, marginBottom: 3 }}>
        {typeof item.fact === "object" ? JSON.stringify(item.fact) : String(item.fact ?? "")}
      </div>
      <div style={{ fontSize: 10, color: "#3a5570", lineHeight: 1.5 }}>
        {typeof item.reasoning === "object" ? JSON.stringify(item.reasoning) : String(item.reasoning ?? "")}
      </div>
      {item.source && (
        <a href={item.source} target="_blank" rel="noreferrer"
          style={{ fontSize: 9, color: "#0066cc", display: "block", marginTop: 4, textDecoration: "none" }}>
          ↗ source
        </a>
      )}
      <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
        {item.strength && (
          <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, letterSpacing: 1,
            background: item.strength === "HIGH" ? "rgba(0,255,136,0.1)" : "rgba(58,85,112,0.3)",
            color: item.strength === "HIGH" ? "#00ff88" : "#3a5570" }}>
            STRENGTH:{item.strength}
          </span>
        )}
        {item.severity && (
          <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, letterSpacing: 1,
            background: item.severity === "HIGH" ? "rgba(255,59,92,0.1)" : "rgba(58,85,112,0.3)",
            color: item.severity === "HIGH" ? "#ff3b5c" : "#3a5570" }}>
            SEVERITY:{item.severity}
          </span>
        )}
        {item.impact && item.impact !== "NEUTRAL" && (
          <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 3, letterSpacing: 1,
            background: "rgba(58,85,112,0.2)", color: "#3a7090" }}>
            {item.impact}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Agent Card ───────────────────────────────────────────────────────────────
const AGENT_META = {
  bull:        { icon: "◆", label: "BULL AGENT",        desc: "Building the case FOR", color: "#00ff88" },
  bear:        { icon: "◈", label: "BEAR AGENT",        desc: "Hunting for red flags",  color: "#ff3b5c" },
  detective:   { icon: "◎", label: "DETECTIVE AGENT",   desc: "Auditing all evidence",  color: "#00b4ff" },
  orchestrator:{ icon: "⊕", label: "ORCHESTRATOR",      desc: "Final verdict engine",   color: "#ffb800" },
};

const AgentCard = ({ agent, status, message, thinking = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const meta = AGENT_META[agent];
  const isRunning = status === "running";
  const isDone = status === "done";

  return (
    <Card style={{ overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, cursor: isDone ? "pointer" : "default" }}
        onClick={() => isDone && setExpanded(e => !e)}>
        <span style={{ fontSize: 18, color: isDone ? meta.color : isRunning ? meta.color : "#1e2d3d" }}>
          {meta.icon}
        </span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: isDone ? "#c8d4e0" : isRunning ? "#8baabb" : "#2a3d50", letterSpacing: 2 }}>
            {meta.label}
          </div>
          <div style={{ fontSize: 10, color: "#3a5570", marginTop: 2 }}>
            {message || (isRunning ? meta.desc + "..." : meta.desc)}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isRunning && (
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: meta.color,
              animation: "pulse-dot 1s ease infinite", display: "inline-block" }} />
          )}
          {isDone && (
            <span style={{ fontSize: 10, color: meta.color, letterSpacing: 1 }}>
              {expanded ? "▲ COLLAPSE" : "▼ EXPAND"}
            </span>
          )}
          {status === "pending" && (
            <span style={{ fontSize: 10, color: "#1e2d3d", letterSpacing: 1 }}>PENDING</span>
          )}
        </div>
      </div>
      {isRunning && (
        <div style={{ height: 2, background: "#0a1018", overflow: "hidden" }}>
          <div style={{ height: "100%", background: `linear-gradient(90deg, transparent, ${meta.color}, transparent)`,
            animation: "scan-line 1.5s linear infinite", width: "60%" }} />
        </div>
      )}
      {expanded && thinking.length > 0 && (
        <div style={{ padding: "0 16px 16px", maxHeight: 300, overflowY: "auto", borderTop: "1px solid #0e1a26" }}>
          <div style={{ paddingTop: 12 }}>
            {thinking.map((item, i) => <ThinkingItem key={i} item={item} index={i} />)}
          </div>
        </div>
      )}
    </Card>
  );
};

// ─── Track Card ───────────────────────────────────────────────────────────────
const TrackCard = ({ track, trackType, domain, onSendEmail }) => {
  const [emailSending, setEmailSending] = useState(false);
  const [emailResult, setEmailResult] = useState(null);
  const [showEmail, setShowEmail] = useState(false);

  if (!track) return null;
  const { verdict, confidence, regretScore, decidingFactors, targetDecisionMaker, outreachEmail, ifHold, ifAvoid } = track;

  const handleSend = async () => {
    setEmailSending(true);
    try {
      const res = await fetch(`${BASE_URL}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: `https://${domain}`,
          subject: outreachEmail.subject,
          body: outreachEmail.body,
        }),
      });
      const data = await res.json();
      setEmailResult(data);
    } catch (e) {
      setEmailResult({ success: false, error: e.message });
    } finally {
      setEmailSending(false);
    }
  };

  const cfg = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.AVOID;

  return (
    <Card style={{ padding: 20 }} className="fade-in-up">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <SectionLabel>{trackType} TRACK</SectionLabel>
          <VerdictBadge verdict={verdict} size="lg" />
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <ScoreRing score={confidence} label="CONF" color={cfg.color} />
          <ScoreRing score={regretScore?.score || 0} label="REGRET" color="#8850cc" />
        </div>
      </div>

      {regretScore?.reason && (
        <div style={{ fontSize: 11, color: "#5a7a90", marginBottom: 16, fontStyle: "italic", lineHeight: 1.6 }}>
          {regretScore.reason}
        </div>
      )}

      {decidingFactors && (
        <div style={{ marginBottom: 16 }}>
          <SectionLabel>DECIDING FACTORS</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {Object.entries(decidingFactors).map(([k, v]) => {
              if (!v) return null;
              const display = typeof v === "object" ? JSON.stringify(v) : String(v);
              return (
                <div key={k} style={{ display: "flex", gap: 8, fontSize: 11 }}>
                  <span style={{ color: "#3a5570", flexShrink: 0, width: 160, fontSize: 10 }}>
                    {k.replace(/([A-Z])/g, " $1").toUpperCase()}
                  </span>
                  <span style={{ color: "#8baabb" }}>{display}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {targetDecisionMaker && (
        <div style={{ marginBottom: 16, padding: 12, background: "#0a1018", borderRadius: 6 }}>
          <SectionLabel>TARGET DECISION MAKER</SectionLabel>
          <div style={{ fontSize: 13, color: "#c8d4e0", fontWeight: 500, marginBottom: 4 }}>
            {targetDecisionMaker.title}
          </div>
          <div style={{ fontSize: 11, color: "#5a7a90", marginBottom: 6 }}>{targetDecisionMaker.why}</div>
          <div style={{ fontSize: 10, color: "#3a5570" }}>
            🔍 {targetDecisionMaker.linkedinSearchTip}
          </div>
        </div>
      )}

      {(ifHold || ifAvoid) && (
        <div style={{ marginBottom: 16, padding: 10, background: verdict === "HOLD" ? "rgba(255,184,0,0.05)" : "rgba(255,59,92,0.05)",
          border: `1px solid ${verdict === "HOLD" ? "rgba(255,184,0,0.15)" : "rgba(255,59,92,0.15)"}`, borderRadius: 6 }}>
          <div style={{ fontSize: 10, color: verdict === "HOLD" ? "#ffb800" : "#ff3b5c", letterSpacing: 2, marginBottom: 4 }}>
            {verdict === "HOLD" ? "WATCH FOR" : "NEEDS BEFORE PURSUING"}
          </div>
          <div style={{ fontSize: 11, color: "#8baabb" }}>{ifHold || ifAvoid}</div>
        </div>
      )}

      {outreachEmail && (
        <div>
          <button onClick={() => setShowEmail(e => !e)}
            style={{ background: "transparent", border: "1px solid #0e1a26", color: "#3a7090",
              padding: "8px 14px", borderRadius: 4, fontSize: 11, cursor: "pointer",
              fontFamily: "IBM Plex Mono", letterSpacing: 1, marginBottom: showEmail ? 10 : 0, width: "100%" }}>
            {showEmail ? "▲ HIDE OUTREACH EMAIL" : "▼ VIEW OUTREACH EMAIL"}
          </button>
          {showEmail && (
            <div style={{ padding: 12, background: "#0a1018", borderRadius: 6, fontSize: 11 }}>
              <div style={{ color: "#3a5570", marginBottom: 4 }}>SUBJECT:</div>
              <div style={{ color: "#c8d4e0", marginBottom: 10 }}>{outreachEmail.subject}</div>
              <div style={{ color: "#3a5570", marginBottom: 4 }}>BODY:</div>
              <pre style={{ color: "#8baabb", whiteSpace: "pre-wrap", lineHeight: 1.6, fontFamily: "IBM Plex Mono", fontSize: 11 }}>
                {outreachEmail.body}
              </pre>
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <Button onClick={handleSend} loading={emailSending} variant="ghost" style={{ fontSize: 11 }}>
                  SEND EMAIL ↗
                </Button>
                {emailResult && (
                  <span style={{ fontSize: 11, color: emailResult.success ? "#00ff88" : "#ff3b5c" }}>
                    {emailResult.success ? `✓ Sent to ${emailResult.scraped_email}` : `✗ ${emailResult.error}`}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

// ─── Results View ─────────────────────────────────────────────────────────────
const ResultsView = ({ result }) => {
  const { companyName, domain, confirmedScale, recommendedApproach, recommendedApproachReason,
    executiveSummary, customerTrack, partnerTrack, clientAdvantages, clientDisadvantages,
    proposedNextSteps, documents } = result;

  const triggerDownload = (filename) => {
    const a = document.createElement("a");
    a.href = `${BASE_URL}/api/download/${filename}`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1200, margin: "0 auto" }} className="fade-in-up">
      {/* Banner */}
      <Card style={{ padding: "24px 28px", marginBottom: 24, background: "rgba(10,16,24,0.9)",
        borderColor: "#0e2a40", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, #00b4ff, #0044aa, transparent)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: "#3a5570", letterSpacing: 3, marginBottom: 6 }}>ANALYSIS COMPLETE — {domain}</div>
            <div style={{ fontFamily: "Syne, sans-serif", fontSize: 28, fontWeight: 800, color: "#e8f0fa", marginBottom: 4 }}>
              {companyName}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 11, padding: "3px 10px", background: "rgba(0,180,255,0.08)",
                border: "1px solid rgba(0,180,255,0.15)", borderRadius: 4, color: "#00b4ff", letterSpacing: 2 }}>
                {confirmedScale}
              </span>
              <span style={{ fontSize: 11, padding: "3px 10px", background: "rgba(255,184,0,0.08)",
                border: "1px solid rgba(255,184,0,0.15)", borderRadius: 4, color: "#ffb800", letterSpacing: 1 }}>
                {APPROACH_LABELS[recommendedApproach] || recommendedApproach}
              </span>
            </div>
          </div>
        </div>
        {executiveSummary && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #0e1a26",
            fontSize: 13, color: "#8baabb", lineHeight: 1.7, maxWidth: 800 }}>
            {executiveSummary}
          </div>
        )}
        {recommendedApproachReason && (
          <div style={{ marginTop: 10, fontSize: 11, color: "#5a7a90", fontStyle: "italic" }}>
            ↳ {recommendedApproachReason}
          </div>
        )}
      </Card>

      {/* Dual Track */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <TrackCard track={customerTrack} trackType="CUSTOMER" domain={domain} />
        <TrackCard track={partnerTrack} trackType="PARTNER" domain={domain} />
      </div>

      {/* Bottom panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Advantages */}
        <Card style={{ padding: 20 }}>
          <SectionLabel>CLIENT ADVANTAGES</SectionLabel>
          {(clientAdvantages || []).map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 11 }}>
              <span style={{ color: "#00ff88", flexShrink: 0 }}>+</span>
              <span style={{ color: "#8baabb" }}>{typeof a === "object" ? (a.advantage || a.text || JSON.stringify(a)) : String(a ?? "")}</span>
            </div>
          ))}
          {(clientDisadvantages || []).length > 0 && (
            <>
              <div style={{ height: 1, background: "#0e1a26", margin: "12px 0" }} />
              <SectionLabel>OBSTACLES</SectionLabel>
              {(clientDisadvantages || []).map((d, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 11 }}>
                  <span style={{ color: "#ff3b5c", flexShrink: 0 }}>−</span>
                  <span style={{ color: "#8baabb" }}>{typeof d === "object" ? (d.disadvantage || d.text || JSON.stringify(d)) : String(d ?? "")}</span>
                </div>
              ))}
            </>
          )}
        </Card>

        {/* Next Steps */}
        <Card style={{ padding: 20 }}>
          <SectionLabel>PROPOSED NEXT STEPS</SectionLabel>
          {(proposedNextSteps || []).map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, fontSize: 11 }}>
              <span style={{ color: "#3a5570", flexShrink: 0, fontWeight: 600 }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ color: "#8baabb", lineHeight: 1.5 }}>{typeof step === "object" ? (step.step || step.action || step.text || JSON.stringify(step)) : String(step ?? "")}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Documents */}
      {documents && (
        <Card style={{ padding: 20 }}>
          <SectionLabel>GENERATED DOCUMENTS</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[
              { key: "customer_dossier",  label: "Customer Dossier",  file: documents.customer?.dossier,          ext: "DOCX" },
              { key: "customer_exec",     label: "Customer Summary",  file: documents.customer?.executiveSummary,  ext: "PDF" },
              { key: "partner_dossier",   label: "Partner Dossier",   file: documents.partner?.dossier,            ext: "DOCX" },
              { key: "partner_exec",      label: "Partner Summary",   file: documents.partner?.executiveSummary,   ext: "PDF" },
            ].map(({ key, label, file, ext }) => (
              <button key={key} onClick={() => file && triggerDownload(file)}
                disabled={!file}
                style={{
                  background: file ? "rgba(0,100,180,0.07)" : "rgba(20,30,40,0.3)",
                  border: `1px solid ${file ? "rgba(0,100,180,0.25)" : "#0e1a26"}`,
                  borderRadius: 6, padding: "14px 12px", cursor: file ? "pointer" : "not-allowed",
                  textAlign: "center", fontFamily: "IBM Plex Mono",
                }}>
                <div style={{ fontSize: 20, marginBottom: 6, color: file ? "#00b4ff" : "#1e2d3d" }}>
                  {ext === "PDF" ? "📋" : "📄"}
                </div>
                <div style={{ fontSize: 10, color: file ? "#8baabb" : "#1e2d3d", letterSpacing: 1 }}>{label}</div>
                <div style={{ fontSize: 9, color: file ? "#00b4ff" : "#1e2d3d", marginTop: 2, letterSpacing: 2 }}>{ext}</div>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [appState, setAppState] = useState("IDLE"); // IDLE | PROFILING | READY | ANALYZING | RESULTS | ERROR
  const [clientUrl, setClientUrl] = useState("");
  const [clientProfile, setClientProfile] = useState("");
  const [profileError, setProfileError] = useState("");
  const [targetDomain, setTargetDomain] = useState("");
  const [analyzeError, setAnalyzeError] = useState("");
  const [profilePreview, setProfilePreview] = useState(false);

  const [agentStatus, setAgentStatus] = useState({
    bull: "pending", bear: "pending", detective: "pending", orchestrator: "pending",
  });
  const [agentMessages, setAgentMessages] = useState({
    bull: "", bear: "", detective: "", orchestrator: "",
  });
  const [agentThinking, setAgentThinking] = useState({
    bull: [], bear: [], detective: [], orchestrator: [],
  });
  const [companyName, setCompanyName] = useState("");
  const [result, setResult] = useState(null);
  const readerRef = useRef(null);

  // Step 1: Generate profile
  const handleGenerateProfile = async () => {
    if (!clientUrl.trim()) return;
    setAppState("PROFILING");
    setProfileError("");
    try {
      const res = await fetch(`${BASE_URL}/api/generate-client-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: clientUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Profile generation failed");
      setClientProfile(data.clientProfile);
      setAppState("READY");
    } catch (e) {
      setProfileError(e.message);
      setAppState("IDLE");
    }
  };

  // Step 2: Analyze
  const handleAnalyze = async () => {
    if (!targetDomain.trim()) return;
    const domain = targetDomain.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
    setAppState("ANALYZING");
    setAnalyzeError("");
    setResult(null);
    setCompanyName("");
    setAgentStatus({ bull: "pending", bear: "pending", detective: "pending", orchestrator: "pending" });
    setAgentMessages({ bull: "", bear: "", detective: "", orchestrator: "" });
    setAgentThinking({ bull: [], bear: [], detective: [], orchestrator: [] });

    try {
      const res = await fetch(`${BASE_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, client_info: clientProfile }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.detail || "Analysis failed");
      }

      const reader = res.body.getReader();
      readerRef.current = reader;
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop(); // keep incomplete line

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") { reader.cancel(); break; }
          try {
            const event = JSON.parse(raw);
            handleSSEEvent(event);
          } catch (_) {}
        }
      }
    } catch (e) {
      if (e.name !== "AbortError") {
        setAnalyzeError(e.message);
        setAppState("ERROR");
      }
    }
  };

  const handleSSEEvent = useCallback((event) => {
    const { phase } = event;
    if (event.companyName) setCompanyName(event.companyName);

    const agentMap = {
      BULL_START: "bull", BULL_DONE: "bull",
      BEAR_START: "bear", BEAR_DONE: "bear",
      DETECTIVE_START: "detective", DETECTIVE_DONE: "detective",
      ORCHESTRATOR_START: "orchestrator", ORCHESTRATOR_DONE: "orchestrator",
    };

    if (phase.endsWith("_START")) {
      const agent = agentMap[phase];
      setAgentStatus(s => ({ ...s, [agent]: "running" }));
      setAgentMessages(m => ({ ...m, [agent]: event.message || "" }));
    } else if (phase.endsWith("_DONE")) {
      const agent = agentMap[phase];
      setAgentStatus(s => ({ ...s, [agent]: "done" }));
      setAgentMessages(m => ({ ...m, [agent]: event.message || "" }));
      if (event.thinking) setAgentThinking(t => ({ ...t, [agent]: event.thinking }));
    } else if (phase === "COMPLETE") {
      setResult(event.result);
      setAppState("RESULTS");
    } else if (phase === "ERROR") {
      const agent = (event.agent || "").toLowerCase();
      if (agent) setAgentStatus(s => ({ ...s, [agent]: "error" }));
      setAnalyzeError(`${event.agent} AGENT: ${event.message}`);
      setAppState("ERROR");
    }
  }, []);

  const handleRetry = () => {
    setAppState("READY");
    setAnalyzeError("");
  };

  return (
    <>
      <style>{injectStyles()}</style>
      <div className="allyvex-root">
        <Header />

        {/* ── IDLE / PROFILING: Client Setup ── */}
        {(appState === "IDLE" || appState === "PROFILING") && (
          <div style={{ maxWidth: 560, margin: "80px auto", padding: "0 24px" }} className="fade-in-up">
            <Card style={{ padding: 32 }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 22,
                color: "#e8f0fa", marginBottom: 6, letterSpacing: 1 }}>
                INITIALIZE CLIENT
              </div>
              <div style={{ fontSize: 12, color: "#3a5570", marginBottom: 28, lineHeight: 1.6 }}>
                Enter your company URL. ALLYVEX will build an intelligence profile used in all subsequent target analyses.
              </div>
              <SectionLabel>YOUR COMPANY URL</SectionLabel>
              <Input
                value={clientUrl}
                onChange={setClientUrl}
                placeholder="https://yourcompany.ai"
                disabled={appState === "PROFILING"}
              />
              {profileError && (
                <div style={{ fontSize: 11, color: "#ff3b5c", marginTop: 10, padding: "8px 12px",
                  background: "rgba(255,59,92,0.06)", borderRadius: 4, border: "1px solid rgba(255,59,92,0.15)" }}>
                  ✗ {profileError}
                </div>
              )}
              <div style={{ marginTop: 16 }}>
                <Button onClick={handleGenerateProfile} loading={appState === "PROFILING"}
                  disabled={!clientUrl.trim()}>
                  {appState === "PROFILING" ? "GENERATING PROFILE..." : "GENERATE CLIENT PROFILE →"}
                </Button>
              </div>
              {appState === "PROFILING" && (
                <div style={{ marginTop: 20, padding: "12px 16px", background: "#0a1018",
                  borderRadius: 6, fontSize: 11, color: "#3a5570" }}>
                  <span style={{ animation: "blink 1s infinite", display: "inline-block", marginRight: 8 }}>▌</span>
                  Scraping {clientUrl}... building intelligence profile...
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ── READY: Target Input ── */}
        {appState === "READY" && (
          <div style={{ maxWidth: 720, margin: "40px auto", padding: "0 24px" }} className="fade-in-up">
            {/* Profile summary */}
            <Card style={{ padding: 20, marginBottom: 20, borderColor: "rgba(0,180,255,0.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 10, color: "#00b4ff", letterSpacing: 2, marginBottom: 4 }}>✓ CLIENT PROFILE LOADED</div>
                  <div style={{ fontSize: 12, color: "#8baabb" }}>{clientUrl}</div>
                </div>
                <button onClick={() => setProfilePreview(p => !p)}
                  style={{ background: "transparent", border: "1px solid #0e1a26", color: "#3a5570",
                    padding: "6px 12px", borderRadius: 4, fontSize: 10, cursor: "pointer",
                    fontFamily: "IBM Plex Mono", letterSpacing: 1 }}>
                  {profilePreview ? "HIDE" : "PREVIEW"}
                </button>
              </div>
              {profilePreview && (
                <pre style={{ marginTop: 16, padding: 12, background: "#060a0e", borderRadius: 6,
                  fontSize: 10, color: "#5a7a90", whiteSpace: "pre-wrap", lineHeight: 1.6,
                  maxHeight: 200, overflowY: "auto", fontFamily: "IBM Plex Mono" }}>
                  {clientProfile}
                </pre>
              )}
            </Card>

            {/* Target domain form */}
            <Card style={{ padding: 28 }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 18,
                color: "#e8f0fa", marginBottom: 6 }}>
                RUN TARGET ANALYSIS
              </div>
              <div style={{ fontSize: 11, color: "#3a5570", marginBottom: 24 }}>
                Enter the domain of a company to evaluate as a potential customer or partner.
              </div>
              <SectionLabel>TARGET DOMAIN</SectionLabel>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <Input
                    value={targetDomain}
                    onChange={setTargetDomain}
                    placeholder="amazon.com"
                  />
                </div>
                <Button onClick={handleAnalyze} disabled={!targetDomain.trim()}>
                  ANALYZE →
                </Button>
              </div>
              <div style={{ marginTop: 10, fontSize: 10, color: "#1e3048" }}>
                Strip https:// and www. — just the root domain
              </div>
            </Card>
          </div>
        )}

        {/* ── ANALYZING: Pipeline Progress ── */}
        {(appState === "ANALYZING" || appState === "ERROR") && (
          <div style={{ maxWidth: 680, margin: "40px auto", padding: "0 24px" }} className="fade-in-up">
            {companyName && (
              <div style={{ marginBottom: 24, textAlign: "center" }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 24,
                  color: "#e8f0fa", letterSpacing: 1 }}>
                  {companyName}
                </div>
                <div style={{ fontSize: 11, color: "#3a5570", letterSpacing: 2, marginTop: 4 }}>
                  INTELLIGENCE GATHERING IN PROGRESS
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {["bull", "bear", "detective", "orchestrator"].map(agent => (
                <AgentCard key={agent} agent={agent}
                  status={agentStatus[agent]}
                  message={agentMessages[agent]}
                  thinking={agentThinking[agent]}
                />
              ))}
            </div>

            {appState === "ERROR" && analyzeError && (
              <div style={{ marginTop: 20 }}>
                <div style={{ padding: "14px 16px", background: "rgba(255,59,92,0.06)",
                  border: "1px solid rgba(255,59,92,0.2)", borderRadius: 6, fontSize: 12, color: "#ff3b5c", marginBottom: 12 }}>
                  ✗ {analyzeError}
                </div>
                <Button onClick={handleRetry} variant="ghost">← RETRY</Button>
              </div>
            )}
          </div>
        )}

        {/* ── RESULTS ── */}
        {appState === "RESULTS" && result && (
          <>
            <div style={{ display: "flex", gap: 12, padding: "16px 40px", borderBottom: "1px solid #0e1a26",
              alignItems: "center" }}>
              <Button onClick={() => setAppState("READY")} variant="ghost" style={{ fontSize: 11 }}>
                ← NEW ANALYSIS
              </Button>
              <span style={{ fontSize: 10, color: "#1e3048" }}>|</span>
              <span style={{ fontSize: 10, color: "#3a5570", letterSpacing: 1 }}>
                {result.domain} · {result.confirmedScale}
              </span>
            </div>
            <ResultsView result={result} />
          </>
        )}

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "40px 24px", fontSize: 10, color: "#1a2a38", letterSpacing: 2 }}>
          ALLYVEX WAR ROOM — INTELLIGENCE PIPELINE v1.0
        </div>
      </div>
    </>
  );
}
