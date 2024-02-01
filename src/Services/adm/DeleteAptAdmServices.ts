import prismaClient from "../../prisma"

interface aparmentProps{
    apartment_id:string,

}
class DeleteAptAdmServices{
    async execute({apartment_id}:aparmentProps){

        if (!apartment_id){
            throw new Error('ID do apartamento não inserido.');
        }
        const aptExist = await prismaClient.apartment.findFirst({
            where:{
                id:apartment_id
            }
        })

        if (!aptExist){
            throw new Error('Apartamento inexistente.');
        }

        const userContains = await prismaClient.user.findFirst({
            where:{
                apartment_id:apartment_id
            }
        })

        if (userContains){
            throw new Error('Impossível excluir. Apartamento possui moradores.');
        }

        const deleteApt = await prismaClient.apartment.delete({
            where:{
                id:apartment_id
            }
        })

        return ({ok:true})
    }
}

export {DeleteAptAdmServices}