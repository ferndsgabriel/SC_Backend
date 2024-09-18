import { Request, Response } from "express";
import { ChangePassAdmServices } from "../../Services/adm/ChangePassAdmServices";

class ChangePassAdmControlller{
    async handle(req:Request, res:Response){
        const id = req.adm_id;
        const {pass, newPass} = req.body;
        const changePassAdmServices = new ChangePassAdmServices();
        const changePass = await changePassAdmServices.execute({
            id, pass, newPass
        })
        return res.json({ok:true})
    }
}

export {ChangePassAdmControlller}