import { Request, Response } from "express";
import { AutomationPaymentServices } from "../../Services/adm/AutomationPaymentServices";

class AutomationPaymentController{
  async handle(req:Request, res:Response) {
    const automationPaymentServices = new AutomationPaymentServices();
    const automationPayment = automationPaymentServices.execute();
    return res.json(automationPayment)
  }
}

export { AutomationPaymentController};
