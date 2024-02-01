import prismaClient from "../../prisma";

class ListAptUserServices{
    async execute(){
        const apt = await prismaClient.apartment.findMany({
        select:{
                id:true,
                numberApt:true,
                tower_id:true,
                user:true
            },orderBy:{
                numberApt:'asc'
            }
        })

        return apt
    }

}

export {ListAptUserServices}