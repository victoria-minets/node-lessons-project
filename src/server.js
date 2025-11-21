// src/server.js

import express from 'express';
import 'dotenv/config'; // запускає скрипт, який витягує змінні з .env в корені додатка. розширений варіант dotenv.config ({шлях}) - якщо десь в іншому місці треба брати змінні оточення
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

// Імпортуємо middleware
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import studentsRoutes from './routes/studentsRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3030; // Використовуємо значення з .env або дефолтний порт 3000

// Глобальні middleware
app.use(logger); // 1. Логер першим — бачить усі запити
app.use(express.json({ limit: '100kb' })); // 2. Парсинг JSON у body запиту
app.use(cors()); // 3. Дозвіл для запитів з інших доменів
app.use(cookieParser());
app.use(helmet()); // для безпеки від шкідливих запитів - дуже рекомендовано

app.use(authRoutes);

// підключаємо групу маршрутів студента
app.use(studentsRoutes);

// 404 — якщо маршрут не знайдено
app.use(notFoundHandler);
// обробка помилок від celebrate (валідація)
app.use(errors());
// Error — якщо під час запиту виникла помилка
app.use(errorHandler);

await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
