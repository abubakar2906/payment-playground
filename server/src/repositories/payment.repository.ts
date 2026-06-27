import { Payment } from "../models/payment.model"

export class PaymentRepository{
    private payments: Payment[] = [];

    create(payment: Payment){
        this.payments.push(payment);
        return payment
    }

    findById(id: string){
        return this.payments.find(payment => payment.id === id);
    }

    findAll(){
        return this.payments;
    }

    update(payment: Payment){
        const index =  this.payments.findIndex(p => p.id === payment.id);
        if(index === -1){
            return undefined;
        }
        this.payments[index] = payment;
        return payment;
    }
}