import prismaClient from "../../prisma";

class NewReservationsAdmServices {

  async execute() {
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

    const readingAgends = await prismaClient.reservation.findMany({
      where: {
        reservationStatus: null,
        date: {
          gte:onDayValue
        },
      },
      select: {
        id:true,
        date:true,
        start:true,
        finish:true,
        cleaningService:true,
        name:true,
        email:true,
        phone_number:true,
        GuestList:true,
        apartment:{
          select:{
            id:true,
            numberApt:true,
            payment:true,
            user:{
              select:{
                name:true,
                lastname:true,
                email:true,
                phone_number:true
              }
            },
            tower:{
              select:{
                id:true,
                numberTower:true
              }
            }
          }
        }
      },orderBy:{
        date:'asc'
      }
    });
    return readingAgends;
  }
}

export { NewReservationsAdmServices };
