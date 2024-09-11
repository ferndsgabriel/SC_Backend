"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketServer = void 0;
const socket_io_1 = require("socket.io");
const SendMessageUserServices_1 = require("../Services/user/SendMessageUserServices");
const ReadMessageUserServices_1 = require("../Services/user/ReadMessageUserServices");
const ListConversationAdmServices_1 = require("../Services/adm/ListConversationAdmServices");
const SendMessageAdmServices_1 = require("../Services/adm/SendMessageAdmServices");
const GotANewMessageUserServices_1 = require("../Services/user/GotANewMessageUserServices");
const GotANewMessageAdmServices_1 = require("../Services/adm/GotANewMessageAdmServices");
function setupSocketServer(httpServer) {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
    });
    function getMessages(apartment_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const readMessageUserServices = new ReadMessageUserServices_1.ReadMessageUserServices();
            try {
                const response = yield readMessageUserServices.execute({ apartment_id });
                return response;
            }
            catch (error) {
                handleError(error);
            }
        });
    }
    function ListConversationAdmController() {
        return __awaiter(this, void 0, void 0, function* () {
            const listConversation = new ListConversationAdmServices_1.ListConversationAdmServices();
            try {
                const response = yield listConversation.execute();
                return response;
            }
            catch (error) {
                handleError(error);
                return null;
            }
        });
    }
    function handleError(error) {
        console.log('Error:', error);
    }
    function updateConversations(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedConversations = yield ListConversationAdmController();
                socket.emit('listConversation', updatedConversations);
                socket.broadcast.emit('listConversation', updatedConversations);
            }
            catch (error) {
                handleError(error);
            }
        });
    }
    function sendMessage(socket, sendMessageService, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield sendMessageService.execute({
                    apartment_id: data.id,
                    content: data.content,
                    date: data.date,
                });
                socket.emit('newMessage', response);
                socket.broadcast.emit('newMessage', response);
                yield updateConversations(socket);
            }
            catch (error) {
                handleError(error);
            }
        });
    }
    io.on('connection', (socket) => {
        socket.on('getId', ({ id }) => __awaiter(this, void 0, void 0, function* () {
            if (id) {
                const messages = yield getMessages(id);
                socket.emit('oldMessages', messages);
            }
        })); //aqui me conecto conecto como user e pego mensagens anteriores
        socket.on('sendMessageUser', (data) => sendMessage(socket, new SendMessageUserServices_1.SendMessageUserServices(), data)); // envio mensagem com o user
        socket.on('sendMessageAdm', (data) => sendMessage(socket, new SendMessageAdmServices_1.SendMessageAdmServices(), data)); // envio mensagem com o user
        socket.on('deliverMessageUser', ({ id }) => __awaiter(this, void 0, void 0, function* () {
            const gotANewMessageUserServices = new GotANewMessageUserServices_1.GotANewMessageUserServices();
            try {
                const response = yield gotANewMessageUserServices.execute(id);
                socket.broadcast.emit('messageDeliveredAdm', response);
            }
            catch (error) {
                handleError(error);
            }
        }));
        socket.on('admConnected', () => __awaiter(this, void 0, void 0, function* () {
            const response = yield ListConversationAdmController();
            socket.emit('listConversation', response);
        }));
        socket.on('apartmentId', ({ id }) => __awaiter(this, void 0, void 0, function* () {
            if (id) {
                const messages = yield getMessages(id);
                socket.emit('oldMessages', messages);
            }
        }));
        socket.on('deliverMessageAdm', ({ id }) => __awaiter(this, void 0, void 0, function* () {
            const gotANewMessageAdmServices = new GotANewMessageAdmServices_1.GotANewMessageAdmServices();
            try {
                const response = yield gotANewMessageAdmServices.execute(id);
                socket.broadcast.emit('messageDeliveredUser', response);
                yield updateConversations(socket);
            }
            catch (error) {
                handleError(error);
            }
        }));
        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });
    });
}
exports.setupSocketServer = setupSocketServer;
