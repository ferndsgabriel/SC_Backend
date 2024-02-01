import prismaClient from "../../prisma";
import { FormatPhone } from "../../utils/FormatPhone";
import { SendAlertsAdm } from "../../utils/SendAlertsAdm";

interface recovery{
    phone_number:string
}

class RecoveryEmailAdmServices{
    async execute({phone_number}:recovery){

        if (!phone_number){
            throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
        }

        const adm = await prismaClient.adm.findFirst({
            where: {
                phone_number: FormatPhone(phone_number),
            },
        });

        if(!adm){
            throw new Error('Usuário inválido.');
        }

        SendAlertsAdm(phone_number, `Seu endereço de email é: ${adm.email}`);

        return ({ok:true})
    }
}

export {RecoveryEmailAdmServices}