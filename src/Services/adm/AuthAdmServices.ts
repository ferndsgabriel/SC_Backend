import prismaClient from "../../prisma";
import { compare, hash } from "bcryptjs";
import {sign} from 'jsonwebtoken'
import { FormatEmail } from "../../utils/FormatEmail";


interface AdmRequest{
    email:string;
    pass:string;
}

class AuthAdmServices{
    async execute({email, pass}:AdmRequest){

        if (!email || !pass){
            throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
        }

        const adm = await prismaClient.adm.findFirst({
            where:{
                email:FormatEmail(email)
            }
        }) //procurando se tem um email no banco igual ao digitado

        if (!adm){
            throw new Error("Erro de validação: Seus dados estão incorretos. Verifique as informações e tente novamente.");
        } // se não tiver retorna um erro

        const compareSenha = await compare(pass, adm.pass); // criptografia de senha

        if (!compareSenha){
            throw new Error("Erro de validação: Seus dados estão incorretos. Verifique as informações e tente novamente.");
        } // se não tiver certo a senha

        const token = sign(
            { 
                email: adm.email, 
                nome: adm.name   
            }, 
            process.env.AJWT_SECRET!,          
            {
                subject:adm.id, 
                expiresIn:"30d" 
            }
        )// pegando dados para criar o token de autenticação 

            

        const admData = {
            email:adm.email,
            name:adm.name,
            lastname:adm.lastname,
            id:adm.id,
            sessionToken:adm.sessionToken,
            phone_number:adm.phone_number
        }

        return ({
            data:admData,
            token:token
        })
    }

}

export {AuthAdmServices}