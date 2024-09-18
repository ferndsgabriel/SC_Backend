import { randomUUID } from "crypto";
import prismaClient from "../../prisma";
import { compare, hash } from "bcryptjs";

interface userProps{
    id:string;
    pass:string;
    newPass:string;
}

class ChangePassUserServices{
    async execute({id, pass, newPass}:userProps){
        
        if (!id || !pass || !newPass ){
            throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
        }

        const user = await prismaClient.user.findFirst({
            where:{
                id:id
            },select:{
                dateChangePass:true,
                pass:true
            }
        })

        if (!user){
            throw new Error ('User invalido');
        }

        if (pass === newPass){
            throw new Error('Senha nova igual à antiga.');
        }

        const onDay = new Date();

        if (onDay < user.dateChangePass){
            throw new Error('Você já alterou sua senha nos últimos 30 dias.');
        }
        const isMyPass = await compare (pass, user.pass);

        if (!isMyPass){
            throw new Error('Senha inválida.');
        }

        const passHash = await hash (newPass, 8);
        
        const dateChangePass = new Date();
        dateChangePass.setDate(dateChangePass.getDate()+30);


        const uuid = randomUUID();

        const newPassword = await prismaClient.user.update({
            where:{
                id:id
            },data:{
                pass:passHash,
                dateChangePass:dateChangePass,
                sessionToken: uuid,
            }
        });
        
        return {ok:true}
        
    }
        
}
export {ChangePassUserServices}