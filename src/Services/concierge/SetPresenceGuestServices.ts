import prismaClient from "../../prisma";

interface PresenceProps{
    id:string
    value:boolean
}

class SetPresenceGuestServices{
    async execute({id, value}:PresenceProps){
        
        if (!id || value === undefined){
            throw new Error ('Envie todos os dados');
        }

        const updateGuest = await prismaClient.guest.update({
            where:{
                id
            },
            data:{
                attended:value
            }
        });

        return updateGuest; 
    }
}

export {SetPresenceGuestServices}