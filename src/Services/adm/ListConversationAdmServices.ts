import prismaClient from "../../prisma"

class ListConversationAdmServices {
    async execute() {
        const listConversation = await prismaClient.conversation.findMany({
            select: {
                apartment_id: true,
                id: true,
                createDate: true,
                messages: true,
                apartment: {
                    select: {
                        numberApt: true,
                        tower: {
                            select: {
                                numberTower: true
                            }
                        },
                        user: {
                            select: {
                                photo: true,
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                updateDate: 'desc'
            }
        });

        const updatedConversations = listConversation.map(conversation => {
            if (conversation.messages.length === 0) {
                return {
                    ...conversation,
                    lastMessage: null,
                    undeliveredCount: 0
                };
            }

            // Encontrar a última mensagem
            const lastMessage = conversation.messages.reduce((latest, message) => {
                return (new Date(message.date) > new Date(latest.date)) ? message : latest;
            });

            // Contar mensagens não entregues
            const undeliveredCount = conversation.messages.filter(message => !message.delivered && message.to === 'admin').length;
            
            return {
                ...conversation,
                lastMessage,
                undeliveredCount
            };
        });

        return updatedConversations;
    }
}

export { ListConversationAdmServices }
