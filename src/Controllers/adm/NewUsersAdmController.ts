import { Request, Response } from "express";
import { NewUsersAdmServices } from "../../Services/adm/NewUsersAdmServices";

class NewUsersAdmController{
    async handle (req:Request, res:Response){
        const newUsersAdmServices = new NewUsersAdmServices();
        const newUsers = await newUsersAdmServices.execute();

        return res.json(newUsers);
    }
}

export {NewUsersAdmController}