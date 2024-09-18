import { Request, Response } from "express";
import { ChangeAptServices } from "../../Services/adm/ChangeAptServices";

class ChangeAptControler{
    async handle(req:Request, res:Response){
    const {apartment_id, user_id} = req.body
    const changeAptServices = new ChangeAptServices();
    const changeApt = await changeAptServices.execute({
        apartment_id, user_id
        })

        return res.json(changeApt);
    }
}

export {ChangeAptControler}