import { compare } from "bcryptjs";
import { sign } from 'jsonwebtoken';
class AuthConciergeServices{
    async execute(cod:string){
        if (!cod){
            throw new Error ('Código de acesso não enviado.');
        }

        const codCompare = process.env.CONCIERGE_PASS as string;

        const itsEqual = await compare(cod, codCompare);

        

        const token = sign(
                {
                },
            process.env.AJWT_SECRET,
                {
                    subject: cod,
                    expiresIn: '30d',
                }
            );

        if (!itsEqual){
            throw new Error ('Código de acesso inválido.');
        }else{
            return token
        }
    }
}

export {AuthConciergeServices}