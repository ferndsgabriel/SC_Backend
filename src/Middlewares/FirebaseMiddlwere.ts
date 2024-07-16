import admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";
require('dotenv').config();

const teste = process.env.FIREBASE_TYPE

const credentialFB: any = {
    "type": process.env.FIREBASE_TYPE,
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY,
    "client_email":process.env.FIREBASE__CLIENT_EMAIL,
    "client_id": process.env.FIREBASE__CLIENT_ID,
    "auth_uri": process.env.FIREBASE_AUTH_URI,
    "token_uri": process.env.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url":process.env.FIREBASE_AUTH_PROVIDER,
    "client_x509_cert_url": process.env.FIREBASE_CLIENT,
    "universe_domain": process.env.FIREBASE_DOMAIN
}

admin.initializeApp({
    credential: admin.credential.cert(credentialFB),
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
