import prismaClient from "../../prisma";

interface MessagesProps {
    content: string;
    apartment_id: string;
    date: Date;
}

class SendMessageAdmServices {
    async execute({ content, apartment_id, date }: MessagesProps) {
        if (!content || !apartment_id || !date) {
            throw new Error('Preencha todos os campos');
        }

        let conversationId = '';

        const findConversation = await prismaClient.conversation.findFirst({
            where: {
                apartment_id: apartment_id
            },
            select: {
                id: true
            }
        });

        if (!findConversation) {
            const newConversation = await prismaClient.conversation.create({
                data: {
                    apartment_id,
                },
                select: { id: true }
            });
            conversationId = newConversation.id;
        } else {
            conversationId = findConversation.id;
        }

        const createMessage = await prismaClient.message.create({
            data: {
                conversation_id: conversationId,
                content: content,
                to: 'user',  
                from: 'admin',
                date: date
            },
            select:{
                id:true,
                conversation_id:true,
                content:true,
                from:true,
                to:true,
                date:true,
                conversation:{
                    select:{
                        apartment_id:true
                    }
                }
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

export { SendMessageAdmServices };
