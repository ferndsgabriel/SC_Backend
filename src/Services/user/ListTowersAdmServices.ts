import prismaClient from "../../prisma"
class ListTowersUsersServices{
    async execute(){
        const listTowers = await prismaClient.tower.findMany({
            select:{
                id:true,
                numberTower:true,
                apartment:true,
            },orderBy:{
                numberTower:'asc'
            }
        });
        return listTowers;
    }
}   

export {ListTowersUsersServices}