import { Request, Response } from "express";
import { AvaliationUserServices } from "../../Services/reservationUser/AvaliationUserServices";

class AvaliationUserController{
    async handle(req:Request, res:Response){
        const {reservation_id, ease, space, time, hygiene } = req.body;
        const avaliationUserServices = new AvaliationUserServices();
        const avaliation = await avaliationUserServices.execute({
            reservation_id, ease, space, time, hygiene
        });

        return res.json(avaliation);
    }
}

export {AvaliationUserController}