import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

/* ─── Palette ─────────────────────────────────────────── */
const C = {
    bg:       "#FFFFFF",
    bgOff:    "#F7F7F8",
    bgDark:   "#0A0A0A",
    text:     "#0A0A0A",
    textSec:  "#52525B",
    textMuted:"#A1A1AA",
    border:   "#E4E4E7",
    accent:   "#635BFF",
    accentBg: "#F0EFFF",
};

/* ─── Scroll reveal hook ──────────────────────────────── */
function useScrollReveal() {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Stagger children if they have data-delay
                        const delay = (entry.target as HTMLElement).dataset.delay || "0";
                        setTimeout(() => {
                            entry.target.classList.add("visible");
                        }, Number(delay));
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
        );

        const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
        els.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);
}

/* ─── Currency / Crypto icons ─────────────────────────── */
const CURRENCY_ICONS: Record<string, { symbol: string; color: string; bg: string }> = {
    USD: { symbol: "$",    color: "#1a7f37", bg: "#dcfce7" },
    EUR: { symbol: "€",    color: "#1d4ed8", bg: "#dbeafe" },
    GBP: { symbol: "£",    color: "#7e22ce", bg: "#f3e8ff" },
    NGN: { symbol: "₦",    color: "#c2410c", bg: "#ffedd5" },
    KES: { symbol: "Ksh",  color: "#0f766e", bg: "#ccfbf1" },
    GHS: { symbol: "₵",    color: "#b45309", bg: "#fef3c7" },
    ZAR: { symbol: "R",    color: "#065f46", bg: "#d1fae5" },
    USDC:{ symbol: "◎",    color: "#2775CA", bg: "#e0f0ff" },
    USDT:{ symbol: "₮",    color: "#26A17B", bg: "#dcfcf1" },
    DAI: { symbol: "◈",    color: "#F5AC37", bg: "#fef9c3" },
    ETH: { symbol: "Ξ",    color: "#627EEA", bg: "#eef0fd" },
    SOL: { symbol: "◎",    color: "#9945FF", bg: "#f3e8ff" },
    BTC: { symbol: "₿",    color: "#F7931A", bg: "#fff7ed" },
};

function CurrencyBadge({ code, size = 28 }: { code: string; size?: number }) {
    const icon = CURRENCY_ICONS[code];
    if (!icon) return <span style={{ fontSize: 12, color: C.textMuted }}>{code}</span>;
    return (
        <div style={{
            width: size, height: size, borderRadius: "50%",
            background: icon.bg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: size * 0.4, fontWeight: 800, color: icon.color,
            flexShrink: 0,
        }}>
            {icon.symbol}
        </div>
    );
}

/* ─── Flow Tab data ──────────────────────────────────── */
const FLOWS = [
    {
        id: "cross-currency",
        label: "Cross Currency",
        badge: "Fiat → Fiat",
        title: "Send money across borders. Instantly.",
        desc: "Enter an amount in USD, GBP, or EUR and route it to NGN, KES, GHS, or ZAR. The pipeline validates, runs AML, locks the FX rate, posts to ledger, and settles — all in ~14 seconds.",
        stages: ["Created", "Validated", "Compliance", "FX Locked", "Ledger Posted", "Settling", "Completed"],
        from: { code: "USD", label: "United States Dollar" },
        to: { code: "NGN", label: "Nigerian Naira" },
        amount: "$500.00",
        converted: "₦820,000",
        rate: "1 USD = 1,640 NGN",
        statusLabel: "FX Locked",
        statusColor: "#D97706",
        statusBg: "#FFFBEB",
        accentColor: "#635BFF",
    },
    {
        id: "cross-chain",
        label: "Crypto Cross Chain",
        badge: "Crypto → Crypto",
        title: "Bridge tokens across blockchains.",
        desc: "Move USDC, USDT, or DAI across chains. The pipeline estimates gas, calls the bridge smart contract, and waits for the destination network relay to confirm arrival.",
        stages: ["Created", "Validated", "Compliance", "Gas Est.", "Contract", "Bridging", "Completed"],
        from: { code: "USDC", label: "USD Coin · Ethereum" },
        to: { code: "USDT", label: "Tether · Solana" },
        amount: "500 USDC",
        converted: "498.25 USDT",
        rate: "Fee: 0.5% gas + relay",
        statusLabel: "Bridging",
        statusColor: "#635BFF",
        statusBg: "#F0EFFF",
        accentColor: "#635BFF",
    },
    {
        id: "crypto-to-fiat",
        label: "Crypto → Fiat",
        badge: "Crypto → Fiat",
        title: "Convert crypto to local currency.",
        desc: "Receive crypto, run compliance, swap through a liquidity provider, then dispatch fiat over local rails (ACH, SEPA, RTGS). The full offramp pipeline — simulated.",
        stages: ["Created", "Validated", "Compliance", "Crypto In", "Swap", "Fiat Out", "Completed"],
        from: { code: "USDC", label: "USD Coin" },
        to: { code: "NGN", label: "Nigerian Naira" },
        amount: "500 USDC",
        converted: "₦810,000",
        rate: "1 USDC ≈ 1,620 NGN",
        statusLabel: "Liquidity Swap",
        statusColor: "#7C3AED",
        statusBg: "#F5F3FF",
        accentColor: "#7C3AED",
    },
];

