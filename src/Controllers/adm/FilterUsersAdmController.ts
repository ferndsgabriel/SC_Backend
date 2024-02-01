import { Request, Response } from "express";
import {FilterUsersAdmServices } from "../../Services/adm/FilterUsersAdmServices";

class FilterUsersAdmController{
    async handle (req:Request, res:Response){
        const filterUsersAdmServices = new FilterUsersAdmServices();
        const users = await filterUsersAdmServices.execute();

        return res.json(users);
    }
}

export {FilterUsersAdmController}