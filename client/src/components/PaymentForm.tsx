import { useEffect, useState } from "react";
import { createPayment } from "../api/payment.api";
import { ArrowRight, Loader2, Copy, CheckCheck } from "lucide-react";
import { PaymentType } from "../types/payment";

interface Props {
    onCreated(id: string): void;
    activeType: PaymentType;
    onTypeChange(type: PaymentType): void;
}

const FIAT_SRC = [
    { code: "USD", flag: "🇺🇸", rate: "1" },
    { code: "GBP", flag: "🇬🇧", rate: "1" },
    { code: "EUR", flag: "🇪🇺", rate: "1" },
];

const FIAT_DST = [
    { code: "NGN", flag: "🇳🇬", name: "Nigerian Naira",     rate: "1,640" },
    { code: "KES", flag: "🇰🇪", name: "Kenyan Shilling",    rate: "132"   },
    { code: "GHS", flag: "🇬🇭", name: "Ghanaian Cedi",      rate: "12.5"  },
    { code: "ZAR", flag: "🇿🇦", name: "South African Rand", rate: "19.2"  },
];

const CRYPTO = [
    { code: "USDC", flag: "🪙", name: "USD Coin", rate: "1" },
    { code: "USDT", flag: "🪙", name: "Tether",   rate: "1" },
    { code: "DAI",  flag: "🪙", name: "Dai",      rate: "1" },
];

const field: React.CSSProperties = {
    width: "100%",
    background: "#fff",
    border: "1px solid #E4E4E7",
    borderRadius: 8,
    color: "#0A0A0A",
    fontSize: "0.9375rem",
    fontFamily: "'Inter', sans-serif",
    padding: "0.6875rem 0.875rem",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    boxSizing: "border-box",
};

const label: React.CSSProperties = {
    display: "block",
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "0.4rem",
};

