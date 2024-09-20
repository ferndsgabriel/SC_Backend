import { FilterTodayReservationsServices } from "../../Services/concierge/FilterTodayReservationsServices";
import { Request, Response } from "express";

class FilterTodayReservationsController{
    async handle(req:Request, res:Response){   
        const filterReservationsServices = new FilterTodayReservationsServices();
        const response = await filterReservationsServices.execute();
        return res.json(response);
    }
}
export {FilterTodayReservationsController}