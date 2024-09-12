import prismaClient from "../../prisma";

interface CreateGuestProps{
    reservation_id: string
    Guest:{
        name: string;
        rg:string;
    }[]
}

class GuestAddServices {
    async execute(createGuest: CreateGuestProps) {

        if (!createGuest) {
            throw new Error('Envie todos os dados');
        }

        for (const item of createGuest.Guest) {
            try {
                if (item.rg.length !== 5) {
                    throw new Error('Digite apenas os 4 últimos dígitos do RG');
                }
                
                const pushGuest = await prismaClient.guest.create({
                    data:{
                        name:item.name,
                        rg:item.rg,
                        reservation_id:createGuest.reservation_id
                    }
                })
            } catch (error) {
                console.error(error);
            }
        }

        return createGuest;
    }
}

export { GuestAddServices };
    