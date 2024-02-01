import { Request, Response } from "express"
import { DeleteReservationAdmServices } from "../../Services/reservationAdm/DeleteReservationAdmServices";

class DeleteReservationAdmController{
    async handle(req:Request, res:Response){
        const {reservation_id} = req.body;
        const deleteReservationAdmServices = new DeleteReservationAdmServices();
        const deleteReservation = await deleteReservationAdmServices.execute({
            reservation_id
        });

        return res.json(reservation_id);
    }
}   

export {DeleteReservationAdmController}