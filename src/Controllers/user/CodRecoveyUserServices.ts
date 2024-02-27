import { Request, Response } from "express";
import { CodRecoveyUserServices } from "../../Services/user/CodRecoveyUserServices";
class CodRecoveyUserController{

    async handle(req:Request, res:Response){
        const {email} = req.body
        const recoveryPassUserServices = new CodRecoveyUserServices();
        const recoveryPass = await recoveryPassUserServices.execute({email});

        return res.json(recoveryPass);
    }
}
export {CodRecoveyUserController}