/* ─── Reusable Pipeline Mockup Card ─────────────────── */
function FlowCard({ flow }: { flow: typeof FLOWS[0] }) {
    const activeIndex = Math.floor(flow.stages.length * 0.7);
    return (
        <div style={{
            background: "#fff",
            border: "1px solid #E4E4E7",
            borderRadius: 16,
            padding: 24,
            boxShadow: "0 12px 40px rgba(0,0,0,0.07)",
            fontFamily: "'Inter', sans-serif",
            flex: 1,
            minWidth: 260,
        }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: flow.accentColor, animation: "dotPulse 1.5s ease-in-out infinite" }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#52525B" }}>Live · {flow.statusLabel}</span>
                </div>
                <span style={{
                    fontSize: 10, fontWeight: 700,
                    background: flow.statusBg, color: flow.statusColor,
                    borderRadius: 100, padding: "2px 8px",
                }}>
                    {flow.badge}
                </span>
            </div>

            {/* Amount row */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #F4F4F5" }}>
                <CurrencyBadge code={flow.from.code} size={36} />
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 11, color: "#A1A1AA", marginBottom: 2 }}>{flow.from.label}</p>
                    <p style={{ fontSize: 20, fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.03em" }}>{flow.amount}</p>
                </div>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" stroke="#A1A1AA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <div style={{ flex: 1, textAlign: "right" }}>
                    <p style={{ fontSize: 11, color: "#A1A1AA", marginBottom: 2 }}>{flow.to.label}</p>
                    <p style={{ fontSize: 20, fontWeight: 800, color: flow.accentColor, letterSpacing: "-0.03em" }}>{flow.converted}</p>
                </div>
                <CurrencyBadge code={flow.to.code} size={36} />
            </div>

            {/* Rate */}
            <p style={{ fontSize: 11, color: flow.accentColor, fontWeight: 600, marginBottom: 14 }}>{flow.rate}</p>

            {/* Progress dots */}
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {flow.stages.map((s, i) => (
                    <div key={s} style={{ display: "flex", alignItems: "center", flex: i < flow.stages.length - 1 ? 1 : "none" }}>
                        <div style={{
                            width: i === activeIndex ? 22 : 10,
                            height: 10, borderRadius: 5,
                            background: i < activeIndex ? "#10B981" : i === activeIndex ? flow.accentColor : "#E4E4E7",
                            flexShrink: 0,
                            transition: "all 0.3s",
                        }} />
                        {i < flow.stages.length - 1 && (
                            <div style={{ flex: 1, height: 2, background: i < activeIndex ? "#10B981" : "#E4E4E7", margin: "0 2px" }} />
                        )}
                    </div>
                ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontSize: 9, color: "#A1A1AA" }}>{flow.stages[0]}</span>
                <span style={{ fontSize: 9, color: "#A1A1AA" }}>{flow.stages[flow.stages.length - 1]}</span>
            </div>
        </div>
    );
}

/* ─── Hero Product Mockup ────────────────────────────── */
function ProductMockup() {
    const progressStages = ["Created", "Validated", "Compliance", "FX", "Ledger", "Settling", "Done"];
    const activeIndex = 5;

    return (
        <div style={{
            background: "#fff",
            border: "1px solid #E4E4E7",
            borderRadius: 16,
            padding: "24px",
            boxShadow: "0 24px 64px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.03)",
            width: "100%",
            maxWidth: 380,
            fontFamily: "'Inter', sans-serif",
        }}>
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#635BFF", animation: "dotPulse 1.5s ease-in-out infinite" }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#52525B" }}>Live · Settling</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, background: "#F0EFFF", color: "#635BFF", borderRadius: 100, padding: "3px 10px", letterSpacing: "0.02em" }}>
                    Stage 6 / 7
                </span>
            </div>

            {/* Amount */}
            <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid #F4F4F5" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <CurrencyBadge code="USD" size={38} />
                    <div>
                        <p style={{ fontSize: 10, color: "#A1A1AA", marginBottom: 2 }}>Sending</p>
                        <p style={{ fontSize: 26, fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.04em", lineHeight: 1 }}>$500 <span style={{ fontSize: 14, fontWeight: 500, color: "#A1A1AA" }}>USD</span></p>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "#F0EFFF", borderRadius: 8 }}>
                    <CurrencyBadge code="NGN" size={20} />
                    <p style={{ fontSize: 13, color: "#635BFF", fontWeight: 700 }}>→ ₦820,000 NGN <span style={{ fontWeight: 400, opacity: 0.7 }}>· Rate 1,640</span></p>
                </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
                    {progressStages.map((_, i) => (
                        <div key={i} style={{
                            flex: 1, height: 3, borderRadius: 2,
                            background: i <= activeIndex ? "#635BFF" : "#E4E4E7",
                            transition: "background 0.3s",
                        }} />
                    ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 10, color: "#A1A1AA" }}>Created</span>
                    <span style={{ fontSize: 10, color: "#A1A1AA" }}>Complete</span>
                </div>
            </div>

            {/* Recipient row */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px", background: "#F7F7F8", borderRadius: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#635BFF", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>E</div>
                <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", marginBottom: 1 }}>Emeka Okonkwo</p>
                    <p style={{ fontSize: 11, color: "#A1A1AA" }}>Lagos · Zenith Bank · NGN</p>
                </div>
                <CheckCircle2 size={16} color="#10B981" style={{ marginLeft: "auto", flexShrink: 0 }} />
            </div>

            {/* Latest event */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "#F0EFFF", borderRadius: 8, fontSize: 12, color: "#635BFF", fontWeight: 500 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#635BFF", flexShrink: 0, animation: "dotPulse 1.5s ease-in-out infinite" }} />
                Settlement started · rails processing…
            </div>
        </div>
    );
}

/* ─── Currency Corridor Strip ────────────────────────── */
const CORRIDORS = [
    { from: "USD", to: "NGN", rate: "1,640" },
    { from: "EUR", to: "KES", rate: "148" },
    { from: "GBP", to: "GHS", rate: "16.2" },
    { from: "USDC", to: "NGN", rate: "1,620" },
    { from: "USDT", to: "ZAR", rate: "19.1" },
    { from: "USDC", to: "USDT", rate: "0.995" },
];

/* ─── Stages data ────────────────────────────────────── */
const STAGE_GROUPS = [
    {
        group: "Shared (all flows)",
        stages: [
            { num: "01", label: "Created",    desc: "A unique payment ID is registered with type, amount, currency pair, and recipient." },
            { num: "02", label: "Validated",  desc: "Request checked for completeness and business rules before entering the pipeline." },
            { num: "03", label: "Compliance", desc: "AML/KYC screening runs on sender and recipient. Failed payments are halted and flagged." },
        ],
    },
    {
        group: "Cross Currency (Fiat)",
        stages: [
            { num: "04", label: "FX Locked",       desc: "The live exchange rate is quoted and locked. The destination amount is calculated here." },
            { num: "05", label: "Ledger Posted",    desc: "Debit and credit entries are written — creating an immutable double-entry audit trail." },
            { num: "06", label: "Settling",         desc: "Funds move through the settlement network to the recipient's institution." },
        ],
    },
    {
        group: "Crypto Cross Chain",
        stages: [
            { num: "04", label: "Gas Estimated",        desc: "On-chain gas cost is computed for the bridge transaction." },
            { num: "05", label: "Smart Contract Call",  desc: "The cross-chain bridge contract is called on the source network." },
            { num: "06", label: "Network Bridging",     desc: "The relay waits for the destination network to confirm arrival." },
        ],
    },
    {
        group: "Crypto → Fiat",
        stages: [
            { num: "04", label: "Crypto Received",       desc: "Inbound crypto tokens are received and held pending compliance clearance." },
            { num: "05", label: "Liquidity Conversion",  desc: "Tokens are swapped for fiat via a liquidity provider at market rate." },
            { num: "06", label: "Fiat Settling",         desc: "Converted fiat is dispatched over local rails (ACH, SEPA, RTGS)." },
        ],
    },
];

const HOW_IT_WORKS = [
    {
        step: "1",
        title: "Pick a flow",
        desc: "Choose between Cross Currency (fiat), Crypto Cross Chain, or Crypto-to-Fiat. Each tab configures a different pipeline and currency set.",
    },
    {
        step: "2",
        title: "Watch the pipeline advance",
        desc: "The state machine walks your payment through each stage every 2 seconds — validation, AML, FX locking, bridging, or liquidity swap.",
    },
    {
        step: "3",
        title: "Read the event log",
        desc: "Every state transition is captured with a timestamp, message, and context. Nothing is hidden. The full audit trail updates live.",
    },
];

const FEATURES = [
    {
        title: "Strict state machine",
        desc: "No payment can skip a stage or move backwards. Every valid transition is pre-defined — exactly how production systems work.",
        tag: "Architecture",
        icon: "🔒",
    },
    {
        title: "Real-time event sourcing",
        desc: "Every state change emits an event. The frontend polls and renders the log as it grows, giving you a live view of the pipeline.",
        tag: "Real-time",
        icon: "⚡",
    },
    {
        title: "Multi-flow simulation",
        desc: "Three distinct pipelines: Fiat cross-border, Crypto bridging, and Crypto-to-Fiat offramp — each with its own stages and logic.",
        tag: "Multi-flow",
        icon: "🔀",
    },
    {
        title: "Compliance engine",
        desc: "AML/KYC checks run before any processing. A failed check transitions the payment to COMPLIANCE_FAILED and halts the pipeline.",
        tag: "Compliance",
        icon: "🛡",
    },
];

/* ─── Page ───────────────────────────────────────────── */
export default function LandingPage() {
    const navigate = useNavigate();
    useScrollReveal();

    const primaryBtn: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        background: C.accent,
        border: "none",
        borderRadius: 8,
        color: "white",
        padding: "0.8125rem 1.5rem",
        fontSize: "0.9375rem",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        cursor: "pointer",
        transition: "background 0.15s, transform 0.1s",
    };

    const ghostBtn: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        background: "none",
        border: "1px solid #D1D5DB",
        borderRadius: 8,
        color: "#374151",
        padding: "0.8125rem 1.5rem",
        fontSize: "0.9375rem",
        fontFamily: "'Inter', sans-serif",
        fontWeight: 500,
        cursor: "pointer",
        transition: "border-color 0.15s, color 0.15s",
    };

    return (
        <div style={{ background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>

            {/* ══ 1. HERO ═══════════════════════════════════════════ */}
            <section style={{ paddingTop: "62px", minHeight: "92vh", display: "flex", alignItems: "center", borderBottom: `1px solid ${C.border}` }}>
                <div style={{
                    maxWidth: 1200, margin: "0 auto",
                    padding: "4rem 2rem",
                    display: "grid", gridTemplateColumns: "1fr 1fr",
                    gap: "4rem", alignItems: "center", width: "100%",
                }}>
                    {/* Left */}
                    <div className="reveal-left">
                        <p style={{ fontSize: "0.875rem", fontWeight: 600, color: C.accent, marginBottom: "1.25rem", letterSpacing: "0.01em" }}>
                            Payment infrastructure simulator
                        </p>
                        <h1 style={{ fontSize: "clamp(2.75rem, 5vw, 4.25rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.08, color: C.text, marginBottom: "1.5rem" }}>
                            The payment pipeline.{" "}
                            <span style={{ color: C.accent }}>In real-time.</span>
                        </h1>
                        <p style={{ fontSize: "1.125rem", color: C.textSec, lineHeight: 1.65, marginBottom: "2.25rem", maxWidth: 460 }}>
                            Simulate fiat cross-border transfers, crypto cross-chain bridges, and crypto-to-fiat offramps — step by step, in real-time.
                        </p>
                        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                            <button
                                id="hero-launch-btn"
                                onClick={() => navigate("/simulator")}
                                style={primaryBtn}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "#5148E8"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
                            >
                                Launch simulator <ArrowRight size={15} />
                            </button>
                            <button
                                id="hero-learn-btn"
                                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                                style={ghostBtn}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#9CA3AF"; e.currentTarget.style.color = C.text; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#D1D5DB"; e.currentTarget.style.color = "#374151"; }}
                            >
                                How it works
                            </button>
                        </div>
                        <p style={{ fontSize: "0.8125rem", color: C.textMuted, marginTop: "1.5rem" }}>
                            Open-source · Not a real payment system · Built for engineers
                        </p>
                    </div>

                    {/* Right: Product mockup */}
                    <div className="reveal-right" style={{ display: "flex", justifyContent: "center" }}>
                        <ProductMockup />
                    </div>
                </div>
            </section>

            {/* ══ 2. TECH STRIP ════════════════════════════════════ */}
            <section style={{ background: C.bgOff, borderBottom: `1px solid ${C.border}`, padding: "1.125rem 2rem" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "0 2.5rem" }}>
                    <span style={{ fontSize: "0.75rem", color: C.textMuted, fontWeight: 500 }}>Built with</span>
                    {["TypeScript", "React 19", "Express 5", "Vite 8", "State Machine", "Real-time Events"].map((t) => (
                        <span key={t} style={{ fontSize: "0.8125rem", color: C.textSec, fontWeight: 500 }}>{t}</span>
                    ))}
                </div>
            </section>

            {/* ══ 3. CORRIDOR STRIP ════════════════════════════════ */}
            <section style={{ padding: "2rem", borderBottom: `1px solid ${C.border}`, overflow: "hidden" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center", marginBottom: "1.25rem" }}>
                        Simulated corridors
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0.75rem" }}>
                        {CORRIDORS.map((c) => (
                            <div key={`${c.from}-${c.to}`} style={{
                                display: "flex", alignItems: "center", gap: 8,
                                background: "#F7F7F8", border: "1px solid #E4E4E7",
                                borderRadius: 10, padding: "8px 14px",
                            }}>
                                <CurrencyBadge code={c.from} size={22} />
                                <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: C.textSec }}>{c.from}</span>
                                <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" stroke="#A1A1AA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                <CurrencyBadge code={c.to} size={22} />
                                <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: C.textSec }}>{c.to}</span>
                                <span style={{ fontSize: "0.75rem", color: C.textMuted, marginLeft: 2 }}>~{c.rate}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ 4. THREE FLOWS ══════════════════════════════════ */}
            <section id="flows-section" style={{ padding: "7rem 2rem", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div className="reveal" style={{ marginBottom: "3.5rem", textAlign: "center" }}>
                        <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: C.accent, marginBottom: "0.75rem" }}>
                            Three payment flows
                        </p>
                        <h2 style={{ fontSize: "clamp(1.875rem, 3.5vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, maxWidth: 580, margin: "0 auto" }}>
                            Every type of modern money movement. Simulated.
                        </h2>
                    </div>

                    {/* Flow cards */}
                    <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
                        {FLOWS.map((flow, i) => (
                            <div
                                key={flow.id}
                                className="reveal"
                                data-delay={String(i * 100)}
                                style={{ flex: "1 1 280px" }}
                            >
                                <div style={{ marginBottom: "1rem" }}>
                                    <span style={{
                                        display: "inline-flex", alignItems: "center", gap: 6,
                                        background: flow.statusBg, color: flow.statusColor,
                                        border: `1px solid ${flow.statusColor}22`,
                                        borderRadius: 100, padding: "3px 10px",
                                        fontSize: "0.6875rem", fontWeight: 700, marginBottom: "0.75rem",
                                    }}>
                                        {flow.badge}
                                    </span>
                                    <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: C.text, marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>
                                        {flow.title}
                                    </h3>
                                    <p style={{ fontSize: "0.875rem", color: C.textSec, lineHeight: 1.65, marginBottom: "1.25rem" }}>
                                        {flow.desc}
                                    </p>
                                </div>
                                <FlowCard flow={flow} />
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="reveal" style={{ textAlign: "center", marginTop: "3rem" }}>
                        <button
                            onClick={() => navigate("/simulator")}
                            style={primaryBtn}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "#5148E8"; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
                        >
                            Try all three flows <ArrowRight size={15} />
                        </button>
                    </div>
                </div>
            </section>

            {/* ══ 5. HOW IT WORKS ═════════════════════════════════ */}
            <section id="how-it-works" style={{ background: C.bgOff, padding: "7rem 2rem", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div className="reveal" style={{ marginBottom: "4rem" }}>
                        <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: C.accent, marginBottom: "0.75rem" }}>How it works</p>
                        <h2 style={{ fontSize: "clamp(1.875rem, 3.5vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, maxWidth: 480 }}>
                            Three steps. Three pipelines.
                        </h2>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "3rem" }}>
                        {HOW_IT_WORKS.map((item, i) => (
                            <div key={item.step} className="reveal" data-delay={String(i * 120)}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: "50%",
                                    background: C.accentBg,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "0.9375rem", fontWeight: 800, color: C.accent,
                                    marginBottom: "1.25rem",
                                }}>
                                    {item.step}
                                </div>
                                <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, color: C.text, marginBottom: "0.625rem", letterSpacing: "-0.01em" }}>
                                    {item.title}
                                </h3>
                                <p style={{ fontSize: "0.9375rem", color: C.textSec, lineHeight: 1.65 }}>
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ 6. PIPELINE STAGES ══════════════════════════════ */}
            <section id="pipeline-section" style={{ padding: "7rem 2rem", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "5rem", alignItems: "start" }}>
                        {/* Left: sticky text */}
                        <div className="reveal-left" style={{ position: "sticky", top: "80px" }}>
                            <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: C.accent, marginBottom: "0.75rem" }}>
                                The pipelines
                            </p>
                            <h2 style={{ fontSize: "clamp(1.875rem, 3vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: "1rem" }}>
                                Every stage, explained.
                            </h2>
                            <p style={{ fontSize: "0.9375rem", color: C.textSec, lineHeight: 1.65, marginBottom: "2rem" }}>
                                Each payment type has its own set of pipeline stages. Stages 1–3 are shared across all flows. Stages 4–6 differ by type.
                            </p>
                            <button
                                onClick={() => navigate("/simulator")}
                                style={primaryBtn}
                                onMouseEnter={(e) => { e.currentTarget.style.background = "#5148E8"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = C.accent; }}
                            >
                                Try it live <ArrowRight size={15} />
                            </button>
                        </div>

                        {/* Right: grouped stage list */}
                        <div className="reveal-right" style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                            {STAGE_GROUPS.map((group) => (
                                <div key={group.group}>
                                    <p style={{
                                        fontSize: "0.6875rem", fontWeight: 700, color: C.textMuted,
                                        textTransform: "uppercase", letterSpacing: "0.07em",
                                        marginBottom: "1rem",
                                    }}>
                                        {group.group}
                                    </p>
                                    <div style={{ display: "flex", flexDirection: "column", border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                                        {group.stages.map((stage, index) => (
                                            <div
                                                key={stage.label}
                                                style={{
                                                    display: "flex", gap: "1.25rem",
                                                    padding: "1rem 1.25rem",
                                                    borderBottom: index < group.stages.length - 1 ? `1px solid ${C.border}` : "none",
                                                    background: "#fff",
                                                    transition: "background 0.15s",
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.background = C.bgOff}
                                                onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
                                            >
                                                <span style={{ fontSize: "0.6875rem", fontWeight: 700, color: C.textMuted, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, paddingTop: "0.2rem", minWidth: 24 }}>
                                                    {stage.num}
                                                </span>
                                                <div>
                                                    <h3 style={{ fontSize: "0.9375rem", fontWeight: 700, color: C.text, marginBottom: "0.25rem" }}>
                                                        {stage.label}
                                                    </h3>
                                                    <p style={{ fontSize: "0.875rem", color: C.textSec, lineHeight: 1.6 }}>
                                                        {stage.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ 7. FEATURES ═════════════════════════════════════ */}
            <section id="features-section" style={{ background: C.bgOff, padding: "7rem 2rem", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div className="reveal" style={{ marginBottom: "4rem" }}>
                        <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: C.accent, marginBottom: "0.75rem" }}>Under the hood</p>
                        <h2 style={{ fontSize: "clamp(1.875rem, 3.5vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, maxWidth: 520 }}>
                            What makes this more than a demo.
                        </h2>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                        {FEATURES.map((f, i) => (
                            <div
                                key={f.title}
                                className="reveal"
                                data-delay={String((i % 2) * 100)}
                                style={{
                                    padding: "2.5rem",
                                    borderRight: i % 2 === 0 ? `1px solid ${C.border}` : "none",
                                    borderBottom: i < 2 ? `1px solid ${C.border}` : "none",
                                    transition: "background 0.15s",
                                    background: "#fff",
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "#F9F9FB"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
                                    <span style={{ fontSize: "1.375rem" }}>{f.icon}</span>
                                    <span style={{
                                        fontSize: "0.6875rem", fontWeight: 700, color: C.accent,
                                        background: C.accentBg, borderRadius: 100,
                                        padding: "0.2rem 0.625rem", letterSpacing: "0.02em",
                                    }}>
                                        {f.tag}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: C.text, marginBottom: "0.625rem", letterSpacing: "-0.01em" }}>
                                    {f.title}
                                </h3>
                                <p style={{ fontSize: "0.9375rem", color: C.textSec, lineHeight: 1.65 }}>
                                    {f.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ 8. STATS BAR ════════════════════════════════════ */}
            <section style={{ background: C.bg, padding: "3.5rem 2rem", borderBottom: `1px solid ${C.border}` }}>
                <div className="reveal" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" }}>
                    {[
                        { value: "3",    label: "Payment flow types" },
                        { value: "~14s", label: "Full simulation" },
                        { value: "6+",   label: "Simulated corridors" },
                        { value: "100%", label: "Real-time events" },
                    ].map((stat) => (
                        <div key={stat.label} style={{ textAlign: "center" }}>
                            <p style={{ fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.04em", color: C.text, lineHeight: 1 }}>
                                {stat.value}
                            </p>
                            <p style={{ fontSize: "0.875rem", color: C.textMuted, marginTop: "0.5rem", fontWeight: 500 }}>
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══ 9. DARK CTA ══════════════════════════════════════ */}
            <section style={{ background: C.bgDark, padding: "8rem 2rem" }}>
                <div className="reveal" style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
                    <h2 style={{
                        fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
                        fontWeight: 800, letterSpacing: "-0.04em",
                        color: "#fff", lineHeight: 1.08, marginBottom: "1.25rem",
                    }}>
                        Ready to trace your first payment?
                    </h2>
                    <p style={{ fontSize: "1.125rem", color: "#A1A1AA", lineHeight: 1.6, marginBottom: "2.5rem" }}>
                        Pick a flow, create a transfer, and watch it move through every layer of the pipeline in real-time.
                    </p>
                    <button
                        id="bottom-launch-btn"
                        onClick={() => navigate("/simulator")}
                        style={{ ...primaryBtn, padding: "0.9375rem 2rem", fontSize: "1rem" }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "#5148E8"}
                        onMouseLeave={(e) => e.currentTarget.style.background = C.accent}
                    >
                        Launch simulator <ArrowRight size={16} />
                    </button>
                </div>
            </section>

            {/* ══ 10. FOOTER ══════════════════════════════════════ */}
            <footer style={{ background: C.bgDark, borderTop: "1px solid #1A1A1A", padding: "2rem" }}>
                <div style={{
                    maxWidth: 1100, margin: "0 auto",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    flexWrap: "wrap", gap: "1rem",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 22, height: 22, borderRadius: 5, background: "#635BFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
                                <path d="M2 7h4M8 7h4M7 2v4M7 8v4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fff" }}>PayPipeline</span>
                    </div>
                    <p style={{ fontSize: "0.8125rem", color: "#52525B" }}>
                        Not a real payment system · Built for learning · Open-source
                    </p>
                    <p style={{ fontSize: "0.8125rem", color: "#52525B" }}>© 2026</p>
                </div>
            </footer>
        </div>
    );
}
