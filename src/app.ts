const express = require('express')
import * as cors from 'cors';
import * as logger from 'morgan'
import path = require('path');
import { conectarServidorNoBd } from './config/db';
import { userRouter } from './routes/usuario'
import { pedidoRouter } from './routes/pedidos';

export const app = express()

app.use(express.json())

// liberar acesso total
app.use(cors())

// configurar logs
app.use(logger('dev'))

// conencar no DB]
conectarServidorNoBd()

// configurar rotas

app.use('/user', userRouter);
app.use('/pedidos',pedidoRouter)

app.get('/favicon.ico', (req, res) => res.status(204));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});