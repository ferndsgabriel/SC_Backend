import { Request, Response } from "express";
import { CreateUserService } from "../../Services/user/CreateUserService";

class CreateUserController{
    async handle(req:Request, res:Response){
        
        const { email, name, apartament_id, cpf, pass, lastname, phone_number}  = req.body;
        const createUserService = new CreateUserService();
        const user = await createUserService.execute({
            email, name, apartament_id, cpf, pass, lastname, phone_number
        })

        return res.json(user);
    }
}

export {CreateUserController}