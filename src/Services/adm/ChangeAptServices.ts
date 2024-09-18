import prismaClient from "../../prisma";

interface newApt{
    apartment_id:string,
    user_id:string
}

class ChangeAptServices{
    async execute({apartment_id, user_id}:newApt){

        if (!apartment_id || !user_id){
            throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
        }

        const userExist = await prismaClient.user.findFirst({
            where:{
                id:user_id
            }
        })

        if (!userExist){
            throw new Error('O usuário não foi encontrado.');

        } // se não existe user...


        const aptExist = await prismaClient.apartment.findFirst({
            where:{
                id:apartment_id
            }

        })
        if (!aptExist){
            throw new Error('Apartamento inexistente.');
        } // se não existe user...

        const updateApt = await prismaClient.user.update({
            where:{
                id:user_id
            },
            data:{
                apartment_id:apartment_id
            }
        }) // se existe vou poder atualizar 

        return updateApt
    }
}

export {ChangeAptServices}