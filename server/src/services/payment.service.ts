import { v4 as uuid } from "uuid";
import{
    Payment,
    PaymentStatus
} from "../models/payment.model"
import { PaymentRepository } from "../repositories/payment.repository";
import { PaymentOrchestrator } from "../orchestrator/payment.orchestrator";
import { EventService } from "../events/event.service";
import { ValidationError } from "../errors/ValidationError";

export class PaymentService{
    constructor(
        private repository: PaymentRepository,
        private orchestrator: PaymentOrchestrator,
        private eventService: EventService
    ) {}

    createPayment(
        amount: number,
        sourceCurrency: string,
        destinationCurrency: string,
        recipient: string,
        type: import("../models/payment.model").PaymentType
    ) {
        if (amount <= 0) {
            throw new ValidationError(
                "Amount must be greater than zero"
            );
        }
        const payment: Payment = {
            id: uuid(),
            type,
            amount,
            sourceCurrency,
            destinationCurrency,
            recipient,
            status: PaymentStatus.CREATED,
            createdAt: new Date()
        };
        const createdPayment = this.repository.create(payment);
        this.eventService.log(
            createdPayment.id,
            PaymentStatus.CREATED
        );
        void this.orchestrator.start(createdPayment.id);
        return createdPayment  
    }
    getPayment(id: string){
        return this.repository.findById(id);
    }
    getPayments(){
        return this.repository.findAll();
    }
}