import prismaClient from "../../prisma";
import { sign } from 'jsonwebtoken';
import { compare, hash } from "bcryptjs";
import { FormatEmail } from "../../utils/FormatEmail";


interface UserRequest {
    email: string;
    pass: string;
}

class AuthUserServices {
    async execute({ email, pass }: UserRequest) {
        if (!email || !pass) {
            throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
        }

        const user = await prismaClient.user.findFirst({
            where: {
                email: FormatEmail(email),
            },select: {
                sessionToken:true,
                id: true,
                name: true,
                lastname: true,
                email:true,
                photo: true,
                phone_number: true,
                apartment_id: true,
                pass:true,
                accountStatus:true,
                apartment: {
                    select: {
                    numberApt: true,
                    tower_id: true,
                    payment: true,
                        tower: {
                            select: {
                            numberTower: true,
                            },
                        },
                    },
                },
            },
            
        });

        if (!user) {
            throw new Error(
                'Erro de validação: Seus dados estão incorretos. Verifique as informações e tente novamente.'
            );
        }

        const compareSenha = await compare(pass, user.pass);

        if (!compareSenha) {
            throw new Error(
                'Erro de validação: Seus dados estão incorretos. Verifique as informações e tente novamente.'
            );
        }

        if (user.accountStatus === null) {
            throw new Error(
                'Status de análise: Seu perfil está atualmente em processo de análise. Aguarde a conclusão.'
            );
        }

        if (user.accountStatus === false) {
            throw new Error(
                'Recusa de acesso: Seu pedido foi recusado devido a informações inadequadas.'
            );
        }

        const token = sign(
        {
            email: user.email,
            name: user.name,
        },
        process.env.UJWT_SECRET,
        {
            subject: user.id,
            expiresIn: '30d',
        }
        );

        const hashToken = await hash(token, 8);

        const userData = {  
            sessionToken:user.sessionToken,
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            email:user.email,
            photo: user.photo,
            phone_number: user.phone_number,
            apartment_id: user.apartment_id,
            apartment:user.apartment,
        }
        

        return {
        userData:userData,
        token: token,
        };
    }
}

export { AuthUserServices };
