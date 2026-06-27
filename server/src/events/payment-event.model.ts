export interface PaymentEvent {
    paymentId: string;
    status: string;
    timestamp: Date;
    message: string;
  }