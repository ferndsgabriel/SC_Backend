import { Request, Response } from "express";
import { ListAllTaxedAgendamentoServices } from "../../Services/reservationAdm/ListAllTaxedAgendamentoServices";

class ListAllTaxedAgendamentoController{
    async handle(req:Request, res:Response){
        const listAllTaxedAgendamentoServices = new ListAllTaxedAgendamentoServices();
        const listAll = await listAllTaxedAgendamentoServices.execute();
        return res.json(listAll);
    }
}

export {ListAllTaxedAgendamentoController}