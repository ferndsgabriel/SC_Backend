import { Request, Response } from "express";
import { RecoveryEmailServices } from "../../Services/user/RecoveryEmailServices";

class  RecoveryEmailController{
    async handle(req:Request, res:Response){
        const {phone_number} = req.body;
        const recoveryEmailServices = new RecoveryEmailServices();
        const recoveryEmail = await recoveryEmailServices.execute({phone_number});

        return res.json(recoveryEmail);
    }
}

export {RecoveryEmailController}