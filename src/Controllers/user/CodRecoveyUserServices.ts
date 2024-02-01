import { Request, Response } from "express";
import { CodRecoveyUserServices } from "../../Services/user/CodRecoveyUserServices";
class CodRecoveyUserController{

    async handle(req:Request, res:Response){
        const {phone_number} = req.body
        const recoveryPassUserServices = new CodRecoveyUserServices();
        const recoveryPass = await recoveryPassUserServices.execute({phone_number});

        return res.json(recoveryPass);
    }
}
export {CodRecoveyUserController}