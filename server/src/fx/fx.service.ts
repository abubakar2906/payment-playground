import { Payment } from "../models/payment.model";

export class FXService {

    quote(payment: Payment): Payment {

        const rates: Record<string, number> = {
            "USD-NGN": 1600,
            "EUR-NGN": 1850,
        };
    
        const key =
            `${payment.sourceCurrency}-${payment.destinationCurrency}`;
    
        const rate = rates[key] ?? 1;
    
        payment.exchangeRate = rate;
    
        payment.fee = payment.amount * 0.01;
    
        payment.destinationAmount =
            (payment.amount - payment.fee) * rate;
    
        return payment;
    }
}