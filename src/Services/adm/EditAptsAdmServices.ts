import prismaClient from "../../prisma"

interface editAptsProps{
    apartment_id:string,
    newApt:string
}

class EditAptsAdmServices{
    async execute({apartment_id, newApt}:editAptsProps){

        if (!apartment_id|| !newApt){
            throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
        }

        const exisApt = await prismaClient.apartment.findFirst({
            where:{
                id:apartment_id,
            }
        })

        if (!exisApt){
            throw new Error('Apartamento inexistente.');
        }

        const isUnique = await prismaClient.apartment.findFirst({
            where:{
                numberApt:newApt,
                tower_id:exisApt.tower_id
            }
        })

        if (exisApt.numberApt === newApt){
            throw new Error('Apartamento novo igual ao atual.');
        }

        if (isUnique){
            throw new Error('Número de apartamento já existente.');
        }

        const editApt = await prismaClient.apartment.update({
            where:{
                id:apartment_id,
            },data:{
                numberApt:newApt,
            }
        })

        return (editApt)
    }
}

export {EditAptsAdmServices}