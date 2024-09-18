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
exports.GotANewMessageUserServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class GotANewMessageUserServices {
    execute(apartment_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findMyConversation = yield prisma_1.default.conversation.findFirst({
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
            const messagesToUpdate = yield prisma_1.default.message.findMany({
                where: {
                    conversation_id: findMyConversation.id,
                    from: 'admin',
                    delivered: false
                }
            });
            if (messagesToUpdate.length === 0) {
                return [];
            }
            // Atualize as mensagens
            const updateResult = yield prisma_1.default.message.updateMany({
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
        });
    }
}
exports.GotANewMessageUserServices = GotANewMessageUserServices;
