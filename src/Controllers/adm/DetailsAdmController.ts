import { DetailsAdmServices } from "../../Services/adm/DetailsAdmServices";
import { Request, Response } from "express-serve-static-core";
class DetailsAdmController{
    async handle(req:Request, res:Response){

        const id = req.adm_id;
        const detailsAdmServices = new DetailsAdmServices();
        const details = await detailsAdmServices.execute({
            id
        })

        return res.json (details)
    }
}

export {DetailsAdmController}