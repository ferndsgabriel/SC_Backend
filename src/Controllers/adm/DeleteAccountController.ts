import { Request, Response } from "express";
import { DeleteAccountServices } from "../../Services/adm/DeleteAccountServices";

class DeleteAccountController{
    async handle(req:Request, res:Response){
        const id = req.adm_id;
        const {pass} = req.body;
        const deleteAccountServices = new DeleteAccountServices();
        const deleteAccount = await deleteAccountServices.execute({
            id, pass
        })

        return res.json({ok: true})

    }
}

export {DeleteAccountController}