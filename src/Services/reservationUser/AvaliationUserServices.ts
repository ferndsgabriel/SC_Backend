import prismaClient from "../../prisma";

type avaliationProps = {
    reservation_id:string;
    rating:number,
    iWas:boolean
}

class AvaliationUserServices{
    async execute({reservation_id, rating, iWas}:avaliationProps){
        const getReservation = await prismaClient.reservation.findFirst({
            where:{
                id:reservation_id
            }
        });
        if (!getReservation){
            throw new Error('Reserva não encontrada.');
        }
        const updateReservation = await prismaClient.reservation.update({
            where:{
                id:reservation_id
            },data:{
                iWas:iWas,
            }
        })
        const createAvaliation = await prismaClient.avaliations.create({
            data:{
                value:rating,
                reservation_id:reservation_id
            }
        });

        return ({ok:true});
    };
    
}

export {AvaliationUserServices}