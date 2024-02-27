import prismaClient from "../../prisma";
import { SendEmail } from "../../utils/SendEmail";

interface AgendamentoRequest{
    reservation_id:string;
    status: boolean;
}

class SetNewReservationServices{
    async execute({reservation_id, status}:AgendamentoRequest){

    
        const idReservation = await prismaClient.reservation.findFirst({
            where: {
                id: reservation_id
            },
            select: {
                start: true,
                finish: true,
                date: true,
                apartment: {
                    select: {
                        id: true,
                        tower_id: true
                    },
                },
            }
        });

        if (!idReservation){
            throw new Error('Reserva não encontrada.');

        };

        const existOther = await prismaClient.reservation.findFirst({
            where:{
                reservationStatus:true,
                date:idReservation.date,
                apartment:{
                    tower_id:idReservation.apartment.tower_id
                },
                finish:{
                    gte:idReservation.start
                }
            }
        });


        if (existOther && status !== false){
            throw new Error ('Você já aprovou uma reserva nessa data.');
        };

        const activeAgendamento = await prismaClient.reservation.update({
            where:{
                id:reservation_id
            },data:{
                reservationStatus: status
            }
        });

        let message = '';

        if (status){
            message = 'SalãoCondo, sobre sua reserva do salão: Oba! Com grande alegria, informamos que sua reserva foi aceita com sucesso! Agora você pode preencher a lista de convidados para o evento. Temos certeza de que será uma ocasião especial e estamos ansiosos para recebê-lo juntamente com seus convidados.'
        }
        else{
            message = 'SalãoCondo, sobre sua reserva do salão: Lamentamos informar que não podemos aceitar a sua reserva neste momento. Pedimos desculpas pela inconveniência que isso possa causar.'
        }


        const usersInApartment = await prismaClient.user.findMany({
            where:{
                apartment_id:idReservation.apartment.id
            },select:{
                email:true,
            }
        });

        const lenghtUsers = usersInApartment.length;

        for (var x = 0; x < lenghtUsers; x++){
            SendEmail(usersInApartment[x].email, message);
        }
        
        const deleteAllFalse = await prismaClient.reservation.deleteMany({
            where:{
                reservationStatus:false
            }
        });
        
        return activeAgendamento
    }
}

export {SetNewReservationServices}