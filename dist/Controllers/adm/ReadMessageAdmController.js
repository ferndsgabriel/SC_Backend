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
exports.ReadMessageAdmController = void 0;
const ReadMessageAdmServices_1 = require("../../Services/adm/ReadMessageAdmServices");
class ReadMessageAdmController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { conversationId } = req.body;
            const readMessage = new ReadMessageAdmServices_1.ReadMessageAdmServices();
            const message = yield readMessage.execute({
                conversationId
            });
            return res.json(message);
        });
    }
}
exports.ReadMessageAdmController = ReadMessageAdmController;
