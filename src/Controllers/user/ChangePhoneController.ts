import { Request, Response } from "express";
import { ChangePhoneServices } from "../../Services/user/ChangePhoneServices";

class ChangePhoneController{
    async handle (req:Request, res: Response){

    const {number} = req.body
    const id = req.user_id;

    const changePhoneServices = new ChangePhoneServices();
    const phone = await changePhoneServices.execute({
        number, id
    })
    res.json(phone)
    }
}
export {ChangePhoneController}
