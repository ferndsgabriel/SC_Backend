import { Request, Response } from "express";
import { ListTowersUsersServices } from "../../Services/user/ListTowersAdmServices";

class ListTowersUserController{
    async handle(req:Request, res:Response){
        const listTowersUsersServices  = new ListTowersUsersServices ();
        const listTowers = await listTowersUsersServices.execute();

        return res.json(listTowers);
    }
}

export {ListTowersUserController};