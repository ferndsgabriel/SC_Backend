import { DeleteAptAdmServices } from "../../Services/adm/DeleteAptAdmServices";
import { Request, Response } from "express";

class DeleteAptAdmController{
    async handle (req:Request, res:Response){
        const {apartment_id} = req.body;
        const deleteAptAdmServices = new DeleteAptAdmServices();
        const deleteApt = await deleteAptAdmServices.execute({
            apartment_id
        })

        return res.json(deleteApt);
    }
}

export {DeleteAptAdmController}