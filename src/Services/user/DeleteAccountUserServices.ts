import prismaClient from "../../prisma";
import { compare } from "bcryptjs";

interface UserDeleteProps{
    id: string;
    pass: string;
}

class DeleteAccountUserServices{
    async execute({id, pass}:UserDeleteProps){

        if (!id || !pass){
            throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
        }

        const user = await prismaClient.user.findFirst({
            where:{
                id:id
            }
        })

        if (!user){
            throw new Error('Usuário inválido.');
        }
        const passIsCorrect = await compare (pass, user.pass);

        if (!passIsCorrect){
            throw new Error('Senha incorreta.');
        }
        
        const thereWaitList = await prismaClient.waitingList.findFirst({
            where:{
                user_id:id
            }
        });

        if (thereWaitList){
            const deleteAllList = await prismaClient.waitingList.deleteMany({
                where:{
                    user_id:id
                }
            })
        };
        
        const deleteAccount = await prismaClient.user.delete({
            where:{
                id:id
            }
        });
    }
}
export {DeleteAccountUserServices}