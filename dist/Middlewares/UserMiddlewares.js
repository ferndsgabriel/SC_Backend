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
exports.UserMiddlewares = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const bcryptjs_1 = require("bcryptjs");
const prisma_1 = __importDefault(require("../prisma"));
function UserMiddlewares(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authToken = req.headers.authorization;
        if (!authToken) {
            return res.status(401).end();
        }
        const [item, token] = authToken.split(" ");
        try {
            const { sub } = (0, jsonwebtoken_1.verify)(token, process.env.UJWT_SECRET);
            const tokensInDatabase = yield prisma_1.default.token.findMany({
                where: {
                    user_id: sub,
                },
            });
            if (!tokensInDatabase || tokensInDatabase.length === 0) {
                return res.status(401).end();
            }
            const validTokenExists = tokensInDatabase.some((dbToken) => __awaiter(this, void 0, void 0, function* () {
                return yield (0, bcryptjs_1.compare)(token, dbToken.id);
            }));
            if (!validTokenExists) {
                return res.status(401).end();
            }
            req.user_id = sub;
            return next();
        }
        catch (err) {
            return res.status(401).end();
        }
    });
}
exports.UserMiddlewares = UserMiddlewares;
