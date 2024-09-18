import { Request, Response } from "express";
import { ListAptUserServices } from "../../Services/user/ListAptUserServices";

class  ListAptUserController{
    async handle(req:Request, res:Response){
        const listAptUserServices  = new ListAptUserServices ();
        const apt = await listAptUserServices.execute();

        return res.json(apt);
    }
}

export { ListAptUserController}