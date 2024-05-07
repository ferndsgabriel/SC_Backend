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
exports.EditTowerAdmServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class EditTowerAdmServices {
    execute({ tower_id, newTower }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!tower_id || !newTower) {
                throw new Error('Envie todos os dados!');
            }
            const newTowerExist = yield prisma_1.default.tower.findFirst({
                where: {
                    numberTower: newTower
                }
            });
            if (newTowerExist) {
                throw new Error('Torre já existente.');
            }
            const towerExist = yield prisma_1.default.tower.findFirst(({
                where: {
                    id: tower_id
                }
            }));
            if (!towerExist) {
                throw new Error('Torre inexistente.');
            }
            const updateTower = yield prisma_1.default.tower.update({
                where: {
                    id: tower_id
                },
                data: {
                    numberTower: newTower
                }
            });
            return updateTower;
        });
    }
}
exports.EditTowerAdmServices = EditTowerAdmServices;
