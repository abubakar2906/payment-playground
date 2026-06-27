import { Router } from "express";
import { HealthController } from "../health/health.controller";

const router = Router();

const controller = new HealthController();

router.get("/", controller.health);

export default router;