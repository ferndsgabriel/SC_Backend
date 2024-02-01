import { RecoveryPassUserServices } from "../../Services/user/RecoveryPassUserServices";
import { Request, Response } from "express"; 
import prismaClient from "../../prisma";

class RecoveryPassUserController{
    async handle(req:Request, res:Response){
        const { pass, cod, phone_number} = req.body;
        const recoveryPassUserServices = new RecoveryPassUserServices();
        const recoveryPass = await recoveryPassUserServices.execute({ pass, cod, phone_number
        })

        return res.json(recoveryPass);
    }
}

export {RecoveryPassUserController}