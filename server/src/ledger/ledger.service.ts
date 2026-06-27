import { Payment } from "../models/payment.model";

export class LedgerService {

    record(payment: Payment): void {

        // Simulate recording the payment
        // In a real system this would write to a ledger database

        payment.status = payment.status;

    }

}