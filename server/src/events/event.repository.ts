import { PaymentEvent } from "./payment-event.model";

export class EventRepository {
  private events: PaymentEvent[] = [];

  add(event: PaymentEvent) {
    this.events.push(event);
  }

  getByPaymentId(paymentId: string) {
    return this.events.filter(
      event => event.paymentId === paymentId
    );
  }
}