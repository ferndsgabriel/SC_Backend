import prismaClient from "../../prisma";
import { SendEmail } from "../../utils/SendEmail";

interface ContaRequest{
  id: string;
  accountStatus: boolean;
}

class ActiveUsersAdmServices{
  async execute({id, accountStatus}:ContaRequest){
    
    if (!id || accountStatus === null){
      throw new Error('Envie todos os dados!');
    }
    
    const userActive = await prismaClient.user.findFirst({
      where:{
        id:id
      }
    }) //procurando o usuario, onde o id for igual o fornecido

    if (!userActive){
      throw new Error('Usuário não encontrado.')
    } // se não tiver retorno o erro

    const users = await prismaClient.user.update({
      where:{
        id:id
      },
      data:{
        accountStatus:accountStatus
      },select:{
        cpf:true,
        email:true,
        name:true,
        lastname:true,
        id:true,
        apartment_id:true,
        accountStatus:true,
        phone_number:true
      }
    }) // se tiver vou passando o status da conta, podendo ser true ou false

    // retornando mensagem do email
    let mensagem = ''

    if (users.accountStatus === false){
      mensagem = `
      <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
          <p>Olá ${users.name} ${users.lastname},</p>
          
          <p>Lamentamos informar que, neste momento, não podemos validar sua conta no SalãoCondo. 😔</p>
          <p>Pedimos desculpas pela inconveniência e agradecemos pela sua compreensão. 🙏</p><br>
          
          <p>Se tiver alguma dúvida ou precisar de assistência, entre em contato com nossa equipe de suporte. 📞</p><br>
          
          <p>Atenciosamente,<br>
          Equipe de Suporte do SalãoCondo 🌟</p>
      </div>
  `;
  
  
    
    } else if (users.accountStatus === true){
      mensagem = `
      <div style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
          <p>Olá ${users.name} ${users.lastname},</p><br>
          
          <p>🎉 Parabéns! É com grande satisfação que informamos que sua conta no SalãoCondo foi aprovada com sucesso.</p>
          <p>Agora você pode fazer login e começar a desfrutar de todos os recursos e benefícios disponíveis em nossa plataforma.</p><br>
          
          <p>Seja bem-vindo(a) e aproveite ao máximo a sua experiência! 🌟</p><br>
          
          <p>Atenciosamente,<br>
          Equipe do SalãoCondo</p>
      </div>
  `;
  
    
  }
    
  
    SendEmail(users.email, mensagem);

    const deleteuser = await prismaClient.user.deleteMany({
      where:{
        accountStatus:false
      }
    }) // por fim deleto todos usuarios com o status da conta como falso

    return users;
  }
}

export {ActiveUsersAdmServices}