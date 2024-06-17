import { Request, Response } from "express";
import DashboardAdmServices from "../../Services/adm/DashboardAdmServices";

class DashboardAdmController{
    async handle(req:Request, res:Response){
        const dashboardAdmServices = new DashboardAdmServices();
        const dashboardAdm = dashboardAdmServices.execute();
        return res.json(dashboardAdm)
    }
}

export default DashboardAdmController;