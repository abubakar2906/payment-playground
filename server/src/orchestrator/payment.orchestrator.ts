import { PaymentRepository } from "../repositories/payment.repository"
import { PaymentStateMachine } from "../state-machine/payment-state-machine"
import { PaymentStatus, Payment, PaymentType } from "../models/payment.model"
import { ComplianceService } from "../compliance/compliance.service"
import { sleep } from "../utils/sleep"
import { EventService } from "../events/event.service"
import { FXService } from "../fx/fx.service"
import { LedgerService } from "../ledger/ledger.service"
import { SettlementService } from "../settlement/settlement.service"
import { NotFoundError } from "../errors/NotFoundError"

export class PaymentOrchestrator {
    constructor(
        private repository: PaymentRepository,
        private stateMachine: PaymentStateMachine,
        private compliance: ComplianceService,
        private fxService: FXService,
        private ledgerService: LedgerService,
        private settlementService: SettlementService,
        private eventService: EventService
    ) { }

    private async moveTo(
        payment: Payment,
        status: PaymentStatus,
        message?: string
    ) {
        await sleep(2000);
        this.stateMachine.transition(payment, status)
        this.repository.update(payment);
        this.eventService.log(
            payment.id,
            payment.status,
            message
        );
    }

    async start(paymentId: string) {
        const payment = this.repository.findById(paymentId);
        if (!payment) {
            throw new NotFoundError("Payment not found")
        }
        await this.moveTo(payment, PaymentStatus.VALIDATED);

        const approved = this.compliance.check(payment);
        if (!approved) {
            await this.moveTo(payment, PaymentStatus.COMPLIANCE_FAILED, "Sender flagged by AML checks");
            return
        }
        await this.moveTo(payment, PaymentStatus.COMPLIANCE_PASSED);

        switch (payment.type) {
            case PaymentType.CROSS_CURRENCY:
                await this.processCrossCurrency(payment);
                break;
            case PaymentType.CRYPTO_CROSS_CHAIN:
                await this.processCryptoCrossChain(payment);
                break;
            case PaymentType.CRYPTO_TO_FIAT:
                await this.processCryptoToFiat(payment);
                break;
            default:
                await this.processCrossCurrency(payment);
                break;
        }

        await this.moveTo(payment, PaymentStatus.COMPLETED);
    }

    private async processCrossCurrency(payment: Payment) {
        this.fxService.quote(payment);
        await this.moveTo(payment, PaymentStatus.FX_LOCKED);

        this.ledgerService.record(payment);
        await this.moveTo(payment, PaymentStatus.LEDGER_POSTED);

        await this.settlementService.process(payment);
        await this.moveTo(payment, PaymentStatus.SETTLING);
    }

    private async processCryptoCrossChain(payment: Payment) {
        payment.fee = payment.amount * 0.005; // 0.5% fee
        payment.exchangeRate = 1; // e.g. USDC to USDC
        payment.destinationAmount = payment.amount - payment.fee;
        await this.moveTo(payment, PaymentStatus.GAS_ESTIMATED, `Gas estimated at ${payment.fee} ${payment.sourceCurrency}`);

        await this.moveTo(payment, PaymentStatus.SMART_CONTRACT_CALLED, "Initiated cross-chain bridge contract");

        await this.moveTo(payment, PaymentStatus.NETWORK_BRIDGING, "Waiting for destination network relay");
    }

    private async processCryptoToFiat(payment: Payment) {
        await this.moveTo(payment, PaymentStatus.CRYPTO_RECEIVED, `Received ${payment.amount} ${payment.sourceCurrency}`);

        this.fxService.quote(payment);
        await this.moveTo(payment, PaymentStatus.LIQUIDITY_CONVERSION, `Converted to ${payment.destinationCurrency} via liquidity provider`);

        await this.moveTo(payment, PaymentStatus.FIAT_SETTLING, "Dispatching funds to bank via local rails");
    }
}