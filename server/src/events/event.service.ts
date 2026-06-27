import { PaymentStatus } from "../models/payment.model";
import { EventRepository } from "./event.repository";

export class EventService {
  constructor(
    private repository: EventRepository
  ) {}

  log(
    paymentId: string,
    status: PaymentStatus,
    customMessage?: string
  ) {
    this.repository.add({
      paymentId,
      status,
      timestamp: new Date(),
      message: customMessage || this.createMessage(status) || "",
    });
  }

  getEvents(paymentId: string) {
    return this.repository.getByPaymentId(paymentId);
  }

  private createMessage(
    status: PaymentStatus
  ) {
    switch (status) {
      case PaymentStatus.CREATED:
        return "Payment created";

      case PaymentStatus.VALIDATED:
        return "Payment validated";

      case PaymentStatus.COMPLIANCE_PASSED:
        return "Compliance checks passed";

      case PaymentStatus.COMPLIANCE_FAILED:
        return "Compliance checks failed";

      case PaymentStatus.FX_LOCKED:
        return "FX rate locked";

      case PaymentStatus.LEDGER_POSTED:
        return "Ledger updated";

      case PaymentStatus.SETTLING:
        return "Settlement started";

      case PaymentStatus.COMPLETED:
        return "Payment completed";

      case PaymentStatus.FAILED:
        return "Payment failed";
    }
  }
}