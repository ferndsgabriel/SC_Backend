import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { compare } from 'bcryptjs';

interface Payload {
    sub: string;
}

export default async function Conciergeiddlewares(req: Request, res: Response, next: NextFunction) {
    const tokenDeAuth = req.headers.authorization; 

    if (!tokenDeAuth) {
        return res.status(401).send('Rota não autorizada').end();
    } 
    const [prefix, token] = tokenDeAuth.split(' ');

    try {
        const { sub } = verify(token, process.env.AJWT_SECRET as string) as Payload; 
        if (!sub) {
            return res.status(401).send('Rota não autorizada').end();
        } 

        const secutiyCode = process.env.CONCIERGE_PASS;

        const compareCode = await compare(sub, secutiyCode);

        if (!compareCode) {
            return res.status(401).send('Rota não autorizada').end();
        }
        
        return next(); 
    } catch (err) {
        return res.status(401).send('Rota não autorizada').end();
    }
}
