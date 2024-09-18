import { DeletePhotoUserService } from "../../Services/user/DeletePhotoUserService";
import { Request, Response } from "express";

class DeletePhotoUserController{
    async handle(req:Request, res:Response){
        const id = req.user_id
        const deletePhotoUserService = new DeletePhotoUserService();
        const deletePhone = await deletePhotoUserService.execute({
            id,
        })
        return res.json (deletePhone)
    }
}

export {DeletePhotoUserController}