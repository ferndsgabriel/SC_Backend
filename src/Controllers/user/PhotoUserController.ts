import { Request, Response } from "express";
import { PhotoUserServices } from "../../Services/user/PhotoUserServices";

class PhotoUserController{
    async handle(req:Request, res:Response){

        const id = req.user_id

        const {firebaseUrl}:any = req.file ? req.file : ''
        if (!req.file ) {
            throw new Error('Imagem não localizada!');
        }

        const photoUserServices = new PhotoUserServices();
        const photoservices = await photoUserServices.execute({
            id,
            image:firebaseUrl
        });

        return res.json(photoservices);
    }
    
}

export {PhotoUserController}