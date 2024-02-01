import prismaClient from "../../prisma";

interface UserRequest {
  apartment_id: string;
}

class SetPaymentServices {
  async execute({apartment_id}: UserRequest) {

    if (!apartment_id){
      throw new Error('Envie todos os dados!');
    }
    
    const dateStart: Date = new Date();

    const aptPayment = await prismaClient.apartment.findFirst({
      where:{
        id:apartment_id
      }
    })

    if (!aptPayment){
      throw new Error('Apartamento não existe!')
    }

    const updatedAptUser = await prismaClient.apartment.update({
      where: {
        id:apartment_id
      },
      data: {
        payment: !aptPayment.payment,
        payday: dateStart,
      },
      select: {
        numberApt:true,
        user:{
          select:{
            name:true,
            lastname:true,
            id:true
          }
        }
      },
    });

    return updatedAptUser;
  }
}

export { SetPaymentServices };
