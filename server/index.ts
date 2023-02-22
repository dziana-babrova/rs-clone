import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import errorMiddleware from './middleware/error-middleware';
import authRouter from './routers/AuthRouter';
import mapsRouter from './routers/MapsRouter';
import winnersRouter from './routers/WinnersRouter';
import path from 'path';
import { createServer } from 'http'
import { Server } from 'socket.io'
import SocketController from './online/socket/SocketController';
import State from './online/State';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: process.env.CLIENT,
}));
app.use('/api/auth', authRouter);
app.use('/api/maps', mapsRouter);
app.use('/api/winners', winnersRouter);
app.use(errorMiddleware);

const io = new Server(server, {
  cors: {
  origin: process.env.CLIENT,
  methods: ["GET", "POST"]
  }
});

const state = new State();

io.on('connection', (socket) => {
  new SocketController(io, socket, state);
});

async function start() {
  try {
    await mongoose.connect(process.env.DATABASE!);
    // app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.error(e);
  }
}

start();
