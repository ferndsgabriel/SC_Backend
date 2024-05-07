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
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const serviceAccount = require("../config/firebaseKeySC.json");
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(serviceAccount),
    storageBucket: 'gs://salaocondo.appspot.com',
});
const storage = firebase_admin_1.default.storage();
const bucket = storage.bucket();
function uploadMiddleware() {
    return function (req, res, next) {
        const customFile = req.file;
        if (!customFile)
            return next();
        const image = customFile;
        const typeFile = image.originalname.split('.').pop();
        const nameFile = `${Date.now()}.${typeFile}`;
        const file = bucket.file(nameFile);
        const stream = file.createWriteStream({
            metadata: {
                contentType: image.mimetype
            }
        });
        stream.on('error', (e) => {
            console.error(e);
            next(e); // chame next com o erro para tratamento de erro adequado
        });
        stream.on('finish', () => __awaiter(this, void 0, void 0, function* () {
            yield file.makePublic();
            customFile.firebaseUrl = `https://storage.googleapis.com/${bucket.name}/${nameFile}`;
            next();
        }));
        stream.end(image.buffer);
    };
}
const uploadMiddlewareInstance = uploadMiddleware();
exports.default = uploadMiddlewareInstance;
