import prismaClient from "../../prisma"

interface editTowerProps{
    tower_id:string,
    newTower:string
}

class EditTowerAdmServices{
    async execute({tower_id, newTower}:editTowerProps){

        if (!tower_id || !newTower){
            throw new Error('Envie todos os dados!');
        }
        
        const newTowerExist = await prismaClient.tower.findFirst({
            where:{
                numberTower:newTower
            }
        })

        if (newTowerExist){
            throw new Error('Torre já existente.');
        }


        
        const towerExist = await prismaClient.tower.findFirst(({
            where:{
                id:tower_id
            }
        }))

        if (!towerExist){
            throw new Error('Torre inexistente.');
        }

        const updateTower = await prismaClient.tower.update({
            where:{
                id:tower_id
            },
            data:{
                numberTower:newTower
            }
        })

        return updateTower
    }
}

export {EditTowerAdmServices}