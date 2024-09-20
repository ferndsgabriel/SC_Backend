import { FilterOldReservationsServices } from "../../Services/concierge/FilterOldReservationsServices";
import { Request, Response } from "express";

class FilterOldReservationsController{
    async handle(req:Request, res:Response){
        const per_page = req.query.per_page as string;
        const page =  req.query.page as string;
        
        const filterReservationsServices = new FilterOldReservationsServices();
        const response = await filterReservationsServices.execute({
            per_page,
            page
        });
        return res.json(response);
    }
}
export {FilterOldReservationsController}