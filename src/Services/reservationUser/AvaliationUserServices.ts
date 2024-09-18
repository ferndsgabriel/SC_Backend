import prismaClient from "../../prisma";

type avaliationProps = {
    reservation_id:string;
    ease:number,
    space:number,
    time:number,
    hygiene:number
}

class AvaliationUserServices{
    async execute({reservation_id, ease, space, time, hygiene}:avaliationProps){

        
        if (!reservation_id || ease < 0 || space < 0 || time < 0 || hygiene < 0 ){
            throw new Error ("Preencha todos os campos")
        }
        if ( ease > 5 || space > 5 || time > 5 || hygiene > 5 ){
            throw new Error ("Avaliação inválida");
        }

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
                isEvaluated:true,
            }
        })
        const createAvaliation = await prismaClient.avaliations.create({
            data:{
                reservation_id:reservation_id,
                ease:ease,
                hygiene:hygiene,
                time:time,
                space:space
            }
        });

        return ({ok:true});
    };
    
}

export {AvaliationUserServices}