import prismaClient from "../../prisma";
import { SendEmail } from "../../utils/SendEmail";
import { FormatEmail } from "../../utils/FormatEmail";

interface reservationProps{
    reservation_id:string
}
class DeleteReservationAdmServices{
    
    async execute({reservation_id}:reservationProps){

        if (! reservation_id){
            throw new Error ("Digite a reserva.");
        }

        const deleteGuest = await prismaClient.guest.deleteMany({
            where:{
                reservation_id:reservation_id
            }
        })
        const reservationExist = await prismaClient.reservation.findFirst({
            where:{
                id:reservation_id
            },select:{
                apartment_id:true,
                date:true,
                phone_number:true,
                email:true,
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
                    email: true,
                },
                },
            },
        });
        if (thereAwaitList.length > 0 ){
            for (var x=0; x < thereAwaitList.length; x++){
                const awaitListMensagem = `
                    <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
                        <p>Prezado Morador,</p><br>

                        <p>ℹ️ A reserva que você estava aguardando na lista de espera foi cancelada.</p><br>

                        <p>📅 Essa vaga agora está disponível para agendamento. Não perca a oportunidade de reservá-la!</p><br>

                        <p>🔗 Visite nosso sistema de reservas para garantir a data desejada.</p><br>

                        <p>ℹ️ Se precisar de assistência ou tiver alguma dúvida, entre em contato conosco.</p><br>

                        <p>Atenciosamente,<br>
                        Equipe SalãoCondo 🌟</p>
                    </div>
                `;
                SendEmail(thereAwaitList[x].user.email, awaitListMensagem);
            }
        }

        const message = `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
            <p>Prezado Morador,</p><br>
    
            <p>ℹ️ Informamos que a sua reserva foi cancelada devido ao não pagamento das taxas condominiais. Essa medida foi tomada em conformidade com as políticas do condomínio.</p><br>
    
            <p>📞 Se precisar de assistência ou tiver alguma dúvida, entre em contato conosco.</p><br>
    
            <p>Atenciosamente,<br>
            Equipe SalãoCondo 🌟</p>
        </div>
    `;
    
    
        SendEmail(FormatEmail(reservationExist.email), message);

        const deleteReservation = await prismaClient.reservation.delete({
            where:{
                id:reservation_id
            }
        });
        
        return {ok:true}
    }
}
export {DeleteReservationAdmServices}