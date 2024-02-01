import { Request, Response } from "express";
import { DateUnavailableServices } from "../../Services/reservationUser/DateUnavailableServices";

class DateUnavailableController{
    async handle(req:Request, res:Response){
        const user_id = req.user_id 
        const dateUnavailableServices = new DateUnavailableServices();
        const dateUnavailable = await dateUnavailableServices.execute({user_id});

        return res.json(dateUnavailable);
    }
    
}

export {DateUnavailableController}