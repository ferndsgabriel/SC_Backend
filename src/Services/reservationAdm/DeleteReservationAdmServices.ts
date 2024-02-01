import prismaClient from "../../prisma";
import { SendAlertsUser } from "../../utils/SendAlertsUser";

interface reservationProps{
    reservation_id:string
}
class DeleteReservationAdmServices{
    
    async execute({reservation_id}:reservationProps){

        if (! reservation_id){
            throw new Error ("Digite a reserva.");
        }
        const reservationExist = await prismaClient.reservation.findFirst({
            where:{
                id:reservation_id
            },select:{
                apartment_id:true,
                date:true,
                phone_number:true,
                apartment:{
                    select:{
                        tower_id:true
                    }
                }
            }
        });

        if (!reservation_id){
            throw new Error ('Reserva não encontrada.');
        }

        const thereAwaitList = await prismaClient.waitingList.findMany({
            where: {
                date: reservationExist.date,
                user: {
                apartment: {
                    id: {
                    not: reservationExist.apartment_id,
                    },
                    tower_id: reservationExist.apartment.tower_id,
                },
                },
            },
            select: {
                user: {
                select: {
                    phone_number: true,
                },
                },
            },
        });
        if (thereAwaitList.length > 0 ){
            for (var x=0; x < thereAwaitList.length; x++){
                const awaitListMensagem = `
                    <p>Prezado Morador,</p>
        
                    <p>A reserva que você estava aguardando na lista de espera foi cancelada.</p>
        
                    <p>Essa vaga agora está disponível para agendamento. Não perca a oportunidade de reservá-la!</p>
        
                    <p>Visite nosso sistema de reservas para garantir a data desejada.</p>
        
                    <p>Se precisar de assistência ou tiver alguma dúvida, entre em contato conosco.</p>
        
                    <p>Atenciosamente,<br>
                    SalãoCondo</p>
                `;
                SendAlertsUser(thereAwaitList[x].user.phone_number, awaitListMensagem);
            }
        }

        const message = `
            <p>Prezado Morador, <p>          

            <p>Informamos que a sua reserva foi cancelada devido ao não pagamento das taxas condominiais. Essa medida foi tomada em conformidade com as políticas do condomínio.</p>

            <p>Se precisar de assistência ou tiver alguma dúvida, entre em contato conosco.</p>

            <p>Atenciosamente,<br>
            SalãoCondo</p>
        `;  
        SendAlertsUser(reservationExist.phone_number, message);

        const deleteReservation = await prismaClient.reservation.delete({
            where:{
                id:reservation_id
            }
        });
        
        return {ok:true}
    }
}
export {DeleteReservationAdmServices}