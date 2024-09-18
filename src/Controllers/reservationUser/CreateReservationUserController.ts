import { Request, Response } from "express";
import { CreateReservationUserServices } from "../../Services/reservationUser/CreateReservationUserServices";

class CreateReservationUserController{
    async handle(req:Request, res:Response){
        const user_id = req.user_id;
        const { date, cleaning,start,finish, } = req.body;
        
        const createReservationUserServices = new CreateReservationUserServices();
        const createReservation = await createReservationUserServices.execute({
            date, cleaning,start,finish, user_id
        })

        return res.json(createReservation);
    }
}

export {CreateReservationUserController}