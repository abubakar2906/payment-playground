import { PaymentEvent, PaymentStatus } from "../types/payment";

const STATUS_COLOR: Record<string, string> = {
    [PaymentStatus.CREATED]:           "#A1A1AA",
    [PaymentStatus.VALIDATED]:         "#3B82F6",
    [PaymentStatus.COMPLIANCE_PASSED]: "#10B981",
    [PaymentStatus.COMPLIANCE_FAILED]: "#EF4444",
    [PaymentStatus.FX_LOCKED]:         "#D97706",
    [PaymentStatus.LEDGER_POSTED]:     "#7C3AED",
    [PaymentStatus.SETTLING]:          "#635BFF",
    [PaymentStatus.GAS_ESTIMATED]:         "#D97706",
    [PaymentStatus.SMART_CONTRACT_CALLED]: "#7C3AED",
    [PaymentStatus.NETWORK_BRIDGING]:      "#635BFF",
    [PaymentStatus.CRYPTO_RECEIVED]:       "#D97706",
    [PaymentStatus.LIQUIDITY_CONVERSION]:  "#7C3AED",
    [PaymentStatus.FIAT_SETTLING]:         "#635BFF",
    [PaymentStatus.COMPLETED]:         "#059669",
    [PaymentStatus.FAILED]:            "#DC2626",
};

const STATUS_INIT: Record<string, string> = {
    [PaymentStatus.CREATED]:           "C",
    [PaymentStatus.VALIDATED]:         "V",
    [PaymentStatus.COMPLIANCE_PASSED]: "✓",
    [PaymentStatus.COMPLIANCE_FAILED]: "✕",
    [PaymentStatus.FX_LOCKED]:         "FX",
    [PaymentStatus.LEDGER_POSTED]:     "L",
    [PaymentStatus.SETTLING]:          "S",
    [PaymentStatus.GAS_ESTIMATED]:         "G",
    [PaymentStatus.SMART_CONTRACT_CALLED]: "SC",
    [PaymentStatus.NETWORK_BRIDGING]:      "B",
    [PaymentStatus.CRYPTO_RECEIVED]:       "CR",
    [PaymentStatus.LIQUIDITY_CONVERSION]:  "LC",
    [PaymentStatus.FIAT_SETTLING]:         "FS",
    [PaymentStatus.COMPLETED]:         "✓",
    [PaymentStatus.FAILED]:            "✕",
};

function relTime(ts: string): string {
    const s = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (s < 5)  return "just now";
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

interface Props { events: PaymentEvent[]; }

export default function PaymentTimeline({ events }: Props) {
    return (
        <div style={{
            background: "#fff",
            border: "1px solid #E4E4E7",
            borderRadius: 12,
            padding: "1.25rem 1.5rem",
            fontFamily: "'Inter', sans-serif",
        }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.125rem" }}>
                <h2 style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#0A0A0A" }}>Event Log</h2>
                {events.length > 0 && (
                    <span style={{
                        fontSize: "0.6875rem", fontWeight: 700,
                        color: "#A1A1AA", background: "#F7F7F8",
                        border: "1px solid #E4E4E7",
                        borderRadius: 100, padding: "0.2rem 0.625rem",
                    }}>
                        {events.length} event{events.length !== 1 ? "s" : ""}
                    </span>
                )}
            </div>

            {/* Empty */}
            {events.length === 0 && (
                <div style={{ padding: "2rem 0", textAlign: "center" }}>
                    <p style={{ fontSize: "0.875rem", color: "#D1D5DB" }}>
                        No events yet. Create a payment to start tracing.
                    </p>
                </div>
            )}

            {/* List */}
            {events.length > 0 && (
                <div style={{ position: "relative" }}>
                    {/* Vertical line */}
                    <div style={{
                        position: "absolute", left: 14,
                        top: 15, bottom: 15,
                        width: 1, background: "#F3F4F6",
                    }} />

                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 0 }}>
                        {[...events].reverse().map((ev, i) => {
                            const color = STATUS_COLOR[ev.status] ?? "#A1A1AA";
                            const init  = STATUS_INIT[ev.status]  ?? "·";

                            return (
                                <li
                                    key={`${ev.timestamp}-${i}`}
                                    className={i === 0 ? "animate-slide-up" : ""}
                                    style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.5rem 0" }}
                                >
                                    {/* Bubble */}
                                    <div style={{
                                        width: 28, height: 28, borderRadius: "50%",
                                        background: "#F7F7F8",
                                        border: "1px solid #E4E4E7",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: "0.5625rem", fontWeight: 700, color,
                                        flexShrink: 0, zIndex: 1,
                                    }}>
                                        {init}
                                    </div>

                                    {/* Content */}
                                    <div style={{ flex: 1, paddingTop: "0.25rem" }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                                            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color }}>
                                                {ev.status.replace(/_/g, " ")}
                                            </span>
                                            <span style={{
                                                fontSize: "0.6875rem", color: "#D1D5DB",
                                                fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap",
                                            }}>
                                                {relTime(ev.timestamp)}
                                            </span>
                                        </div>
                                        {ev.message && (
                                            <p style={{ fontSize: "0.8125rem", color: "#A1A1AA", marginTop: 2, lineHeight: 1.5 }}>
                                                {ev.message}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
