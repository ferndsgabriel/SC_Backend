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
exports.ListConversationAdmServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class ListConversationAdmServices {
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const listConversation = yield prisma_1.default.conversation.findMany({
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
                    return Object.assign(Object.assign({}, conversation), { lastMessage: null, undeliveredCount: 0 });
                }
                // Encontrar a última mensagem
                const lastMessage = conversation.messages.reduce((latest, message) => {
                    return (new Date(message.date) > new Date(latest.date)) ? message : latest;
                });
                // Contar mensagens não entregues
                const undeliveredCount = conversation.messages.filter(message => !message.delivered && message.to === 'admin').length;
                return Object.assign(Object.assign({}, conversation), { lastMessage,
                    undeliveredCount });
            });
            return updatedConversations;
        });
    }
}
exports.ListConversationAdmServices = ListConversationAdmServices;
