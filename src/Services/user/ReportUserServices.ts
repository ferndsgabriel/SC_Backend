import { SendEmail } from "../../utils/SendEmail";
import prismaClient from "../../prisma";


interface SendEmail{
    option:number,
    message:string,
    id:string,
}

class ReportUserServices{
    async execute({id, message, option}:SendEmail){
        if (!id || !message || option < 1 || option > 2){
            throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
        }
        const userExist = await prismaClient.user.findFirst({
            where:{
                id:id
            },
            select:{
                phone_number:true,
                name:true,
                lastname:true,
                email:true,
                apartment:{
                    select:{
                        numberApt:true,
                        tower:{
                            select:{
                                numberTower:true
                            }
                        }
                    }
                }
            }
        });
        

        if (!userExist){
            throw new Error ('Usuário não existe.')
        }

        let sendMessage = '';

        if (option === 1){
            sendMessage = `
            <h2>🚨 Novo Bug ou Problema Reportado!</h2>
            <p><strong>Detalhes do Morador:</strong></p>
            <ul>
                <li><strong>Nome:</strong> ${userExist.name} ${userExist.lastname}</li>
                <li><strong>Torre:</strong> ${userExist.apartment.tower.numberTower}</li>
                <li><strong>Apartamento:</strong> ${userExist.apartment.numberApt}</li>
                <li><strong>E-mail:</strong> ${userExist.email}</li>
            </ul>
            <p><strong>Mensagem do Morador:</strong></p>
            <blockquote style="font-style: italic; color: #555;">
                "${message}"
            </blockquote>
            <p>Por favor, verifique e resolva o mais rápido possível. Obrigado!</p>`;
        }else if (option === 2){
            sendMessage = `
            <h2>📬 Novo Feedback Recebido!</h2>
            <p><strong>Detalhes do Morador:</strong></p>
            <ul>
                <li><strong>Nome:</strong> ${userExist.name} ${userExist.lastname}</li>
                <li><strong>Torre:</strong> ${userExist.apartment.tower.numberTower}</li>
                <li><strong>Apartamento:</strong> ${userExist.apartment.numberApt}</li>
                <li><strong>E-mail:</strong> ${userExist.email}</li>
            </ul>
            <p><strong>Mensagem do Morador:</strong></p>
            <blockquote style="font-style: italic; color: #555;">
                "${message}"
            </blockquote>`;
        
        }
        
        const admEmail = await prismaClient.adm.findMany({
            select:{
                email:true
            }
        });
        
        for (var x = 0; x < admEmail.length; x++) {
            const getEmail = admEmail[x].email; 
            SendEmail(getEmail, sendMessage);
        }
        
        return {ok:true}
    }
    
}

export {ReportUserServices};