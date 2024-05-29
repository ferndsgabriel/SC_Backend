import { Request, Response } from "express";
import { ReportUserServices } from "../../Services/user/ReportUserServices";

class ReportUserController{
    async handle(req:Request, res:Response){
        const {message, option} = req.body;
        const id = req.user_id;

        const reportUserServices = new ReportUserServices();
        const reportUser = await reportUserServices.execute({
            id, message, option
        });

        return res.json(reportUser);
    }
}

export {ReportUserController}