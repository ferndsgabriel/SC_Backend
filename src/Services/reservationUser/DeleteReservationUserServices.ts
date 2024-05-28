import prismaClient from "../../prisma";
import { SendEmail } from "../../utils/SendEmail";

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
        id:reservation_id,
        apartment_id:user.apartment.id
      },select:{
        date:true,
        reservationStatus:true
      }
    });

    if (!reservationExist){
      throw new Error ('Essa reserva não existe!');
    }


    const onDayMoreTwo = new Date();
    onDayMoreTwo.setDate(onDayMoreTwo.getDate () + 2);
    
    const reservationInDate = new Date();
    const stringDate = reservationExist.date.toString();
    const yearDate =  stringDate.substring(0,4);
    const monthDate = stringDate.substring(4,6);
    const dayString = stringDate.substring(6,8);

    const monthDateInt = parseInt(monthDate);
    reservationInDate.setFullYear(parseInt(yearDate));
    reservationInDate.setMonth(monthDateInt - 1);
    reservationInDate.setDate(parseInt(dayString));


    if (onDayMoreTwo >=  reservationInDate && reservationExist.reservationStatus === true){     
      const createTaxed = await prismaClient.taxed.create({
        data:{
          apartment_id:user.apartment.id,
          dateGuest:reservationInDate,
          email:user.email,
          phone_number:user.phone_number,
          name:`${user.name} ${user.lastname}`
        }
      });

      const mensagem = `
      <p>Prezado Morador, ${createTaxed.name}</p>
  
      <p>Sua reserva cancelada foi sujeita a uma taxa de R$ 100,00.</p>
  
      <p>Por favor, esteja ciente das políticas de cancelamento antes de fazer futuras reservas para evitar taxas adicionais.</p>
  
      <p>Se precisar de mais esclarecimentos, entre em contato conosco.</p>
  
      <p>Atenciosamente,<br>
      SalãoCondo</p>
  `;
  
      SendEmail(user.email, mensagem);
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
            <p>Prezado Morador,</p>

            <p>A reserva que você estava aguardando na lista de espera foi cancelada.</p>

            <p>Essa vaga agora está disponível para agendamento. Não perca a oportunidade de reservá-la!</p>

            <p>Visite nosso sistema de reservas para garantir a data desejada.</p>

            <p>Se precisar de assistência ou tiver alguma dúvida, entre em contato conosco.</p>

            <p>Atenciosamente,<br>
            SalãoCondo</p>
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
  