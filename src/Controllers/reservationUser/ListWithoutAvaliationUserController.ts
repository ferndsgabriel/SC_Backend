import { Request, Response } from "express";
import { ListWithoutAvaliationUserServices } from "../../Services/reservationUser/ListWithoutAvaliationUserServices";

class ListWithoutAvaliationUserController{
    async handle(req:Request, res:Response){
        const user_id = req.user_id
        const myReservationsUserServices = new ListWithoutAvaliationUserServices();
        const myReservations = await myReservationsUserServices.execute({
            user_id
        });

        return res.json(myReservations)
    }
}

export {ListWithoutAvaliationUserController}