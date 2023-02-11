import express from 'express';
import mongoose from 'mongoose';
import { authRouter } from './routers/AuthRouter';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middleware/error-middleware';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api/auth', authRouter);
app.use(errorMiddleware);

async function start() {
  try {
    await mongoose.connect(process.env.DATABASE!);
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.error(e);
  }
}

start();
