import { Request, Response } from "express";
import { GuestAddServices } from "../../Services/reservationUser/GuestAddServices";

class GuestAddController{
    async handle(req:Request, res:Response){
        const user_id = req.user_id;
        const {reservation_id, guest} = req.body
        const guestAddServices = new GuestAddServices();
        const addConvidados = await guestAddServices.execute({
            reservation_id, guest, user_id
        })

        return res.json(addConvidados);
    }
}

export {GuestAddController}