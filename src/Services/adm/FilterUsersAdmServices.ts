import prismaClient from "../../prisma";

class FilterUsersAdmServices{
    async execute(){
        const users = await prismaClient.user.findMany({
                where: {
                accountStatus: true,
                },
                select: {
                    cpf: true,
                    id: true,
                    name: true,
                    lastname: true,
                    email:true,
                    photo: true,
                    accountStatus: true,
                    phone_number: true,
                    apartment_id: true,
                apartment: {
                    select: {
                    numberApt: true,
                    tower_id: true,
                    payment: true,
                    payday: true,
                    tower: {
                        select: {
                        numberTower: true,
                        },
                    },
                    },
                },
                },
                orderBy: {
                name: 'asc', // Certifique-se de que 'name' está presente na tabela ou escolha um campo válido
                },
            });
        return users
    }
}

export {FilterUsersAdmServices}