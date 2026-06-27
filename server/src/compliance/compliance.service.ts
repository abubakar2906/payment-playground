import { Payment } from "../models/payment.model";

export class ComplianceService{
    check(payment: Payment): boolean{
        // Rule 1
        if(payment.amount <= 0){
            return false
        }
        // Rule 2
        if (payment.amount > 10000) {
            return false;
        }

        return true;
    }
}