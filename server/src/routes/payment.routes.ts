import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";

export function createPaymentRoutes(
  controller: PaymentController
) {
  const router = Router();

  router.post("/", controller.create);

  router.get("/", controller.getAll);

  router.get("/:id", controller.getOne);

  router.get(
    "/:id/events",
    controller.getEvents
  );

  return router;
}