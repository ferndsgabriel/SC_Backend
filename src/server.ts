// server.ts
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import axios from 'axios';
import { router } from './routes';
import { createServer } from 'http';
import { setupSocketServer } from './socketIo/server';

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(cors());
app.use(router);

let location = '';

// Função para obter a localização
async function getLocation() {
  try {
    const response = await axios.get('https://ipinfo.io/json');
    const data: any = response.data; 
    const pais: string = data.country;
    location = pais;
  } catch (error) {
    location = "Não foi possível obter a localização do servidor";
  }
}

// Rota principal
app.get('/', async (req: Request, res: Response) => {
  try {
    await getLocation();
    const data = new Date();
    const dataFormatada = data.toISOString();
    
    return res.send({
      Data: dataFormatada,
      Servidor: location,
    });
  } catch (error) {
    return res.status(500).send('Erro ao conectar no servidor.');
  }
});

// Tratamento de erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(400).json({
      error: err.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error.',
  });
});

setupSocketServer(httpServer);

// Inicia o servidor HTTP e Socket.IO
httpServer.listen(3333, () => console.log('Servidor online com Socket.IO!'));
