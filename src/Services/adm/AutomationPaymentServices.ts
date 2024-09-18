import prismaClient from "../../prisma";

class AutomationPaymentServices {
  async execute() {

    const onDay = new Date(); // pegando o dia atual
    onDay.setDate(onDay.getDate() - 30); // adicionando a ele menos 30 dias

    const apartmentsToUpdate = await prismaClient.apartment.findMany({
      where: {
        payment: true,
        payday: {
          lte: onDay,
        },
      },
    }); // pegando todos os apartamentos com status igua a true

    for (let x = 0; x < apartmentsToUpdate.length; x++) {
      await prismaClient.apartment.update({
        where: {
          id: apartmentsToUpdate[x].id,
        },
        data: {
          payment: false,
        },
      });
    }
    return('Pagamentos atualizados automaticamente');
  }
}

export { AutomationPaymentServices };
