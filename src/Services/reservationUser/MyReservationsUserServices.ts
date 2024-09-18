import prismaClient from "../../prisma";
import dateInInt from "../../utils/DateInInt";

interface userProps {
  user_id: string;
}

class MyReservationsUserServices {

  async execute({ user_id}: userProps) {

    if (!user_id){
      throw new Error ('Informe o id!');
    }

    const userExist = await prismaClient.user.findFirst({
      where:{
        id:user_id
      },
      select:{
        apartment_id:true
      }
    });

    if (!userExist){
      throw new Error ('Usuário não encontrado!');
    }


    const onDay = new Date();
    const onDayInt = dateInInt(onDay, 0)

    const myAgendamentos = await prismaClient.reservation.findMany({
      where: {
        apartment_id:userExist.apartment_id,
        date: {
          gte: onDayInt
        },
        OR:[
          {reservationStatus:true},
          {reservationStatus:null}
        ]
      },select:{
        date:true,
        start:true,
        finish:true,
        cleaningService:true,
        reservationStatus:true,
        id:true,
        GuestList:true
      },orderBy:{
        date:'asc'
      }
    });
    

    return myAgendamentos;
  }
}

export { MyReservationsUserServices };
