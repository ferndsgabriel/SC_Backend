import { Request, Response } from "express";
import { PhotoUserServices } from "../../Services/user/PhotoUserServices";

class PhotoUserController{
    async handle(req:Request, res:Response){

        const id = req.user_id
        const photoUserServices = new PhotoUserServices();

        try {
            if (!req.file) {
                throw new Error("Envie uma imagem");
            } else {
                const { originalname, filename: perfil, buffer: foto } = req.file;
                const setPerfil = await photoUserServices.execute({
                    id, perfil, foto
                });
                return res.json(setPerfil);
            }
        } catch (error) {
            // Lide com o erro, por exemplo, enviando uma resposta de erro ao cliente.
        } finally {
            // Limpe a memória independentemente do resultado
            if (req.file && req.file.buffer) {
                req.file.buffer = null;
            }
        }
    }
    
}

export {PhotoUserController}