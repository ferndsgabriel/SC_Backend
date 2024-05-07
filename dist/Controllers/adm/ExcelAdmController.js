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
exports.upload = exports.ExcelAdmController = void 0;
const ExcelAdmServices_1 = require("../../Services/adm/ExcelAdmServices");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
exports.upload = upload;
class ExcelAdmController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verifica se o arquivo foi enviado corretamente
                if (!req.file) {
                    throw new Error('Arquivo Excel não encontrado.');
                }
                const excelFileBuffer = req.file.buffer; // Buffer contendo o arquivo Excel
                const excelAdmServices = new ExcelAdmServices_1.ExcelAdmServices();
                const excelAdm = yield excelAdmServices.execute({
                    excelBuffer: excelFileBuffer // Passando o buffer do arquivo Excel
                });
                // Limpar a memória liberando o buffer original
                req.file.buffer = Buffer.allocUnsafe(0);
                return res.json(excelAdm);
            }
            catch (error) {
                console.log('Erro ao processar o arquivo Excel:', error);
                return res.status(500).json({ error: 'Erro ao processar o arquivo Excel.' });
            }
        });
    }
}
exports.ExcelAdmController = ExcelAdmController;
