import express from "express";
import cors from "cors";

import { PaymentRepository } from "./repositories/payment.repository";
import { PaymentStateMachine } from "./state-machine/payment-state-machine";
import { ComplianceService } from "./compliance/compliance.service";
import { PaymentOrchestrator } from "./orchestrator/payment.orchestrator";
import { PaymentService } from "./services/payment.service";
import { PaymentController } from "./controllers/payment.controller";
import { createPaymentRoutes } from "./routes/payment.routes";
import { EventRepository } from "./events/event.repository";
import { EventService } from "./events/event.service";
import { FXService } from "./fx/fx.service";
import { LedgerService } from "./ledger/ledger.service";
import { SettlementService } from "./settlement/settlement.service";
import { errorMiddleware } from "./middleware/error.middleware";
import healthRoutes from "./routes/health.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(errorMiddleware);
app.use("/health", healthRoutes);

const repository = new PaymentRepository();

const stateMachine = new PaymentStateMachine();

const complianceService = new ComplianceService();

const eventRepository = new EventRepository();

const eventService = new EventService(eventRepository);

const fxService = new FXService();

const ledgerService = new LedgerService();

const settlementService = new SettlementService();

const orchestrator = new PaymentOrchestrator(
  repository,
  stateMachine,
  complianceService,
  fxService,
  ledgerService,
  settlementService,
  eventService
);

const paymentService = new PaymentService(
  repository,
  orchestrator,
  eventService
);

const paymentController = new PaymentController(
  paymentService,
  eventService
);

app.use(
  "/payments",
  createPaymentRoutes(paymentController)
);


export default app;