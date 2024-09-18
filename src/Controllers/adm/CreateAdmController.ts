import { Request, Response } from "express";
import { CreateAdmServices } from "../../Services/adm/CreateAdmServices";

class CreateAdmController{
    async handle (req:Request, res:Response){
        const {email, pass,cod, name, lastname, phone_number} = req.body;

        const createAdmServices = new CreateAdmServices();
        const adm = await createAdmServices.execute({
            email,
            pass,
            name,
            lastname,
            phone_number,
            cod      
        })

        return res.json (adm)
    }
}

export {CreateAdmController}