import { Request, Response } from "express";
import { DeleteReservationUserServices } from "../../Services/reservationUser/DeleteReservationUserServices";

class DeleteReservationUserController{
    async handle(req:Request, res:Response){
        const {reservation_id} = req.body;
        const user_id = req.user_id
        const deleteReservationUserServices = new DeleteReservationUserServices();
        const deleteReservation = await deleteReservationUserServices.execute({
            reservation_id,
            user_id
        })

        return res.json (deleteReservation)
    }
}

export {DeleteReservationUserController}