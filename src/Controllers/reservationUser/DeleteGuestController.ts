import { Request, Response } from "express";
import { DeleteGuestServices } from "../../Services/reservationUser/DeleteGuestServices";

class DeleteGuestController{
    async handle(req:Request, res:Response){

        const {deleteGuest} = req.body

        const guestDelete = new DeleteGuestServices();
        const response = await guestDelete.execute(
            deleteGuest
        )

        return res.json(response);
    }
}

export {DeleteGuestController}