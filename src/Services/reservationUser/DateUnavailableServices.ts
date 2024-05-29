import prismaClient from "../../prisma";

interface userProps {
  user_id:string
}

class DateUnavailableServices {
  async execute({user_id}:userProps) {

    const user = await prismaClient.user.findFirst({
      where:{
        id:user_id
      },select:{
        apartment:{
          select:{
            tower_id:true,
            id:true
          }
        }
      }
    });

    const dateUnavailable = await prismaClient.reservation.findMany({
        where:{
            reservationStatus:true,
            apartment:{
              id:{
                not:user.apartment.id
              },
              tower:{
                id:user.apartment.tower_id
              }
            }
        },
      select: {
        id: true,
        date: true,
        start:true,
        finish:true,
      }
    });

    return dateUnavailable;
  }
}

export { DateUnavailableServices };
