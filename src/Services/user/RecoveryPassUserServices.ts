import { hash, compare } from "bcryptjs";
import prismaClient from "../../prisma";
import { FormatEmail } from "../../utils/FormatEmail";

interface recoveryProps {
  pass: string;
  cod: string;
  email: string;
}

class RecoveryPassUserServices {
  async execute({ pass, cod, email}: recoveryProps) {

    if (!cod  || !pass  || !email) {
      throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
    }

    const user = await prismaClient.user.findFirst({
      where: {
        email: FormatEmail(email),
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
    
  const tenMinutesPassed = user.codDate;
  tenMinutesPassed.setMinutes(tenMinutesPassed.getMinutes() + 10);
    

    if (onDay >= tenMinutesPassed) {
        throw new Error(`Código expirado!`);
    }

    const hashPass = await hash (pass, 8);

    const dateChangePass = new Date();
    dateChangePass.setDate(dateChangePass.getDate()+30);
    
    const updatePass = await prismaClient.user.update({
      where:{
        id:user.id
      },data:{
        pass:hashPass,
        dateChangePass:dateChangePass
      }
    })

  const updateTokenStatus = await prismaClient.token.deleteMany({
      where:{
          user_id:user.id
      }
  });


    return ({
      ok:true,
    })
    
  }
}

export { RecoveryPassUserServices };
