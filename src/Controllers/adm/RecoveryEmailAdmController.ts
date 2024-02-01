import { Request, Response } from "express";
import { RecoveryEmailAdmServices } from "../../Services/adm/RecoveryEmailAdmServices";
class  RecoveryEmailAdmController{
    async handle(req:Request, res:Response){
        const {phone_number} = req.body;
        const recoveryEmailServices = new RecoveryEmailAdmServices();
        const recoveryEmail = await recoveryEmailServices.execute({phone_number});

        return res.json(recoveryEmail);
    }
}

export {RecoveryEmailAdmController}