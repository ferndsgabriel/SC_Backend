import { randomUUID } from "crypto";
import prismaClient from "../../prisma";
import { compare, hash } from "bcryptjs";

interface admProps{
    id:string;
    pass:string;
    newPass:string;
}

class ChangePassAdmServices{
    async execute({id, pass, newPass}:admProps){
        
        if (!id || !pass || !newPass ){
            throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
        }

        const adm = await prismaClient.adm.findFirst({
            where:{
                id:id
            },select:{
                dateChangePass:true,
                pass:true
            }
        })

        if (!adm){
            throw new Error ('User invalido');
        }

        if (pass === newPass){
            throw new Error('Senha nova igual à antiga.');
        }

        const onDay = new Date();

        if (onDay < adm.dateChangePass){
            throw new Error('Você já alterou sua senha nos últimos 30 dias.');
        }
        const isMyPass = await compare (pass, adm.pass);

        if (!isMyPass){
            throw new Error('Senha inválida.');
        }

        const passHash = await hash (newPass, 8);
        
        const dateChangePass = new Date();
        dateChangePass.setDate(dateChangePass.getDate()+30);

        const uuid = randomUUID();

        const newPassword = await prismaClient.adm.update({
            where:{
                id:id
            },data:{
                pass:passHash,
                dateChangePass:dateChangePass,
                sessionToken:uuid
            }
        });

        return ({ok:true});
        
    }
        
}
export {ChangePassAdmServices}