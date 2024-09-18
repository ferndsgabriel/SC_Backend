import prismaClient from "../../prisma";

interface MessagesProps {
    apartment_id: string;
}

class ReadMessageUserServices {
    async execute({ apartment_id }: MessagesProps) {
        if (!apartment_id) {
            throw new Error('Preencha todos os campos');
        }

        const conversations = await prismaClient.conversation.findFirst({
            where: { 
                apartment_id
            },
            select: {
                messages: {
                    orderBy: {
                        date: 'asc' 
                    }
                },
                id: true,
            }
        });

        return conversations;
    }
}

export { ReadMessageUserServices };
