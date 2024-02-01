import { Request, Response } from "express";
import { NewReservationsAdmServices } from "../../Services/reservationAdm/NewReservationsAdmServices"; 
import prismaClient from "../../prisma";

class NewReservationsAdmController{
    async handle(req:Request, res:Response){
        const {tower_id} = req.body;
        const newReservationsAdmServices = new NewReservationsAdmServices();
        const newReservations = await newReservationsAdmServices.execute();

        return res.json(newReservations);
    }
    
}

export {NewReservationsAdmController}