import prismaClient from "../../prisma";

interface aptRequest{
    numberApt: string;
    tower: string
}
class CreateaptAdmServices{

    async execute({numberApt, tower}:aptRequest){
        
        if (!numberApt || !tower ){
            throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
        }

        
        const aptExist = await prismaClient.apartment.findFirst({
            where:{
                numberApt:numberApt,
                tower_id:tower
            }
        })

        if (aptExist){
            throw new Error('Número de apartamento já existente.');
        }
        const aptCreate = await prismaClient.apartment.create({
            data:{
                numberApt: numberApt,
                tower_id:tower
            }
        })

        return numberApt
    }

}

export {CreateaptAdmServices}