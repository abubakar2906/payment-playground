import { Payment } from "../models/payment.model";
import { sleep } from "../utils/sleep";

export class SettlementService {

    async process(payment: Payment): Promise<void> {

        // Simulate settlement network

        await sleep(1000);

        payment.status = payment.status;

    }

}