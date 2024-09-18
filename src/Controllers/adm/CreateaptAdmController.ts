import { Request, Response } from "express";
import { CreateaptAdmServices } from "../../Services/adm/CreateaptAdmServices";

class CreateaptAdmController{
    async handle(req:Request, res:Response){
        const {numberApt, tower} = req.body;

        const createaptAdmServices = new CreateaptAdmServices();
        const createApt = await createaptAdmServices.execute({
            numberApt, tower
        })

        return res.json (createApt)
    }
}

export {CreateaptAdmController}