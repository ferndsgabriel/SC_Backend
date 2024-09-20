import { Request, Response } from "express";
import { AuthConciergeServices } from "../../Services/concierge/AuthConciergeServices";

class AuthConciergeController{
    async handle(req:Request, res:Response){
        const {cod} = req.body;

        const authConciergeServices = new AuthConciergeServices();
        const response = await authConciergeServices.execute(
            cod
        );
        return res.json(response);
    }
}
export {AuthConciergeController};