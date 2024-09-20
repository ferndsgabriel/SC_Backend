import { Request, Response } from "express";
import { SetPresenceGuestServices } from "../../Services/concierge/SetPresenceGuestServices";
class SetPresenceGuestController{
    async handle(req:Request, res:Response){

        const {id, value} = req.body;

        const setPresence = new SetPresenceGuestServices();
        const response = await setPresence.execute({
            id, value
        });
        return res.json(response);
    }
}

export {SetPresenceGuestController}