import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { SendMessageUserServices } from '../Services/user/SendMessageUserServices';
import { ReadMessageUserServices } from '../Services/user/ReadMessageUserServices';
import { ListConversationAdmServices } from '../Services/adm/ListConversationAdmServices';
import { SendMessageAdmServices } from '../Services/adm/SendMessageAdmServices';
import { GotANewMessageUserServices } from '../Services/user/GotANewMessageUserServices';
import { GotANewMessageAdmServices } from '../Services/adm/GotANewMessageAdmServices';
import _ from 'lodash'; 

interface dataMessageProps {
    id: string;
    content: string;
    date: Date;
}

interface messageProps {
    id: string;
    conversation_id: string;
    from: string;
    to: string;
    content: string;
    date: Date;
}

interface conversationsAdmProps {
    id: string;
    apartment_id: string;
    createDate: Date;
    apartment: {
        numberApt: string;
        tower: {
            numberTower: string;
        };
        user: {
            photo: string | null;
            name: string;
        }[];
    };
}

export function setupSocketServer(httpServer: HTTPServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });

    async function getMessages(apartment_id: string) {
        const readMessageUserServices = new ReadMessageUserServices();
        try {
            const response = await readMessageUserServices.execute({ apartment_id });
            return response;
        } catch (error) {
            handleError(error);
        }
    }

    async function ListConversationAdmController() {
        const listConversation = new ListConversationAdmServices();
        try {
            const response: conversationsAdmProps[] | null = await listConversation.execute();
            return response;
        } catch (error: any) {
            handleError(error);
            return null;
        }
    }

    function handleError(error: any) {
        console.log('Error:', error);
    }

    async function updateConversations(socket: Socket) {
        try {
            const updatedConversations = await ListConversationAdmController();
            socket.emit('listConversation', updatedConversations);
            socket.broadcast.emit('listConversation', updatedConversations);
        } catch (error) {
            handleError(error);
        }
    }

    async function sendMessage(socket: Socket, sendMessageService: any, data: dataMessageProps) {
        try {
            const response = await sendMessageService.execute({
                apartment_id: data.id,
                content: data.content,
                date: data.date,
            });

            socket.emit('newMessage', response);
            socket.broadcast.emit('newMessage', response);
            await updateConversations(socket);
        } catch (error) {
            handleError(error);
        }
    }

    io.on('connection', (socket) => {
        socket.on('getId', async ({ id }) => {
            if (id) {
                const messages = await getMessages(id);
                socket.emit('oldMessages', messages);
            }
        });

        socket.on('sendMessageUser', (data: dataMessageProps) =>
            sendMessage(socket, new SendMessageUserServices(), data)
        );

        socket.on('sendMessageAdm', (data: dataMessageProps) =>
            sendMessage(socket, new SendMessageAdmServices(), data)
        );

        socket.on('deliverMessageUser', async ({ id }) => {
            const gotANewMessageUserServices = new GotANewMessageUserServices();
            try {
                const response = await gotANewMessageUserServices.execute(id);
                socket.broadcast.emit('messageDeliveredAdm', response);
            } catch (error) {
                handleError(error);
            }
        });

        socket.on('admConnected', async () => {
            const response = await ListConversationAdmController();
            socket.emit('listConversation', response);
        });

        socket.on('apartmentId', async ({ id }) => {
            if (id) {
                const messages = await getMessages(id);
                socket.emit('oldMessages', messages);
            }
        });

        socket.on('deliverMessageAdm', async ({ id }) => {
            const gotANewMessageAdmServices = new GotANewMessageAdmServices();
            try {
                const response = await gotANewMessageAdmServices.execute(id);
                socket.broadcast.emit('messageDeliveredUser', response);
                await updateConversations(socket);
            } catch (error) {
                handleError(error);
            }
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
    });
}