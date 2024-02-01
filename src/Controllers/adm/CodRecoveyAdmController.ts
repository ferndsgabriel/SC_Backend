import { Request, Response } from "express";
import { CodRecoveyAdmServices } from "../../Services/adm/CodRecoveyAdmServices";

class CodRecoveyAdmController{
    async handle(req:Request, res:Response){
        const {phone_number} = req.body
        const recoveryPassAdmServices = new CodRecoveyAdmServices();
        const recoveryPass = await recoveryPassAdmServices.execute({phone_number});
        return res.json(recoveryPass);
    }
}
export {CodRecoveyAdmController}