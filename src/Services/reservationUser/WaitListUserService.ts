import prismaClient from "../../prisma"

interface waitListProps{
    user_id:string,
    date:number
}

class WaitListUserService{
    async execute({user_id, date}:waitListProps){

        if (!date ||  !user_id ){
            throw new Error ('Digite todos os dados!');
        }

        const userExist = await prismaClient.user.findFirst({
            where:{
                id:user_id
            },select:{
                email:true,
                phone_number:true,
                name:true,
                lastname:true,
                apartment:{
                    select:{
                        id:true,
                        tower_id:true
                    }
                }
            }
        });

        if (!userExist){
            throw new Error ('O usuário não existe!');
        }

        const reservationExist = await prismaClient.reservation.findFirst({
            where:{
                date:date,
                apartment:{
                    tower_id:userExist.apartment.tower_id
                }
            }
        });

        if (!reservationExist){
            throw new Error ('A reserva não existe!');
        }

        const noRepeat = await prismaClient.waitingList.findFirst({
            where:{
                date:date,
                user_id:user_id
            }
        });

        if (noRepeat){
            throw new Error ('Você já está nesta lista de reserva!');
        }

        const awaitList = await prismaClient.waitingList.create({
            data:{
                user_id:user_id,
                date:date
            }
        });

        return awaitList


    }
}

export {WaitListUserService}