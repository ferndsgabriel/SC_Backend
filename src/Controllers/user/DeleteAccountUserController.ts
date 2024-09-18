import { Request, Response } from "express";
import { DeleteAccountUserServices } from "../../Services/user/DeleteAccountUserServices";

class DeleteAccountUserController{
    async handle(req:Request, res:Response){
        const id = req.user_id;
        const {pass} = req.body;
        const deleteAccountUserServices = new DeleteAccountUserServices();
        const deleteAccount = await deleteAccountUserServices.execute({
            id, pass
        })

        return res.json(deleteAccount);
    }

}
export {DeleteAccountUserController}