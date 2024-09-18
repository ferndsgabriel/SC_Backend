import prismaClient from "../../prisma";

class DetailUserServices{
    async execute(user_id:string){
        
        if (!user_id){
            throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
        }
        const details = await prismaClient.user.findFirst({
            where:{
                id:user_id
            },select: {
                id: true,
                name: true,
                lastname: true,
                email:true,
                photo: true,
                phone_number: true,
                apartment_id: true,
                sessionToken:true,
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

        return (details);
    }
}

export {DetailUserServices}