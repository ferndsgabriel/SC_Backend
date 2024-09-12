import { Request, Response } from "express";
import { GuestAddServices } from "../../Services/reservationUser/GuestAddServices";

class GuestAddController{
    async handle(req:Request, res:Response){

        const {createGuest} = req.body

        const guestAddServices = new GuestAddServices();
        const addConvidados = await guestAddServices.execute(
            createGuest
        )

        return res.json(addConvidados);
    }
}

export {GuestAddController}