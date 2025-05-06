import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import userRoutes from './routes/userRoutes.js';
import tasksRoutes from './routes/tasksRoutes.js';
import { requestLogger } from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';
import swaggerUi from 'swagger-ui-express';
import './config/index.js';

const app = express();

// 1) CORS with credentials so cookies work across ports
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// 2) Body & cookie parsers
app.use(express.json());
app.use(cookieParser());

// 3) Request logging
app.use(requestLogger);

// 4) Swagger UI (reads swagger.json at startup)
const swaggerPath = path.resolve('./swagger.json');
const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 5) Mount your routers under the correct base paths
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/tasks', tasksRoutes);

// 6) Global error handler (always last)
app.use(errorHandler);

export default app;
