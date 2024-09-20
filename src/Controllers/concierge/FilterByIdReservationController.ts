import { Request, Response } from "express";
import { FilterByIdReservationServices } from "../../Services/concierge/FilterByIdReservationServices";
class FilterByIdReservationController{
    async handle(req:Request, res:Response){
        const reservation_id = req.query.id as string;

        const filterByID = new FilterByIdReservationServices();
        const response = await filterByID.execute(
            reservation_id
        );
        
        return res.json(response);
    }
}

export {FilterByIdReservationController}