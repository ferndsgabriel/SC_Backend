import { Request, Response } from "express";
import { AuthAdmServices } from "../../Services/adm/AuthAdmServices";

class AuthAdmController{
    async handle (req:Request, res:Response){
        const {email, pass} = req.body;

        const authAdmServices = new AuthAdmServices();
        const adm = await authAdmServices.execute({
            email,
            pass
        })

        return res.json (adm)
    }
}

export {AuthAdmController}