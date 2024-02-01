import prismaClient from "../../prisma";

interface admProps{
    id: string
}

class DetailsAdmServices {
    async execute({id}:admProps){

        if (!id){
            throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
        }
        
        const details = await prismaClient.adm.findFirst({
            where:{
                id:id
            },select:{
                email:true,
                id:true,
                name:true,
                lastname:true,
                phone_number:true
            }
        })

        return details
    }

}

export {DetailsAdmServices}