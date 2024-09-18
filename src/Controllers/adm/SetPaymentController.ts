import { Request,Response } from "express";
import { SetPaymentServices } from "../../Services/adm/SetPaymentServices";

class SetPaymentController{
    async handle(req:Request, res:Response){
        const {apartment_id} = req.body;

        const setPaymentServices = new SetPaymentServices();
        const payments = await setPaymentServices.execute({
            apartment_id
        })

        return res.json(payments)
    }
}

export {SetPaymentController}