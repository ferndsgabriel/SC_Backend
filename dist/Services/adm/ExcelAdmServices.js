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
exports.ExcelAdmServices = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const prisma_1 = __importDefault(require("../../prisma"));
class ExcelAdmServices {
    execute({ excelBuffer }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!excelBuffer || !Buffer.isBuffer(excelBuffer)) {
                throw new Error('Envie um buffer contendo o arquivo Excel.');
            }
            function cpfMask(cpf) {
                const noSpace = cpf.trim();
                if (noSpace.length === 11) {
                    const one = noSpace.substring(0, 3);
                    const two = noSpace.substring(3, 6);
                    const three = noSpace.substring(6, 9);
                    const four = noSpace.substring(9, 11);
                    return `${one}.${two}.${three}-${four}`;
                }
                else {
                    return cpf;
                }
            }
            try {
                // Lendo o arquivo Excel a partir do buffer na memória RAM
                const workbook = new exceljs_1.default.Workbook();
                yield workbook.xlsx.load(excelBuffer);
                const worksheet = workbook.getWorksheet(1);
                const columnMap = {};
                worksheet.getRow(1).eachCell((cell, colNumber) => {
                    columnMap[cell.text.toLowerCase()] = colNumber;
                });
                worksheet.eachRow((row, rowNumber) => __awaiter(this, void 0, void 0, function* () {
                    if (rowNumber === 1)
                        return; // Ignorar cabeçalho
                    const cpf = row.getCell(columnMap['cpf']).text.toLowerCase();
                    const status = row.getCell(columnMap['status']).text.toLowerCase();
                    const user = yield prisma_1.default.user.findUnique({
                        where: {
                            cpf: cpfMask(cpf)
                        }
                    });
                    if (user) {
                        const apartment = yield prisma_1.default.apartment.findUnique({
                            where: {
                                id: user.apartment_id
                            }
                        });
                        if (apartment) {
                            const paymentValue = status.toLowerCase() === 'adimplente' ? true : false;
                            yield prisma_1.default.apartment.update({
                                where: {
                                    id: apartment.id
                                },
                                data: {
                                    payment: paymentValue
                                }
                            });
                        }
                    }
                }));
            }
            catch (error) {
                console.log('Erro ao ler o arquivo Excel:', error);
            }
        });
    }
}
exports.ExcelAdmServices = ExcelAdmServices;
