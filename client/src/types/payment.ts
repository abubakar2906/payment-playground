export enum PaymentType {
    CROSS_CURRENCY = "CROSS_CURRENCY",
    CRYPTO_CROSS_CHAIN = "CRYPTO_CROSS_CHAIN",
    CRYPTO_TO_FIAT = "CRYPTO_TO_FIAT"
}

export enum PaymentStatus {
    // Shared
    CREATED = "CREATED",
    VALIDATED = "VALIDATED",
    COMPLIANCE_PASSED = "COMPLIANCE_PASSED",
    COMPLIANCE_FAILED = "COMPLIANCE_FAILED",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",

    // Cross Currency
    FX_LOCKED = "FX_LOCKED",
    LEDGER_POSTED = "LEDGER_POSTED",
    SETTLING = "SETTLING",

    // Crypto Cross Chain
    GAS_ESTIMATED = "GAS_ESTIMATED",
    SMART_CONTRACT_CALLED = "SMART_CONTRACT_CALLED",
    NETWORK_BRIDGING = "NETWORK_BRIDGING",

    // Crypto to Fiat
    CRYPTO_RECEIVED = "CRYPTO_RECEIVED",
    LIQUIDITY_CONVERSION = "LIQUIDITY_CONVERSION",
    FIAT_SETTLING = "FIAT_SETTLING",
}

export interface Payment {
    id: string;
    type: PaymentType;
    amount: number;
    sourceCurrency: string;
    destinationCurrency: string;
    recipient: string;
    recipientWallet?: string;
    reference?: string;
    status: PaymentStatus;
    exchangeRate?: number;
    fee?: number;
    destinationAmount?: number;
    createdAt: string;
}

export interface PaymentEvent {
    paymentId: string;
    status: PaymentStatus;
    timestamp: string;
    message: string;
}