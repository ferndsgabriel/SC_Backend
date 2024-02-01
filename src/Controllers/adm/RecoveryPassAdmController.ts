import { RecoveryPassAdmServices } from "../../Services/adm/RecoveryPassAdmServices";
import { Request, Response } from "express"; 


class RecoveryPassAdmController{
    async handle(req:Request, res:Response){
        const {cod, pass, phone_number} = req.body;
        const recoveryPassAdmServices = new RecoveryPassAdmServices();
        const recoveryPass = await recoveryPassAdmServices.execute({cod, pass, phone_number
        })

        return res.json(recoveryPass);
    }
}

export {RecoveryPassAdmController}