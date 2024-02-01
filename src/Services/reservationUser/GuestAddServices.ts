import prismaClient from "../../prisma";

interface GuestRequest{
    reservation_id: string
    guest: string;
    user_id:string
}

class GuestAddServices{
    async execute({reservation_id, guest, user_id}:GuestRequest){

        if (!reservation_id || !guest || !user_id){
            throw new Error ('Envie todos os dados');
        }

        const userExist = await prismaClient.user.findFirst({
            where:{
                id:user_id
            },select:{
                apartment_id:true
            }
        });

        if (!userExist){
            throw new Error ('Usuário não encontrado :(');
        }

        const addConvidados = await prismaClient.reservation.update({
            where:{
                id:reservation_id,
                apartment_id:userExist.apartment_id
            },data:{
                guest:guest
            }
        })

        return addConvidados;
    }
}

export {GuestAddServices}