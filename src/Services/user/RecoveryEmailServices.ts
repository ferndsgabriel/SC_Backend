import prismaClient from "../../prisma";
import { FormatPhone } from "../../utils/FormatPhone";
import { SendAlertsUser } from "../../utils/SendAlertsUser";

interface recovery{
    phone_number:string
}

class RecoveryEmailServices{
    async execute({phone_number}:recovery){
        if (!phone_number){
            throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
        }
        
        const user = await prismaClient.user.findFirst({
            where: {
                phone_number: FormatPhone(phone_number),
            },
        });

        if(!user){
            throw new Error('Usuário inválido.');
        }

        const mensagem = `Seu endereço de email é: ${user.email}`

        SendAlertsUser(phone_number, mensagem );

        return ({ok:true})
    }
}

export {RecoveryEmailServices}