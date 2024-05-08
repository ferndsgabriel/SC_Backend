import { hash, compare } from "bcryptjs";
import prismaClient from "../../prisma";
import { FormatEmail } from "../../utils/FormatEmail";

interface recoveryProps {
  pass: string;
  cod: string;
  email: string;
}

class RecoveryPassAdmServices {
  async execute({ pass, cod, email }: recoveryProps) {

    if (!cod  || !pass  || !email ) {
      throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
    }

    const adm = await prismaClient.adm.findFirst({
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

    if (!adm) {
      throw new Error("Usuário inválido.");
    }

    const isMyCod = await compare (cod, adm.codRecovery);

    if (!isMyCod) {
      throw new Error("Código inválido.");
    }

    const onDay = new Date();

    if (onDay < adm.dateChangePass){
        throw new Error('Você já alterou sua senha nos últimos 30 dias.');
    }
    
    const tenMinutesPassed = adm.codDate;
    tenMinutesPassed.setMinutes(tenMinutesPassed.getMinutes() + 10);

    if (onDay >= tenMinutesPassed) {
        throw new Error("Código expirado!");
    }

    const hashPass = await hash (pass, 8);

    const dateChangePass = new Date();
    dateChangePass.setDate(dateChangePass.getDate()+30);

    const updatePass = await prismaClient.adm.update({
      where:{
        id:adm.id
      },data:{
        pass:hashPass,
        dateChangePass:dateChangePass
      }
    })

  const updateTokenStatus = await prismaClient.token.deleteMany({
      where:{
          adm_id:adm.id
      }
  });

    return ({
      ok:true
    })
    
  }
}

export { RecoveryPassAdmServices };
