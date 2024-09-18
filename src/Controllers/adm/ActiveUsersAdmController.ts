import { Request, Response } from "express";
import { ActiveUsersAdmServices } from "../../Services/adm/ActiveUsersAdmServices";

class ActiveUsersAdmController{
    async handle(req:Request, res:Response){
        const {id, accountStatus} = req.body; 
        const activeUserServices = new ActiveUsersAdmServices();
        const users = await activeUserServices.execute({
            id, accountStatus
        })

        return res.json(users);
    }
}

export {ActiveUsersAdmController}