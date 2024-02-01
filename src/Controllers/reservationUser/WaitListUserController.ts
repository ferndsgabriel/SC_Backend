import { WaitListUserService } from "../../Services/reservationUser/WaitListUserService";
import { Request, Response } from "express";

class WaitListUserController{
    async handle(req:Request, res:Response){
        const user_id = req.user_id;
        const {date} = req.body;

        const waitListUserService =  new WaitListUserService();
        const waitList = await waitListUserService.execute({
            user_id,
            date
        });

        return res.json(waitList);
    }
}

export {WaitListUserController}