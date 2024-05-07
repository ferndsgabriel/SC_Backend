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
exports.CreateTowerAdmServices = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
class CreateTowerAdmServices {
    execute({ numberTower }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!numberTower) {
                throw new Error('Dados incompletos: Envie todos os campos obrigatórios.');
            }
            const towerExist = yield prisma_1.default.tower.findFirst({
                where: {
                    numberTower: numberTower
                }
            });
            if (towerExist) {
                throw new Error('Torre já existente.');
            }
            const createTower = yield prisma_1.default.tower.create({
                data: {
                    numberTower: numberTower
                },
                select: {
                    numberTower: true,
                    apartment: true
                }
            });
            return createTower;
        });
    }
}
exports.CreateTowerAdmServices = CreateTowerAdmServices;
