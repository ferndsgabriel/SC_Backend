import { Request, Response } from "express";
import { MyReservationsUserServices } from "../../Services/reservationUser/MyReservationsUserServices";

class MyAgendamentosUserController{
    async handle(req:Request, res:Response){
        const user_id = req.user_id
        const myReservationsUserServices = new MyReservationsUserServices();
        const myReservations = await myReservationsUserServices.execute({
            user_id
        });

        return res.json(myReservations)
    }
}

export {MyAgendamentosUserController}