import prismaClient from "../../prisma";

interface IdRequest{
    reservation_id: string
}

class ListGuestServices{
    async execute({ reservation_id}:IdRequest){
        if (! reservation_id){
            throw new Error ("Digite a reserva!");
        }

        const listGuest = await prismaClient.reservation.findFirst({
            where:{
                id: reservation_id,
            },
            select: {
                id:true,
                date:true,
                start:true,
                finish:true,
                cleaningService:true,
                name:true,
                email:true,
                phone_number:true,
                guest:true,
                apartment:{
                    select:{
                        id:true,
                        numberApt:true,
                        payment:true,
                        user:{
                        select:{
                            name:true,
                            lastname:true,
                            email:true,
                            phone_number:true
                        }
                        },
                        tower:{
                        select:{
                            id:true,
                            numberTower:true
                        }
                        }
                    }
                    }
                },orderBy:{
                    date:'asc'
                }
        })

        if (!listGuest){
            throw new Error('Reserva não encontrada.');
        }
        
        return listGuest

    }
}

export {ListGuestServices}