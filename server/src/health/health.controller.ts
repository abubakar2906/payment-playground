import { Request, Response } from "express";

export class HealthController {

    health(
        req: Request,
        res: Response
    ) {

        res.json({
            status: "OK",
            service: "Payment Pipeline Simulator",
            timestamp: new Date(),
        });

    }

}