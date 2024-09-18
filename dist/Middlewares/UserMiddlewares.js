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
const jsonwebtoken_1 = require("jsonwebtoken");
function UserMiddlewares(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenDeAuth = req.headers.authorization; // verifico se existe um token no header da aplicação
        if (!tokenDeAuth) {
            return res.status(401).send('Rota não autorizada').end();
        } // se n existe a rota n pode ser acessada
        const [prefix, token] = tokenDeAuth.split(' '); // como o token vem com o prefiro e o token separados por espaços, do um split
        try {
            const { sub } = (0, jsonwebtoken_1.verify)(token, process.env.UJWT_SECRET); // tento pegar o sub dentro do token
            //OBS: esse sub tem nada haver com o do google, ele é um dos 3 elementos que existe dentro do token
            // 1 payload/ 2 obj hash e  3 sub, o sub é aonde envio o id do adm e agr estou usando para pega-lo
            if (!sub) {
                return res.status(401).send('Rota não autorizada').end();
            } // se n tiver sub n deixo seguir
            req.user_id = sub; // se tiver crio o uma tipagem do express passando o id que mandei no sub
            // criar essa tipagem de adm_id para o request, me permite executar qualquer CRUD no banco de dados
            // que envolva o id desse adm sem precisar que fique digitando o id, apenas extraindo direto do token de authenticação
            return next(); // deixo seguir
        }
        catch (err) {
            return res.status(401).send('Rota não autorizada').end(); // caso de erro eu n deixo seguir
        }
    });
}
exports.default = UserMiddlewares;
