import { Request, Response } from "express";
import { SetNewReservationServices } from "../../Services/reservationAdm/SetNewReservationServices";

class SetNewReservationController {
    async handle(req:Request, res:Response){
        const {reservation_id, status} = req.body;

        const setNewReservationServices = new SetNewReservationServices();
        const  setNewReservation = await setNewReservationServices.execute({
            reservation_id, status
        })

        return res.json(setNewReservation);
    }
}

export {SetNewReservationController}