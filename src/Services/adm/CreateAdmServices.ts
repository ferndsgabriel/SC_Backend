import { hash, compare } from "bcryptjs";
import prismaClient from "../../prisma";
import { FormatPhone } from "../../utils/FormatPhone";
import { FormatEmail } from "../../utils/FormatEmail";
import { Capitalize } from "../../utils/Capitalize";

interface AdmRequest{
    email:string;
    pass:string;
    cod:string;
    name:string;
    lastname: string;
    phone_number:string;
}

class CreateAdmServices{
    async execute({email, pass, cod, name, lastname, phone_number}:AdmRequest){
    
    function onlyString(string:string){
        if (!/^[a-zA-Z]+$/.test(string)) {
            return false;
        }
        return true;
    }

    if (!email || !pass || !cod || !name || !lastname || !phone_number){
        throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
    }  
    if (name.length < 3 || lastname.length < 4){
        throw new Error('Nome inválido.');
    }
    if (!onlyString(name) || !onlyString(lastname)){
        throw new Error('Nome inválido.');
    }
    const EmailExist = await prismaClient.adm.findFirst({
        where:{
            email:FormatEmail(email)
        }
    })

    if (EmailExist){
        throw new Error("Email já existente.");
    }
    const numberExist = await prismaClient.user.findFirst({
        where:{
            phone_number:FormatPhone(phone_number)
        }
    })
    if (numberExist){
        throw new Error('Telefone já vinculado a outra conta.');
    }
    
    const compareSenhaADM = await compare(cod, process.env.ADM_PASS); // criptografia de senha
    
    if(!compareSenhaADM){
        throw new Error('Código de administrador incorreto.');
    }

    const admHash = await hash(pass, 8);
    
        const adm = await prismaClient.adm.create({
            data:{
                email:FormatEmail(email),
                pass:admHash,
                name:Capitalize(name),
                lastname: Capitalize(lastname),
                phone_number:FormatPhone(phone_number)
            },select:{
                email:true,
                id:true,
                name:true,
                lastname:true,
                phone_number:true
            }
        })
        return ({
            adm
        })
    }
}

export {CreateAdmServices}