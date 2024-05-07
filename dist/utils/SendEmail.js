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
exports.SendEmail = void 0;
const FormatEmail_1 = require("./FormatEmail");
const nodemailer_1 = __importDefault(require("nodemailer"));
function SendEmail(email, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const myEmail = (0, FormatEmail_1.FormatEmail)(email);
        const user = process.env.NODEMAILER_EMAIL;
        const pass = process.env.NODEMAILER_PASS;
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            secure: false,
            port: 587,
            auth: { user, pass }
        });
        yield new Promise((resolve, reject) => {
            // verify connection configuration
            transporter.verify(function (error, success) {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                else {
                    console.log("Server is ready to take our messages");
                    resolve(success);
                }
            });
        });
        yield new Promise((resolve, reject) => {
            transporter.sendMail({
                from: user,
                to: myEmail,
                subject: 'Email de salãoCondo',
                html: message
            }).then((inf) => {
                console.log('sucess');
            }).catch((e) => {
                console.log(e);
            });
        });
    });
}
exports.SendEmail = SendEmail;
