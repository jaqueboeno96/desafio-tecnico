import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import measureRoutes from './routes/measureRoutes';

dotenv.config();

const app = express();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3002']; // Permite múltiplas origens

app.use(cors({
  origin: allowedOrigins
}));

app.use(express.json());
app.use('/api/measures', measureRoutes);

export default app;
