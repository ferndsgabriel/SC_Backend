import admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";

const serviceAccount = require("../config/firebaseKeySC.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://salaocondo.appspot.com',
});

const storage = admin.storage();
const bucket = storage.bucket();

interface CustomFile extends Express.Multer.File {
    firebaseUrl?: string;
}

function uploadMiddleware() {
    return function (req: Request, res: Response, next: NextFunction) {
        const customFile = req.file as CustomFile;

        if (!customFile) return next();

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

        stream.on('finish', async () => {
            await file.makePublic();
            customFile.firebaseUrl = `https://storage.googleapis.com/${bucket.name}/${nameFile}`;
            next();
        });

        stream.end(image.buffer);
    };
}

const uploadMiddlewareInstance = uploadMiddleware();

export default uploadMiddlewareInstance;
