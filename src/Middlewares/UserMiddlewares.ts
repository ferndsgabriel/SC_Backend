import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface Payload {
    sub: string;
}

export default async function UserMiddlewares(req: Request, res: Response, next: NextFunction) {
    const tokenDeAuth = req.headers.authorization; // verifico se existe um token no header da aplicação

    if (!tokenDeAuth) {
        return res.status(401).send('Rota não autorizada').end();
    } // se n existe a rota n pode ser acessada

    const [prefix, token] = tokenDeAuth.split(' '); // como o token vem com o prefiro e o token separados por espaços, do um split

    try {
        const { sub } = verify(token, process.env.UJWT_SECRET as string) as Payload; // tento pegar o sub dentro do token
        //OBS: esse sub tem nada haver com o do google, ele é um dos 3 elementos que existe dentro do token
        // 1 payload/ 2 obj hash e  3 sub, o sub é aonde envio o id do adm e agr estou usando para pega-lo

        if (!sub) {
            return res.status(401).send('Rota não autorizada').end();
        } // se n tiver sub n deixo seguir

        req.user_id = sub;   // se tiver crio o uma tipagem do express passando o id que mandei no sub
        // criar essa tipagem de adm_id para o request, me permite executar qualquer CRUD no banco de dados
        // que envolva o id desse adm sem precisar que fique digitando o id, apenas extraindo direto do token de authenticação

        return next(); // deixo seguir
    } catch (err) {
        return res.status(401).send('Rota não autorizada').end(); // caso de erro eu n deixo seguir
    }
}
