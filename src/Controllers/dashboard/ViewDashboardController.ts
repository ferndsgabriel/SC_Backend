import { Request, Response } from "express";
import { ViewDashboardServices } from "../../Services/dashboard/ViewDashboardServices";

class ViewDashboardController{
    async handle(req:Request, res:Response){
        const {period} = req.body;
        const viewDashboardServices = new ViewDashboardServices();
        const viewDashBoard = await viewDashboardServices.execute({
            period
        });
        return res.json(viewDashBoard);
    }
}

export {ViewDashboardController}