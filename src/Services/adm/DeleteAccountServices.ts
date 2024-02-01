import prismaClient from "../../prisma";
import { compare } from "bcryptjs";

interface admProps{
    id: string;
    pass:string
}

class DeleteAccountServices{

    async execute({id, pass}:admProps){
        if (!id || !pass ){
            throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
        }

        const adm = await prismaClient.adm.findFirst({
            where:{
                id:id
            }
        })
        if (!adm){
            throw new Error('Usuário inválido.');
        }

        const isMyPass = await compare(pass, adm.pass);

        if (!isMyPass){
            throw new Error('Senha incorreta.');
        }
        const allTokens = await prismaClient.token.findMany({
            where: {
                adm_id: id
            }
        });

        const updateTokenStatus = await prismaClient.token.deleteMany({
            where:{
                adm_id:id
            }
        });

        const deleteAdm = await prismaClient.adm.delete({
            where:{
                id:id
            }
        })
        
    }
}
export {DeleteAccountServices}