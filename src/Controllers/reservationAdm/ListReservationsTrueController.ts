import { Request, Response } from "express";
import { ListReservationsTrueServices } from "../../Services/reservationAdm/ListReservationsTrueServices";

class ListReservationsTrueController{
    async handle(req:Request, res:Response){
        const listReservationsTrue  = new ListReservationsTrueServices();
        const reservationsTrue = await listReservationsTrue.execute();

        return res.json(reservationsTrue);
    }
    
}

export {ListReservationsTrueController}