import prismaClient from "../../prisma";

class ListAllTaxedAgendamentoServices{
    async execute(){
        const allTaxed = await prismaClient.taxed.findMany({
            select:{
                dateGuest:true,
                dateCancellation:true,
                id:true,
                name:true,
                email:true,
                phone_number:true,
                apartment:{
                    select:{
                        numberApt:true,
                        user:{
                            select:{
                                name:true,
                                lastname:true,
                                email:true,
                                phone_number:true
                            }
                        },tower:{
                            select:{
                                numberTower:true
                            }
                        }
                    }
                }
            },orderBy:{
                dateCancellation:"asc"
            }
        })

        return allTaxed
    }
}

export {ListAllTaxedAgendamentoServices}