export default function PaymentForm({ onCreated, activeType, onTypeChange }: Props) {
    const [amount,   setAmount]   = useState(500);
    const [recipient, setRecipient] = useState("");
    const [src,  setSrc]  = useState("USD");
    const [dest, setDest] = useState("NGN");
    const [loading, setLoading] = useState(false);
    const [createdId, setCreatedId] = useState<string | null>(null);
    const [copied, setCopied]   = useState(false);
    const [focused, setFocused] = useState<string | null>(null);

    // Sync default currencies when tab changes
    useEffect(() => {
        if (activeType === PaymentType.CROSS_CURRENCY) {
            setSrc("USD"); setDest("NGN");
        } else if (activeType === PaymentType.CRYPTO_CROSS_CHAIN) {
            setSrc("USDC"); setDest("USDT");
        } else if (activeType === PaymentType.CRYPTO_TO_FIAT) {
            setSrc("USDC"); setDest("NGN");
        }
    }, [activeType]);

    const focusStyle = (id: string): React.CSSProperties =>
        focused === id ? { borderColor: "#635BFF", boxShadow: "0 0 0 3px rgba(99,91,255,0.12)" } : {};

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const p = await createPayment({
                type: activeType,
                amount,
                recipient,
                sourceCurrency: src,
                destinationCurrency: dest
            });
            setCreatedId(p.id);
            onCreated(p.id);
        } finally {
            setLoading(false);
        }
    }

    function copy() {
        if (!createdId) return;
        navigator.clipboard.writeText(createdId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function reset() {
        setCreatedId(null);
        setRecipient("");
        setAmount(500);
    }

    const srcOptions = activeType === PaymentType.CROSS_CURRENCY ? FIAT_SRC : CRYPTO;
    const destOptions = activeType === PaymentType.CRYPTO_CROSS_CHAIN ? CRYPTO : FIAT_DST;

    const destInfo = destOptions.find(d => d.code === dest) || destOptions[0];
    const srcInfo  = srcOptions.find(c => c.code === src) || srcOptions[0];

    /* ── Success state ── */
    if (createdId) {
        return (
            <div style={{
                background: "#fff", border: "1px solid #E4E4E7",
                borderRadius: 12, padding: "1.25rem",
                fontFamily: "'Inter', sans-serif",
            }}>
                <div style={{
                    display: "flex", alignItems: "center", gap: "0.75rem",
                    padding: "1rem", background: "#F0FDF4",
                    border: "1px solid #BBF7D0", borderRadius: 8, marginBottom: "1rem",
                }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: "50%",
                        background: "#10B981", display: "flex",
                        alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8l3.5 3.5L13 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div>
                        <p style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#064E3B" }}>Payment created</p>
                        <p style={{ fontSize: "0.8125rem", color: "#065F46", marginTop: 2 }}>Pipeline is now tracking →</p>
                    </div>
                </div>

                <div style={{
                    background: "#F7F7F8", border: "1px solid #E4E4E7",
                    borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "0.875rem",
                }}>
                    <p style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#A1A1AA", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
                        Payment ID
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.75rem", color: "#0A0A0A", wordBreak: "break-all" }}>
                            {createdId}
                        </p>
                        <button onClick={copy} style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "#10B981" : "#A1A1AA", flexShrink: 0 }}>
                            {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
                        </button>
                    </div>
                </div>

                <button onClick={reset} style={{
                    width: "100%", background: "none",
                    border: "1px solid #E4E4E7", borderRadius: 8,
                    color: "#52525B", padding: "0.625rem",
                    fontSize: "0.875rem", fontFamily: "'Inter', sans-serif",
                    fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
                }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#9CA3AF"; e.currentTarget.style.color = "#0A0A0A"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#E4E4E7"; e.currentTarget.style.color = "#52525B"; }}
                >
                    + New payment
                </button>
            </div>
        );
    }

    /* ── Form ── */
    return (
        <form onSubmit={submit} style={{
            background: "#fff", border: "1px solid #E4E4E7",
            borderRadius: 12, padding: "1.25rem",
            display: "flex", flexDirection: "column", gap: "1rem",
            fontFamily: "'Inter', sans-serif",
        }}>
            <div>
                <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "#0A0A0A", letterSpacing: "-0.01em" }}>
                    New transfer
                </h2>
                <p style={{ fontSize: "0.8125rem", color: "#A1A1AA", marginTop: 2 }}>
                    Select flow and configure payload
                </p>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 8, padding: 4 }}>
                {[
                    { type: PaymentType.CROSS_CURRENCY, label: "Cross Curr." },
                    { type: PaymentType.CRYPTO_CROSS_CHAIN, label: "Cross Chain" },
                    { type: PaymentType.CRYPTO_TO_FIAT, label: "Crypto→Fiat" }
                ].map(tab => (
                    <button
                        key={tab.type}
                        type="button"
                        onClick={() => onTypeChange(tab.type)}
                        style={{
                            flex: 1,
                            background: activeType === tab.type ? "#fff" : "transparent",
                            color: activeType === tab.type ? "#0A0A0A" : "#6B7280",
                            border: "none",
                            borderRadius: 6,
                            padding: "0.375rem",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            boxShadow: activeType === tab.type ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
                            transition: "all 0.2s"
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Amount + source currency */}
            <div>
                <label style={label}>You send</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                        id="payment-amount"
                        type="number" min={1}
                        value={amount}
                        onChange={e => setAmount(Number(e.target.value))}
                        onFocus={() => setFocused("amount")}
                        onBlur={() => setFocused(null)}
                        style={{ ...field, flex: 1, ...focusStyle("amount") }}
                        required
                    />
                    <select
                        id="source-currency"
                        value={src} onChange={e => setSrc(e.target.value)}
                        style={{ ...field, width: "auto", flex: "none", paddingLeft: "0.5rem", paddingRight: "0.5rem", cursor: "pointer" }}
                    >
                        {srcOptions.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                    </select>
                </div>
            </div>

            {/* Divider with arrow */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ flex: 1, height: 1, background: "#F3F4F6" }} />
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#F7F7F8", border: "1px solid #E4E4E7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ArrowRight size={11} color="#A1A1AA" />
                </div>
                <div style={{ flex: 1, height: 1, background: "#F3F4F6" }} />
            </div>

            {/* Destination */}
            <div>
                <label style={label}>Recipient gets</label>
                <select
                    id="dest-currency"
                    value={dest} onChange={e => setDest(e.target.value)}
                    style={{ ...field, cursor: "pointer" }}
                >
                    {destOptions.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code} {c.name ? `— ${c.name}` : ""}</option>)}
                </select>
                {/* Rate hint */}
                <p style={{ fontSize: "0.75rem", color: "#635BFF", marginTop: "0.375rem", fontWeight: 500 }}>
                    1 {srcInfo.code} ≈ {destInfo.rate} {destInfo.code}
                </p>
            </div>

            {/* Recipient */}
            <div>
                <label style={label}>Recipient ID / Address</label>
                <input
                    id="recipient-name"
                    type="text"
                    placeholder="e.g. 0xabc... / Emeka"
                    value={recipient}
                    onChange={e => setRecipient(e.target.value)}
                    onFocus={() => setFocused("recipient")}
                    onBlur={() => setFocused(null)}
                    style={{ ...field, ...focusStyle("recipient") }}
                    required
                />
            </div>

            {/* Fee row */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", padding: "0.5rem 0", borderTop: "1px solid #F3F4F6" }}>
                <span style={{ color: "#A1A1AA" }}>Network/Transfer fee</span>
                <span style={{ color: "#059669", fontWeight: 600 }}>Calculated on-the-fly</span>
            </div>

            {/* Submit */}
            <button
                id="submit-payment-btn"
                type="submit"
                disabled={loading}
                style={{
                    width: "100%",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                    background: loading ? "#9CA3AF" : "#635BFF",
                    border: "none", borderRadius: 8,
                    color: "white", padding: "0.8125rem",
                    fontSize: "0.9375rem", fontFamily: "'Inter', sans-serif",
                    fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                    transition: "background 0.15s",
                    opacity: loading ? 0.75 : 1,
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#5148E8"; }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#635BFF"; }}
            >
                {loading
                    ? <><Loader2 size={15} style={{ animation: "spin 0.8s linear infinite" }} /> Initiating…</>
                    : <>Execute {amount.toLocaleString()} {src} →</>
                }
            </button>
        </form>
    );
}