import { Request, Response } from "express"
import { DeleteTowerAdmServices } from "../../Services/adm/DeleteTowerAdmServices";

class DeleteTowerAdmController{
    async handle(req:Request, res:Response){
        const {tower_id} = req.body;
        const deleteTowerAdmServices = new DeleteTowerAdmServices();
        const deleteTower = await deleteTowerAdmServices.execute({
            tower_id
        });
        
        return res.json(deleteTower)
    }
}
export {DeleteTowerAdmController}