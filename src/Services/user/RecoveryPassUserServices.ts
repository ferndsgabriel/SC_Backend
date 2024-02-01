import { hash, compare } from "bcryptjs";
import prismaClient from "../../prisma";
import { FormatPhone } from "../../utils/FormatPhone";

interface recoveryProps {
  pass: string;
  cod: string;
  phone_number: string;
}

class RecoveryPassUserServices {
  async execute({ pass, cod, phone_number }: recoveryProps) {

    if (!cod  || !pass  || !phone_number ) {
      throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
    }

    const user = await prismaClient.user.findFirst({
      where: {
        phone_number: FormatPhone(phone_number),
      },
      select:{
        codDate:true,
        codRecovery:true,
        dateChangePass:true,
        id:true
      }
    });

    if (!user) {
      throw new Error("Usuário inválido.");
    }


    const isMyCod = await compare (cod, user.codRecovery);

    if (!isMyCod) {
      throw new Error("Código inválido.");
    }

    const onDay = new Date();

    if (onDay < user.dateChangePass){
        throw new Error('Você já alterou sua senha nos últimos 30 dias.');
    }
    
    const moreTeenMinutes = new Date();
    moreTeenMinutes.setMinutes(moreTeenMinutes.getMinutes() + 10);

    if (user.codDate <= moreTeenMinutes) {
      const updateRecovery = await prismaClient.user.update({
          where:{
              phone_number:FormatPhone(phone_number)
          },data:{
            codRecovery:null
          }
        })
        throw new Error("Código expirado!");
    }

    const hashPass = await hash (pass, 8);

    const updatePass = await prismaClient.user.update({
      where:{
        id:user.id
      },data:{
        pass:hashPass
      }
    })

  const updateTokenStatus = await prismaClient.token.deleteMany({
      where:{
          user_id:user.id
      }
  });


    return ({
      ok:true
    })
    
  }
}

export { RecoveryPassUserServices };
