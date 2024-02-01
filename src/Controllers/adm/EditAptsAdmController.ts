import { EditAptsAdmServices } from "../../Services/adm/EditAptsAdmServices";
import { Request, Response } from "express";

class EditAptsAdmController{
    async handle(req:Request, res:Response){
        const {apartment_id, newApt} = req.body;
        const editAptsAdmServices = new EditAptsAdmServices;
        const editApts = await editAptsAdmServices.execute({
            apartment_id, newApt
        })

        return res.json (editApts);
    }

}

export {EditAptsAdmController}