import prismaClient from "../../prisma";
import { FormatPhone } from "../../utils/FormatPhone";

interface UserRequest{
    number:string
    id:string
}

class ChangePhoneServices{
    async execute ({number, id}:UserRequest){

        if (!number || !id){
            throw new Error ('Digite todos os dados!');
        }

        const isMyphone = await prismaClient.user.findFirst({
            where:{
                phone_number:FormatPhone(number)
            }
        })

        if (isMyphone){
            throw new Error('Digite um número diferente do atual.')
        }
        const phone = await prismaClient.user.update({
            where:{
                id:id
            },data:{
                phone_number:FormatPhone(number)
            }
        })

        return({
            phone_number: FormatPhone(number)
        })

    }
}

export {ChangePhoneServices}