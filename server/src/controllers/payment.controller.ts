import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import { EventService } from "../events/event.service";

export class PaymentController{
    constructor(
        private paymentService: PaymentService,
        private eventService: EventService
    ) {}

    create = (req: Request, res: Response) => {
        const{
            amount,
            sourceCurrency,
            destinationCurrency,
            recipient,
            type
        } = req.body;

        const payment = this.paymentService.createPayment(
            amount,
            sourceCurrency,
            destinationCurrency,
            recipient,
            type || "CROSS_CURRENCY"
        );
        res.status(201).json(payment);
    };

    getAll = (_req: Request, res: Response) =>{
        res.json(this.paymentService.getPayments());
    };

    getOne = (req: Request<{id: string}>, res: Response) => {
        const payment = this.paymentService.getPayment(
            req.params.id
        );
        if(!payment){
            return res.status(404).json({
                message: "Paymeny not found"
            })
        }
        res.json(payment);
    }
    getEvents = (
        req: Request,
        res: Response
    ) => {
    
        const { id } = req.params;
    
        const events =
            this.eventService.getEvents(id as string);
    
        res.json(events);
    
    }
}