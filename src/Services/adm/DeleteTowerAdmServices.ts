import prismaClient from "../../prisma"

interface towerProps{
    tower_id:string
}

class DeleteTowerAdmServices{
    async execute({tower_id}:towerProps){

        if (!tower_id){
            throw new Error('Torre não inserida.');
        } 

        const towerExist = await prismaClient.tower.findFirst({
            where:{
                id:tower_id
            }
        })

        if (!towerExist){
            throw new Error('Torre inexistente.');
        }

        const towerContainsApt = await prismaClient.apartment.findFirst({
            where:{
                tower_id:tower_id
            }
        })

        if (towerContainsApt){
            throw new Error('Impossível excluir. Torre possui apartamentos.');
        }

        const deleteTower = await prismaClient.tower.delete({
            where:{
                id:tower_id
            }
        })

        return {ok:true}
    }
}

export {DeleteTowerAdmServices}