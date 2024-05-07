#!/usr/bin/env node


import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import path from 'path';
import axios from 'axios'; // Importe o axios
import { router } from './routes';
import prismaClient from './prisma';

const app = express();
app.use(express.json());
app.use(cors());

app.use(router);

app.get('/', async (req: Request, res: Response) => {
  try {
    console.log('on')
    return res.send({ok:true});
  } catch (error) {
    return res.status(500).send('Erro ao conectar no servidor.');
  }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    // Se for uma instancia do tipo error
    return res.status(400).json({
      error: err.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error.',
  });
});

app.listen(3333, () => console.log('Servidor online!!!!'));