import { Payment, PaymentStatus, PaymentType } from "../types/payment";
import { CheckCircle2, XCircle } from "lucide-react";

const PIPELINES = {
    [PaymentType.CROSS_CURRENCY]: [
        { status: PaymentStatus.CREATED,           label: "Created"    },
        { status: PaymentStatus.VALIDATED,         label: "Validated"  },
        { status: PaymentStatus.COMPLIANCE_PASSED, label: "Compliance" },
        { status: PaymentStatus.FX_LOCKED,         label: "FX Locked"  },
        { status: PaymentStatus.LEDGER_POSTED,     label: "Ledger"     },
        { status: PaymentStatus.SETTLING,          label: "Settling"   },
        { status: PaymentStatus.COMPLETED,         label: "Complete"   },
    ],
    [PaymentType.CRYPTO_CROSS_CHAIN]: [
        { status: PaymentStatus.CREATED,               label: "Created"    },
        { status: PaymentStatus.VALIDATED,             label: "Validated"  },
        { status: PaymentStatus.COMPLIANCE_PASSED,     label: "Compliance" },
        { status: PaymentStatus.GAS_ESTIMATED,         label: "Gas Est."   },
        { status: PaymentStatus.SMART_CONTRACT_CALLED, label: "Contract"   },
        { status: PaymentStatus.NETWORK_BRIDGING,      label: "Bridging"   },
        { status: PaymentStatus.COMPLETED,             label: "Complete"   },
    ],
    [PaymentType.CRYPTO_TO_FIAT]: [
        { status: PaymentStatus.CREATED,              label: "Created"    },
        { status: PaymentStatus.VALIDATED,            label: "Validated"  },
        { status: PaymentStatus.COMPLIANCE_PASSED,    label: "Compliance" },
        { status: PaymentStatus.CRYPTO_RECEIVED,      label: "Crypto In"  },
        { status: PaymentStatus.LIQUIDITY_CONVERSION, label: "Swap"       },
        { status: PaymentStatus.FIAT_SETTLING,        label: "Fiat Out"   },
        { status: PaymentStatus.COMPLETED,            label: "Complete"   },
    ]
};

interface Props { payment?: Payment; viewType: PaymentType; }
type State = "done" | "active" | "failed" | "idle";

export default function PaymentPipeline({ payment, viewType }: Props) {
    const isFailed =
        payment?.status === PaymentStatus.FAILED ||
        payment?.status === PaymentStatus.COMPLIANCE_FAILED;

    const stages = PIPELINES[viewType];
    const ORDER = stages.map(s => s.status);
    
    // Note: if payment failed before getting to a specific pipeline stage (e.g. COMPLIANCE_FAILED),
    // it handles correctly since COMPLIANCE is shared. But if it fails entirely, we map it based on current stage index.
    const curStatus = payment?.status === PaymentStatus.FAILED 
        ? ORDER[ORDER.length - 1] // Or map it to current if we knew it
        : payment?.status;
        
    const cur = payment ? ORDER.indexOf(curStatus as PaymentStatus) : -1;

    const state = (i: number): State => {
        if (!payment) return "idle";
        
        // If it's a generic failed status not in the timeline (like COMPLIANCE_FAILED), we just highlight it up to that point
        if (payment.status === PaymentStatus.COMPLIANCE_FAILED) {
             const complianceIndex = ORDER.indexOf(PaymentStatus.COMPLIANCE_PASSED);
             if (i < complianceIndex) return "done";
             if (i === complianceIndex) return "failed";
             return "idle";
        }

        if (isFailed) return i < cur ? "done" : i === cur ? "failed" : "idle";
        if (i < cur)  return "done";
        if (i === cur) return "active";
        return "idle";
    };

    const NODE: Record<State, React.CSSProperties> = {
        done:   { background: "#10B981", border: "2px solid #10B981" },
        active: { background: "#635BFF", border: "2px solid #635BFF", boxShadow: "0 0 0 4px rgba(99,91,255,0.15)" },
        failed: { background: "#EF4444", border: "2px solid #EF4444" },
        idle:   { background: "#fff",    border: "2px solid #E4E4E7" },
    };

    const LABEL: Record<State, string> = {
        done:   "#10B981",
        active: "#635BFF",
        failed: "#EF4444",
        idle:   "#A1A1AA",
    };

    return (
        <div style={{
            background: "#fff",
            border: "1px solid #E4E4E7",
            borderRadius: 12,
            padding: "1.25rem 1.5rem",
            fontFamily: "'Inter', sans-serif",
        }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                <div>
                    <h2 style={{ fontWeight: 700, fontSize: "0.9375rem", color: "#0A0A0A", letterSpacing: "-0.01em" }}>
                        Payment Pipeline
                    </h2>
                    <p style={{ fontSize: "0.75rem", color: "#A1A1AA", marginTop: 2 }}>
                        {payment ? `ID ${payment.id.slice(0, 8)}…` : "Awaiting payment"}
                    </p>
                </div>
                {isFailed && (
                    <span style={{
                        fontSize: "0.75rem", fontWeight: 600,
                        color: "#DC2626", background: "#FEF2F2",
                        border: "1px solid #FECACA",
                        borderRadius: 100, padding: "0.2rem 0.75rem",
                    }}>
                        {payment?.status === PaymentStatus.COMPLIANCE_FAILED ? "Compliance failed" : "Failed"}
                    </span>
                )}
            </div>

            {/* Nodes */}
            <div style={{ display: "flex", alignItems: "center" }}>
                {stages.map((stage, i) => {
                    const s = state(i);
                    const isLast = i === stages.length - 1;
                    const lineGreen = !isFailed && cur > i;

                    return (
                        <div key={stage.status} style={{ display: "flex", alignItems: "center", flex: isLast ? "none" : 1 }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
                                {/* Node circle */}
                                <div style={{
                                    width: 32, height: 32, borderRadius: "50%",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    flexShrink: 0,
                                    transition: "all 0.4s ease",
                                    animation: s === "active" ? "pulseGlow 2s ease-in-out infinite" : "none",
                                    ...NODE[s],
                                }}>
                                    {s === "done"   && <CheckCircle2 size={14} color="white" strokeWidth={2.5} />}
                                    {s === "failed" && <XCircle      size={14} color="white" strokeWidth={2.5} />}
                                    {(s === "active" || s === "idle") && (
                                        <span style={{
                                            width: 8, height: 8, borderRadius: "50%",
                                            background: s === "active" ? "white" : "#E4E4E7",
                                        }} />
                                    )}
                                </div>
                                {/* Label */}
                                <span style={{
                                    fontSize: "0.5875rem",
                                    fontWeight: s === "active" || s === "done" ? 700 : 500,
                                    color: LABEL[s],
                                    whiteSpace: "nowrap",
                                    transition: "color 0.3s",
                                    letterSpacing: "0.01em",
                                }}>
                                    {stage.label}
                                </span>
                            </div>

                            {/* Connector */}
                            {!isLast && (
                                <div style={{
                                    flex: 1, height: 2,
                                    marginBottom: "1.125rem",
                                    background: lineGreen ? "#10B981" : "#F3F4F6",
                                    transition: "background 0.4s ease",
                                    position: "relative", overflow: "hidden",
                                }}>
                                    {s === "active" && (
                                        <div style={{
                                            position: "absolute", inset: 0,
                                            background: "linear-gradient(90deg, transparent, rgba(99,91,255,0.4), transparent)",
                                            animation: "shimmer 1.6s linear infinite",
                                            backgroundSize: "200% auto",
                                        }} />
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
