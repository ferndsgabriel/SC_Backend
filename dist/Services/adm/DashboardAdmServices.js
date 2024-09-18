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
const googleapis_1 = require("googleapis");
const path_1 = __importDefault(require("path"));
class DashboardAdmServices {
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            const keyFilePath = path_1.default.resolve(__dirname, '../../config/googlesheets.json');
            const credentials = require(keyFilePath);
            const auth = new googleapis_1.google.auth.GoogleAuth({
                credentials,
                scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
            });
            const authClient = yield auth.getClient();
            const spreadsheetId = '1sl7irZJyY3qaO7dLP6cP2xxrMXc2nIXtOxGTvg8EVzQ'; // ID da sua planilha
            const range = 'Sheet1!A1:D10'; // Intervalo de células a ser lido
            const sheets = googleapis_1.google.sheets({ version: 'v4' });
            const response = yield sheets.spreadsheets.values.get({
                auth: authClient,
                spreadsheetId,
                range,
            });
            return response.data.values;
        });
    }
}
exports.default = DashboardAdmServices;
