import { useEffect, useRef, useState } from "react";
import PaymentForm from "../components/PaymentForm";
import PaymentPipeline from "../components/PaymentPipeline";
import PaymentCard from "../components/PaymentCard";
import PaymentTimeline from "../components/PaymentTimeline";
import { getEvents, getPayment } from "../api/payment.api";
import { Payment, PaymentEvent, PaymentStatus, PaymentType } from "../types/payment";

const TERMINAL = new Set([
    PaymentStatus.COMPLETED,
    PaymentStatus.FAILED,
    PaymentStatus.COMPLIANCE_FAILED,
]);

export const PIPELINES: Record<PaymentType, string[]> = {
    [PaymentType.CROSS_CURRENCY]: [
        "Created", "Validated", "Compliance", "FX Locked", "Ledger Posted", "Settling", "Completed"
    ],
    [PaymentType.CRYPTO_CROSS_CHAIN]: [
        "Created", "Validated", "Compliance", "Gas Estimated", "Contract Call", "Bridging", "Completed"
    ],
    [PaymentType.CRYPTO_TO_FIAT]: [
        "Created", "Validated", "Compliance", "Crypto Received", "Liquidity Swap", "Fiat Settling", "Completed"
    ]
};

export default function Dashboard() {
    const [paymentId, setPaymentId] = useState("");
    const [payment,   setPayment]   = useState<Payment>();
    const [events,    setEvents]    = useState<PaymentEvent[]>([]);
    const [activeTab, setActiveTab] = useState<PaymentType>(PaymentType.CROSS_CURRENCY);
    const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

    useEffect(() => {
        if (!paymentId) return;
        setPayment(undefined);
        setEvents([]);

        intervalRef.current = setInterval(async () => {
            const [p, e] = await Promise.all([getPayment(paymentId), getEvents(paymentId)]);
            setPayment(p);
            setEvents(e);
            if (TERMINAL.has(p.status)) clearInterval(intervalRef.current);
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, [paymentId]);

    const isLive = !!paymentId && !TERMINAL.has(payment?.status as PaymentStatus);

    // If there's an active payment, its type overrides the manual tab for the legend/pipeline view
    const viewType = payment?.type ?? activeTab;

    return (
        <main style={{ minHeight: "100vh", background: "#F7F7F8", paddingTop: "62px", fontFamily: "'Inter', sans-serif" }}>

            {/* Top bar */}
            <div style={{ background: "#fff", borderBottom: "1px solid #E4E4E7" }}>
                <div style={{
                    maxWidth: 1280, margin: "0 auto",
                    padding: "0.875rem 2rem",
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap", gap: "0.75rem",
                }}>
                    <div>
                        <h1 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#0A0A0A", letterSpacing: "-0.01em" }}>
                            Payment Simulator
                        </h1>
                        <p style={{ fontSize: "0.8125rem", color: "#A1A1AA", marginTop: 2 }}>
                            Trace a cross-border payment through every pipeline stage
                        </p>
                    </div>

                    {isLive && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8125rem", fontWeight: 600, color: "#059669" }}>
                            <span style={{
                                width: 7, height: 7, borderRadius: "50%",
                                background: "#10B981",
                                animation: "dotPulse 1.2s ease-in-out infinite",
                                display: "inline-block",
                            }} />
                            Live tracking
                        </div>
                    )}

                    {payment && TERMINAL.has(payment.status) && (
                        <div style={{
                            fontSize: "0.8125rem", fontWeight: 600,
                            color: payment.status === PaymentStatus.COMPLETED ? "#059669" : "#DC2626",
                        }}>
                            {payment.status === PaymentStatus.COMPLETED ? "✓ Completed" : "✕ Halted"}
                        </div>
                    )}
                </div>
            </div>

            {/* Page content */}
            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "1.5rem 2rem" }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "340px 1fr",
                    gap: "1.5rem",
                    alignItems: "start",
                }}>
                    {/* Left sidebar */}
                    <div style={{ position: "sticky", top: "74px", display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <PaymentForm
                            onCreated={setPaymentId}
                            activeType={activeTab}
                            onTypeChange={setActiveTab}
                        />

                        {/* Stage legend */}
                        <div style={{
                            background: "#fff",
                            border: "1px solid #E4E4E7",
                            borderRadius: 12,
                            padding: "1.125rem 1.25rem",
                        }}>
                            <p style={{
                                fontSize: "0.6875rem", fontWeight: 700,
                                color: "#A1A1AA", textTransform: "uppercase",
                                letterSpacing: "0.07em", marginBottom: "0.875rem",
                            }}>
                                Pipeline stages
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {PIPELINES[viewType].map((s, i) => (
                                    <div key={s} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                                        <span style={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            fontSize: "0.6875rem", color: "#D1D5DB",
                                            fontWeight: 700, minWidth: 20,
                                        }}>
                                            {String(i + 1).padStart(2, "0")}
                                        </span>
                                        <span style={{ fontSize: "0.8125rem", color: "#71717A" }}>{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: pipeline + card + timeline */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <PaymentPipeline payment={payment} viewType={viewType} />
                        <PaymentCard     payment={payment} />
                        <PaymentTimeline events={events} />
                    </div>
                </div>
            </div>
        </main>
    );
}