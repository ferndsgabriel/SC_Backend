import prismaClient from "../../prisma"

class GotANewMessageAdmServices {
    async execute(apartment_id: string) {

        const findMyConversation = await prismaClient.conversation.findFirst({
            where: {
                apartment_id: apartment_id
            },
            select: {
                id: true
            }
        });

        if (!findMyConversation) {
            return;
        }

        // Encontre as mensagens que precisam ser atualizadas
        const messagesToUpdate = await prismaClient.message.findMany({
            where: {
                conversation_id: findMyConversation.id,
                from: 'user',
                delivered: false
            }
        });

        if (messagesToUpdate.length === 0) {
            return [];
        }

        // Atualize as mensagens
        const updateResult = await prismaClient.message.updateMany({
            where: {
                id: {
                    in: messagesToUpdate.map(message => message.id)
                }
            },
            data: {
                delivered: true
            }
        });

        return messagesToUpdate;
    }
}

export { GotANewMessageAdmServices }
