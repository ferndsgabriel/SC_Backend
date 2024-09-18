import prismaClient from "../../prisma";

interface MessagesProps {
    conversationId: string;
}

class ReadMessageAdmServices{
    async execute({ conversationId }: MessagesProps) {

        if (!conversationId) {
            throw new Error('Preencha todos os campos');
        }

        const conversations = await prismaClient.conversation.findMany({
            where: { 
                id:conversationId
            },select:{
                messages: {
                    orderBy: {
                        date: 'asc' 
                    }
                },
                id:true,
            }
        });

        return conversations;
    }
}

export { ReadMessageAdmServices};
