import prismaClient from "../../prisma";
import { SendEmail } from "../../utils/SendEmail";
import { FormatEmail } from "../../utils/FormatEmail";
import { hash } from "bcryptjs";

interface admRecovery{
  email:string
}
class CodRecoveyAdmServices {
  
  async execute({email}:admRecovery) {
    
    function getRandomCode() {
      const codigo = Math.floor(Math.random() * 900000) + 100000;
      return codigo.toString(); 
    }

    const randomCode = getRandomCode();

    if (!email){
      throw new Error('E-mail não inserido.');
  }

    const adm = await prismaClient.adm.findFirst({
      where:{
        email:FormatEmail(email)
      },select:{
        id:true,
        countCod:true,
        name:true,
        lastname:true,
        codDate:true,
        email:true
      }
    });

    if (!adm){
      throw new Error('Usuário não encontrado para este e-mail.');
    }

    const data = new Date();
    const onDayMore1 = adm.codDate;
    onDayMore1.setDate(onDayMore1.getDate() + 1);

    if (adm.countCod >= 5 && onDayMore1 > data ){
      throw new Error('Você ultrapassou o limite diário de códigos de recuperação: 5. Aguarde 24 horas.');
    }

    const codHash = await hash (randomCode, 8);

    if (onDayMore1 < data){
      const setToken = await prismaClient.adm.update({
        where:{
          id:adm.id
        },data:{
          codRecovery: codHash,
          codDate:data,
          countCod:0
        }
      });
    }else{
      const setToken = await prismaClient.adm.update({
        where:{
          id:adm.id
        },data:{
          codRecovery: codHash,
          codDate:data,
          countCod:adm.countCod + 1
        }
      });
    }

    const mensagem = `
    Olá, ${adm.name} ${adm.lastname}<br><br>
  
    Recebemos uma solicitação de recuperação de conta para o SalãoCondo.<br>
    Utilize o seguinte código para concluir o processo de recuperação:<br><br>
  
    <strong>${randomCode}</strong><br><br>
  
    Este código é válido por um curto período de tempo. Não compartilhe com ninguém.<br><br>
  
    Se você não solicitou essa recuperação ou tiver qualquer dúvida, entre em contato conosco.<br><br>
  
    Atenciosamente,<br>
    Equipe de Suporte do SalãoCondo
  `;
  

    SendEmail(adm.email, mensagem);

    return ({ok:true})
  }
}
export { CodRecoveyAdmServices};


