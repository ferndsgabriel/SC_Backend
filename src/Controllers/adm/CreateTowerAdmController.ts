import { Request, Response } from "express";
import { CreateTowerAdmServices } from "../../Services/adm/CreateTowerAdmServices";

class CreateTowerAdmController{
    async handle(req:Request, res:Response){
        const { numberTower} = req.body
        const createTowerAdmServices = new CreateTowerAdmServices();
        const createTower = await createTowerAdmServices.execute({
            numberTower
        })

        return res.json(numberTower);
    }
}

export {CreateTowerAdmController}