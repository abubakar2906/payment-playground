import { Payment } from "../types/payment";
import StatusBadge from "./StatusBadge";
import { ArrowRight } from "lucide-react";

interface Props { payment?: Payment; }

const FLAG: Record<string, string> = {
    USD: "🇺🇸", GBP: "🇬🇧", EUR: "🇪🇺",
    NGN: "🇳🇬", KES: "🇰🇪", GHS: "🇬🇭", ZAR: "🇿🇦",
};

function Row({ label, value, mono = false, accent = false }: {
    label: string; value: string; mono?: boolean; accent?: boolean;
}) {
    return (
        <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "0.6875rem 0", borderBottom: "1px solid #F3F4F6", gap: "1rem",
        }}>
            <span style={{ fontSize: "0.8125rem", color: "#A1A1AA", fontWeight: 500, flexShrink: 0 }}>
                {label}
            </span>
            <span style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: accent ? "#635BFF" : "#0A0A0A",
                fontFamily: mono ? "'JetBrains Mono', monospace" : "'Inter', sans-serif",
                textAlign: "right",
                wordBreak: "break-all",
            }}>
                {value}
            </span>
        </div>
    );
}

export default function PaymentCard({ payment }: Props) {
    if (!payment) {
        return (
            <div style={{
                background: "#fff", border: "1px solid #E4E4E7",
                borderRadius: 12, padding: "1.25rem 1.5rem",
                fontFamily: "'Inter', sans-serif",
            }}>
                <p style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#0A0A0A", marginBottom: "1rem" }}>
                    Payment Details
                </p>
                {[75, 55, 85, 65].map((w, i) => (
                    <div key={i} style={{ padding: "0.6875rem 0", borderBottom: "1px solid #F3F4F6" }}>
                        <div style={{
                            height: 13, width: `${w}%`, borderRadius: 4,
                            background: "linear-gradient(90deg,#F3F4F6 25%,#E9EAEC 50%,#F3F4F6 75%)",
                            backgroundSize: "200% auto",
                            animation: "shimmer 1.6s linear infinite",
                        }} />
                    </div>
                ))}
            </div>
        );
    }

    const srcFlag = FLAG[payment.sourceCurrency] ?? "🌐";
    const dstFlag = FLAG[payment.destinationCurrency] ?? "🌐";

    return (
        <div style={{
            background: "#fff", border: "1px solid #E4E4E7",
            borderRadius: 12, padding: "1.25rem 1.5rem",
            fontFamily: "'Inter', sans-serif",
        }}>
            {/* Amount banner */}
            <div style={{
                display: "flex", alignItems: "center", gap: "1rem",
                padding: "1.125rem 1.25rem",
                background: "#F7F7F8", border: "1px solid #E4E4E7",
                borderRadius: 10, marginBottom: "1.25rem",
                flexWrap: "wrap",
            }}>
                {/* Source */}
                <div style={{ flex: 1, minWidth: 110 }}>
                    <p style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                        Sending
                    </p>
                    <p style={{ fontSize: "1.625rem", fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.04em", lineHeight: 1 }}>
                        {srcFlag} {payment.amount.toLocaleString()}
                        <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#A1A1AA", marginLeft: 6 }}>
                            {payment.sourceCurrency}
                        </span>
                    </p>
                </div>

                <ArrowRight size={15} color="#D1D5DB" strokeWidth={2} style={{ flexShrink: 0 }} />

                {/* Destination */}
                <div style={{ flex: 1, minWidth: 110, textAlign: "right" }}>
                    <p style={{ fontSize: "0.6875rem", fontWeight: 600, color: "#A1A1AA", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                        Recipient gets
                    </p>
                    {payment.destinationAmount != null ? (
                        <p style={{ fontSize: "1.625rem", fontWeight: 800, color: "#059669", letterSpacing: "-0.04em", lineHeight: 1 }}>
                            {dstFlag} {payment.destinationAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#6EE7B7", marginLeft: 6 }}>
                                {payment.destinationCurrency}
                            </span>
                        </p>
                    ) : (
                        <div style={{
                            height: 28, width: 120, borderRadius: 4, marginLeft: "auto",
                            background: "linear-gradient(90deg,#F3F4F6 25%,#E9EAEC 50%,#F3F4F6 75%)",
                            backgroundSize: "200% auto",
                            animation: "shimmer 1.6s linear infinite",
                        }} />
                    )}
                </div>
            </div>

            {/* Exchange rate + badge */}
            {payment.exchangeRate != null && (
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    fontSize: "0.8125rem", marginBottom: "1rem",
                    padding: "0.5rem 0", borderBottom: "1px solid #F3F4F6",
                }}>
                    <span style={{ color: "#A1A1AA" }}>
                        Rate:{" "}
                        <span style={{ color: "#635BFF", fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                            1 {payment.sourceCurrency} = {payment.exchangeRate.toLocaleString()} {payment.destinationCurrency}
                        </span>
                    </span>
                    <StatusBadge status={payment.status} size="sm" />
                </div>
            )}

            {/* Rows */}
            <Row label="Payment ID" value={payment.id} mono />
            <Row label="Recipient"  value={payment.recipient} />
            <Row label="Route"      value={`${payment.sourceCurrency} → ${payment.destinationCurrency}`} accent />
            <Row label="Created"    value={new Date(payment.createdAt).toLocaleString()} />
            {payment.fee != null && <Row label="Fee" value={`${payment.fee} ${payment.sourceCurrency}`} />}
            {!payment.exchangeRate && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6875rem 0" }}>
                    <span style={{ fontSize: "0.8125rem", color: "#A1A1AA", fontWeight: 500 }}>Status</span>
                    <StatusBadge status={payment.status} size="sm" />
                </div>
            )}
        </div>
    );
}
