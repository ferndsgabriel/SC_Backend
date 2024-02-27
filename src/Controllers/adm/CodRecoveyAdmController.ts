import { Request, Response } from "express";
import { CodRecoveyAdmServices } from "../../Services/adm/CodRecoveyAdmServices";

class CodRecoveyAdmController{
    async handle(req:Request, res:Response){
        const {email} = req.body
        const recoveryPassAdmServices = new CodRecoveyAdmServices();
        const recoveryPass = await recoveryPassAdmServices.execute({email});
        return res.json(recoveryPass);
    }
}
export {CodRecoveyAdmController}