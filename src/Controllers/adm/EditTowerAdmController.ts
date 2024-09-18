import { EditTowerAdmServices } from "../../Services/adm/EditTowerAdmServices";
import { Request, Response } from "express";

class EditTowerAdmController{
    async handle(req:Request, res:Response){
        const {tower_id, newTower} = req.body
        const editTowerAdmServices = new EditTowerAdmServices();
        const editTower = await editTowerAdmServices.execute({
            tower_id, newTower
        })

        return res.json(editTower);
    }
    
}

export {EditTowerAdmController}