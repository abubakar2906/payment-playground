import {
    CheckCircle2,
    XCircle,
    Clock,
    ShieldCheck,
    ShieldX,
    DollarSign,
    BookOpen,
    Loader2,
    Zap,
} from "lucide-react";
import { PaymentStatus } from "../types/payment";

interface StatusConfig {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: React.ReactNode;
    pulse?: boolean;
}

const STATUS_MAP: Record<PaymentStatus, StatusConfig> = {
    [PaymentStatus.CREATED]: {
        label: "Created",
        color: "#52525B", // Zinc 600
        bg: "#F4F4F5", // Zinc 100
        border: "#E4E4E7", // Zinc 200
        icon: <Clock size={12} strokeWidth={2.5} />,
    },
    [PaymentStatus.VALIDATED]: {
        label: "Validated",
        color: "#2563EB", // Blue 600
        bg: "#EFF6FF", // Blue 50
        border: "#BFDBFE", // Blue 200
        icon: <CheckCircle2 size={12} strokeWidth={2.5} />,
    },
    [PaymentStatus.COMPLIANCE_PASSED]: {
        label: "Compliance ✓",
        color: "#059669", // Emerald 600
        bg: "#ECFDF5", // Emerald 50
        border: "#A7F3D0", // Emerald 200
        icon: <ShieldCheck size={12} strokeWidth={2.5} />,
    },
    [PaymentStatus.COMPLIANCE_FAILED]: {
        label: "Compliance ✗",
        color: "#DC2626", // Red 600
        bg: "#FEF2F2", // Red 50
        border: "#FECACA", // Red 200
        icon: <ShieldX size={12} strokeWidth={2.5} />,
    },
    [PaymentStatus.FX_LOCKED]: {
        label: "FX Locked",
        color: "#D97706", // Amber 600
        bg: "#FFFBEB", // Amber 50
        border: "#FDE68A", // Amber 200
        icon: <DollarSign size={12} strokeWidth={2.5} />,
        pulse: true,
    },
    [PaymentStatus.LEDGER_POSTED]: {
        label: "Ledger Posted",
        color: "#7C3AED", // Violet 600
        bg: "#F5F3FF", // Violet 50
        border: "#DDD6FE", // Violet 200
        icon: <BookOpen size={12} strokeWidth={2.5} />,
        pulse: true,
    },
    [PaymentStatus.SETTLING]: {
        label: "Settling",
        color: "#635BFF", // Stripe Purple
        bg: "#F0EFFF", // Light Purple
        border: "#E0E7FF", // Indigo 100
        icon: <Loader2 size={12} strokeWidth={2.5} style={{ animation: "spin 0.8s linear infinite" }} />,
        pulse: true,
    },
    [PaymentStatus.COMPLETED]: {
        label: "Completed",
        color: "#059669", // Emerald 600
        bg: "#ECFDF5", // Emerald 50
        border: "#A7F3D0", // Emerald 200
        icon: <Zap size={12} strokeWidth={2.5} />,
    },
    [PaymentStatus.FAILED]: {
        label: "Failed",
        color: "#DC2626", // Red 600
        bg: "#FEF2F2", // Red 50
        border: "#FECACA", // Red 200
        icon: <XCircle size={12} strokeWidth={2.5} />,
    },
    [PaymentStatus.GAS_ESTIMATED]: {
        label: "Gas Estimated",
        color: "#D97706",
        bg: "#FFFBEB",
        border: "#FDE68A",
        icon: <DollarSign size={12} strokeWidth={2.5} />,
        pulse: true,
    },
    [PaymentStatus.SMART_CONTRACT_CALLED]: {
        label: "Contract Call",
        color: "#7C3AED",
        bg: "#F5F3FF",
        border: "#DDD6FE",
        icon: <BookOpen size={12} strokeWidth={2.5} />,
        pulse: true,
    },
    [PaymentStatus.NETWORK_BRIDGING]: {
        label: "Bridging",
        color: "#635BFF",
        bg: "#F0EFFF",
        border: "#E0E7FF",
        icon: <Loader2 size={12} strokeWidth={2.5} style={{ animation: "spin 0.8s linear infinite" }} />,
        pulse: true,
    },
    [PaymentStatus.CRYPTO_RECEIVED]: {
        label: "Crypto In",
        color: "#D97706",
        bg: "#FFFBEB",
        border: "#FDE68A",
        icon: <Clock size={12} strokeWidth={2.5} />,
        pulse: true,
    },
    [PaymentStatus.LIQUIDITY_CONVERSION]: {
        label: "Swapping",
        color: "#7C3AED",
        bg: "#F5F3FF",
        border: "#DDD6FE",
        icon: <BookOpen size={12} strokeWidth={2.5} />,
        pulse: true,
    },
    [PaymentStatus.FIAT_SETTLING]: {
        label: "Fiat Settling",
        color: "#635BFF",
        bg: "#F0EFFF",
        border: "#E0E7FF",
        icon: <Loader2 size={12} strokeWidth={2.5} style={{ animation: "spin 0.8s linear infinite" }} />,
        pulse: true,
    },
};

interface Props {
    status: PaymentStatus;
    size?: "sm" | "md";
}

export default function StatusBadge({ status, size = "md" }: Props) {
    const config = STATUS_MAP[status];
    if (!config) return null;

    const padding = size === "sm" ? "0.2rem 0.6rem" : "0.3rem 0.75rem";
    const fontSize = size === "sm" ? "0.6875rem" : "0.75rem";

    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding,
                fontSize,
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.01em",
                color: config.color,
                background: config.bg,
                border: `1px solid ${config.border}`,
                borderRadius: 9999, // full radius
                whiteSpace: "nowrap",
            }}
        >
            {config.pulse && (
                <span
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: config.color,
                        display: "inline-block",
                        animation: "dotPulse 1.5s ease-in-out infinite",
                    }}
                />
            )}
            {!config.pulse && config.icon}
            {config.label}
        </span>
    );
}
