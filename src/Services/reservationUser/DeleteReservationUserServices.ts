import prismaClient from "../../prisma";
import { SendEmail } from "../../utils/SendEmail";
import dateInInt from "../../utils/DateInInt";

interface ReservationProps{
    reservation_id: string,
    user_id: string
}

class DeleteReservationUserServices {
  async execute({ reservation_id, user_id }:ReservationProps) {

    if (!reservation_id ||  !user_id ){
      throw new Error ('Digite todos os dados!');
    }
    
    const user = await prismaClient.user.findFirst({
      where:{
        id:user_id
      },
      select:{
        name:true,
        lastname:true,
        phone_number:true,
        email:true,
        apartment:{
          select:{
            numberApt:true,
            id:true,
            tower:{
              select:{
                numberTower:true,
                id:true,
              }
            }
          },
        }
      }
    });
    
    if (!user){
      throw new Error ('O usuário não existe!');
    }

    const reservationExist = await prismaClient.reservation.findFirst({
      where:{
        id:reservation_id
      },select:{
        date:true,
        reservationStatus:true
      }
    });

    if (!reservationExist){
      throw new Error ('Essa reserva não existe!');
    }

    const getDayNow = new Date();
    const onDay = new Date();

    const onDayMoreTwo = dateInInt(getDayNow, 2);
    const onDayCancell = dateInInt(onDay, 0);


    if (onDayMoreTwo >=  reservationExist.date && reservationExist.reservationStatus === true){     
      const createTaxed = await prismaClient.isCanceled.create({
        data:{
          apartment_id:user.apartment.id,
          dateGuest:reservationExist.date,
          dateCancellation:onDayCancell,
          email:user.email,
          phone_number:user.phone_number,
          name:`${user.name} ${user.lastname}`,
          isTaxed:true
        }
      });

      const mensagem = `
      <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
          <p>Prezado Morador, ${createTaxed.name}</p>
  
          <p>ℹ️ Sua reserva cancelada foi sujeita a uma taxa de <strong>R$ 100,00</strong>.</p>
  
          <p>⚠️ Por favor, esteja ciente das políticas de cancelamento antes de fazer futuras reservas para evitar taxas adicionais.</p>
  
          <p>ℹ️ Se precisar de mais esclarecimentos, entre em contato conosco.</p>
  
          <p>Atenciosamente,<br>
          Equipe SalãoCondo 🌟</p>
      </div>
  `;

      SendEmail(user.email, mensagem);
    }else{
      const createFinsih = await prismaClient.isCanceled.create({
        data:{
          apartment_id:user.apartment.id,
          dateGuest:reservationExist.date,
          dateCancellation:dateInInt(getDayNow, 0),
          email:user.email,
          phone_number:user.phone_number,
          name:`${user.name} ${user.lastname}`,
          isTaxed:false
        }
      });
    }

    const thereAwaitList = await prismaClient.waitingList.findMany({
      where: {
        date: reservationExist.date,
        user: {
          apartment: {
            id: {
              not: user.apartment.id,
            },
            tower_id: user.apartment.tower.id,
          },
        },
      },
      select: {
        user: {
          select: {
            email:true
          },
        },
      },
    });
        
    if (thereAwaitList.length > 0 ){
      for (var x=0; x < thereAwaitList.length; x++){
        const awaitListMensagem = `
        <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
            <p>Prezado Morador,</p>
    
            <p>ℹ️ A reserva que você estava aguardando na lista de espera foi cancelada.</p>
    
            <p>📅 Essa vaga agora está disponível para agendamento. Não perca a oportunidade de reservá-la!</p>
    
            <p>🔗 Visite nosso sistema de reservas para garantir a data desejada.</p>
    
            <p>ℹ️ Se precisar de assistência ou tiver alguma dúvida, entre em contato conosco.</p>
    
            <p>Atenciosamente,<br>
            Equipe SalãoCondo 🌟</p>
        </div>
    `;    
        SendEmail(thereAwaitList[x].user.email, awaitListMensagem);
      }
    }

    const deleteReservation = await prismaClient.reservation.delete({
      where:{
        id:reservation_id
      }
    });

    return {ok:true}
  }
}
  
  export { DeleteReservationUserServices };
  