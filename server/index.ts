import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import errorMiddleware from './middleware/error-middleware';
import authRouter from './routers/AuthRouter';

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
