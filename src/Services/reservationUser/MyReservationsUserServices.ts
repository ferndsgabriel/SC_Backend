import prismaClient from "../../prisma";

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
    const year = onDay.getFullYear();
    const month = onDay.getMonth() + 1;
    const day = onDay.getDate();
    
    function setZero(number:number){
        if (number < 10){
            return `0${number}`
        }else{
            return number
        }
    }
    
    const monthWithZero = setZero(month);
    const dayWithZero = setZero(day);

    const  onDayValue = parseInt(`${year}${monthWithZero}${dayWithZero}`);

    const myAgendamentos = await prismaClient.reservation.findMany({
      where: {
        apartment_id:userExist.apartment_id,
        date: {
          gte:onDayValue
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
        guest:true,
        reservationStatus:true,
        id:true
      },orderBy:{
        date:'asc'
      }
    });
    

    return myAgendamentos;
  }
}

export { MyReservationsUserServices };
