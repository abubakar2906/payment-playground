import { Payment, PaymentStatus } from "../models/payment.model"

const transitions: Record<PaymentStatus, PaymentStatus[]> = {
    [PaymentStatus.CREATED]: [
        PaymentStatus.VALIDATED,
    ],
    [PaymentStatus.VALIDATED]: [
        PaymentStatus.COMPLIANCE_PASSED,
        PaymentStatus.COMPLIANCE_FAILED,
    ],
    [PaymentStatus.COMPLIANCE_PASSED]: [
        PaymentStatus.FX_LOCKED,         // Cross currency path
        PaymentStatus.GAS_ESTIMATED,     // Crypto cross chain path
        PaymentStatus.CRYPTO_RECEIVED,   // Crypto to fiat path
    ],
    [PaymentStatus.COMPLIANCE_FAILED]: [
        PaymentStatus.FAILED
    ],
    
    // Path 1: Cross Currency
    [PaymentStatus.FX_LOCKED]: [
        PaymentStatus.LEDGER_POSTED,
    ],
    [PaymentStatus.LEDGER_POSTED]: [
        PaymentStatus.SETTLING,
    ],
    [PaymentStatus.SETTLING]: [
        PaymentStatus.COMPLETED,
        PaymentStatus.FAILED,
    ],

    // Path 2: Crypto Cross Chain
    [PaymentStatus.GAS_ESTIMATED]: [
        PaymentStatus.SMART_CONTRACT_CALLED,
    ],
    [PaymentStatus.SMART_CONTRACT_CALLED]: [
        PaymentStatus.NETWORK_BRIDGING,
    ],
    [PaymentStatus.NETWORK_BRIDGING]: [
        PaymentStatus.COMPLETED,
        PaymentStatus.FAILED,
    ],

    // Path 3: Crypto To Fiat
    [PaymentStatus.CRYPTO_RECEIVED]: [
        PaymentStatus.LIQUIDITY_CONVERSION,
    ],
    [PaymentStatus.LIQUIDITY_CONVERSION]: [
        PaymentStatus.FIAT_SETTLING,
    ],
    [PaymentStatus.FIAT_SETTLING]: [
        PaymentStatus.COMPLETED,
        PaymentStatus.FAILED,
    ],

    // Terminal
    [PaymentStatus.COMPLETED]: [],
    [PaymentStatus.FAILED]: [],
};

export class PaymentStateMachine {
    transition(
        payment: Payment,
        nextStatus: PaymentStatus
    ): Payment {
        const allowed = transitions[payment.status];
        if (!allowed.includes(nextStatus)) {
            throw new Error(
                `Cannot move payment from ${payment.status} to ${nextStatus}`
            );
        }
        payment.status = nextStatus;

        return payment
    };
}