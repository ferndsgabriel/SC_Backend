import { FilterFutureReservationsServices } from "../../Services/concierge/FilterFutureReservationsServices";
import { Request, Response } from "express";

class FilterFutureReservationsController{
    async handle(req:Request, res:Response){
        const per_page = req.query.per_page as string;
        const page =  req.query.page as string;
        
        const filterReservationsServices = new FilterFutureReservationsServices();
        const response = await filterReservationsServices.execute({
            per_page,
            page
        });
        return res.json(response);
    }
}
export {FilterFutureReservationsController}