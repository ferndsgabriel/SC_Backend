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
exports.PhotoUserController = void 0;
const PhotoUserServices_1 = require("../../Services/user/PhotoUserServices");
class PhotoUserController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.user_id;
            const { firebaseUrl } = req.file ? req.file : '';
            if (!req.file) {
                throw new Error('Imagem não localizada!');
            }
            const photoUserServices = new PhotoUserServices_1.PhotoUserServices();
            const photoservices = yield photoUserServices.execute({
                id,
                image: firebaseUrl
            });
            return res.json(photoservices);
        });
    }
}
exports.PhotoUserController = PhotoUserController;
