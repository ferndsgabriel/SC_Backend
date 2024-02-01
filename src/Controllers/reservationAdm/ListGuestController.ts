import { Request, Response } from "express";
import { ListGuestServices } from "../../Services/reservationAdm/ListGuestServices";

class ListGuestController{
    async handle(req:Request, res:Response){
        const { reservation_id} = req.body;
        const listGuestServices = new ListGuestServices();
        const listguest = await listGuestServices.execute({
             reservation_id
        })

        return res.json(listguest)
    }
}

export {ListGuestController}