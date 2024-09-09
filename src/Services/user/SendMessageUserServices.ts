import prismaClient from "../../prisma";

interface MessagesProps {
    apartment_id: string;
    content: string;
    date: Date;
}

class SendMessageUserServices {
    async execute({ apartment_id, content, date }: MessagesProps) {
        if (!apartment_id || !content) {
            throw new Error('Preencha todos os campos');
        }


        // Verificar se a conversa já existe
        const conversations = await prismaClient.conversation.findMany({
            where: {
                apartment_id 
            }
        });

        let conversationId = '';

        if (conversations.length === 0) {
            // Criar nova conversa
            const newConversation = await prismaClient.conversation.create({
                data: { apartment_id },
                select: { id: true }
            });
            conversationId = newConversation.id;
        } else {
            conversationId = conversations[0].id; // Assumindo que a conversa encontrada é a correta
        }

        // Criar nova mensagem
        const createMessage = await prismaClient.message.create({
            data: {
                conversation_id: conversationId,
                content: content,
                to: 'admin',  
                from: 'user',
                date:date
            }
        });

        const onDay = new Date();

        const updateConversation = await prismaClient.conversation.update({
            where: { id: conversationId }, 
            data: {
                updateDate: onDay,
                messages: {
                    connect: { id: createMessage.id }
                }
            },
            include: { messages: true }
        }).catch((error) => {
            console.log('Erro ao atualizar a conversa:', error);
        });
        
        return createMessage;
    }
}

export { SendMessageUserServices };
