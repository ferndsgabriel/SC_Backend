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
exports.DeleteTowerAdmServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class DeleteTowerAdmServices {
    execute({ tower_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!tower_id) {
                throw new Error('Torre não inserida.');
            }
            const towerExist = yield prisma_1.default.tower.findFirst({
                where: {
                    id: tower_id
                }
            });
            if (!towerExist) {
                throw new Error('Torre inexistente.');
            }
            const towerContainsApt = yield prisma_1.default.apartment.findFirst({
                where: {
                    tower_id: tower_id
                }
            });
            if (towerContainsApt) {
                throw new Error('Impossível excluir. Torre possui apartamentos.');
            }
            const deleteTower = yield prisma_1.default.tower.delete({
                where: {
                    id: tower_id
                }
            });
            return { ok: true };
        });
    }
}
exports.DeleteTowerAdmServices = DeleteTowerAdmServices;
