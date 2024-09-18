import { Request, Response } from "express";
import { AuthUserServices } from "../../Services/user/AuthUserServices";

class AuthUserController{
    async handle(req:Request, res:Response){
        const {pass, email} = req.body;
        const authorizationHeader = req.headers.authorization;

        const authUserServices = new AuthUserServices();
        
        const user = await authUserServices.execute({
            pass ,email,
        })

        res.json (user);


    }
}

export {AuthUserController}