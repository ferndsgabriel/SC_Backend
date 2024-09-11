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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageUserServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class SendMessageUserServices {
    execute({ apartment_id, content, date }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!apartment_id || !content) {
                throw new Error('Preencha todos os campos');
            }
            // Verificar se a conversa já existe
            const conversations = yield prisma_1.default.conversation.findMany({
                where: {
                    apartment_id
                }
            });
            let conversationId = '';
            if (conversations.length === 0) {
                // Criar nova conversa
                const newConversation = yield prisma_1.default.conversation.create({
                    data: { apartment_id },
                    select: { id: true }
                });
                conversationId = newConversation.id;
            }
            else {
                conversationId = conversations[0].id; // Assumindo que a conversa encontrada é a correta
            }
            // Criar nova mensagem
            const createMessage = yield prisma_1.default.message.create({
                data: {
                    conversation_id: conversationId,
                    content: content,
                    to: 'admin',
                    from: 'user',
                    date: date
                },
                select: {
                    id: true,
                    conversation_id: true,
                    content: true,
                    from: true,
                    to: true,
                    date: true,
                    conversation: {
                        select: {
                            apartment_id: true
                        }
                    }
                }
            });
            const onDay = new Date();
            const updateConversation = yield prisma_1.default.conversation.update({
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
        });
    }
}
exports.SendMessageUserServices = SendMessageUserServices;
