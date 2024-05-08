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
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios")); // Importe o axios
const routes_1 = require("./routes");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(routes_1.router);
let location = '';
// Função para obter a localização
function getLocation() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get('https://ipinfo.io/json');
            const data = response.data;
            const pais = data.country;
            location = pais;
        }
        catch (error) {
            location = "Não foi possível obter a localização do servidor";
        }
    });
}
// Rota principal
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield getLocation();
        const data = new Date();
        const dataFormatada = data.toISOString();
        return res.send({
            Data: dataFormatada,
            Servidor: location
        });
    }
    catch (error) {
        return res.status(500).send('Erro ao conectar no servidor.');
    }
}));
app.use((err, req, res, next) => {
    if (err instanceof Error) {
        // Se for uma instancia do tipo error
        return res.status(400).json({
            error: err.message,
        });
    }
    return res.status(500).json({
        status: 'error',
        message: 'Internal server error.',
    });
});
app.listen(3333, () => console.log('Servidor online!!!!'));
