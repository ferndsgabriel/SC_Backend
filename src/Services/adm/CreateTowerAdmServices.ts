import prismaClient from "../../prisma";

interface towerProps{
    numberTower:string       
}

class CreateTowerAdmServices{

    async execute ({numberTower}:towerProps){
        if (!numberTower){
            throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
        }
        const towerExist = await prismaClient.tower.findFirst({
            where:{
                numberTower:numberTower
            }
        }) 

        if (towerExist){
            throw new Error('Torre já existente.');
        }

        const createTower = await prismaClient.tower.create({
            data:{
                numberTower:numberTower
            },
            select:{
                numberTower:true,
                apartment:true
            }
        })

        return createTower;
    }
}

export {CreateTowerAdmServices}