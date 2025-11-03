// src/server.js
import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config'; // запускає скрипт, який витягує змінні з .env в корені додатка. розширений варіант dotenv.config ({шлях}) - якщо десь в іншому місці треба брати змінні оточення
import helmet from 'helmet';

const app = express();
// Використовуємо значення з .env або дефолтний порт 3000
const PORT = process.env.PORT ?? 3000; // process глобальна змінна (як window в js)

// Middleware

app.use(cors()); // Дозволяє запити з будь-яких джерел

app.use(helmet()); // для безпеки від шкідливих запитів - дуже рекомендовано

app.use(express.json()); // Middleware для парсингу JSON у body запиту

// Логування HTTP-запитів
app.use(
  pino({
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss',
        ignore: 'pid,hostname',
        messageFormat:
          '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
        hideObject: true,
      },
    },
  }),
);

// --- Додаткове логування часу ---
app.use((req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
});

// Кореневий маршрут
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello, NoteHub!' });
});

// --- Маршрут для отримання всіх нотаток ---
app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

// --- Маршрут для отримання нотатки за ID ---
app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
});

// Маршрут для тестування middleware помилки
app.get('/test-error', (req, res) => {
  // Штучна помилка для прикладу
  throw new Error('Simulated server error');
});

// Middleware 404 (після всіх маршрутів)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Middleware для обробки помилок сервера 500 (останнє)
app.use((err, req, res, next) => {
  console.error(err);

  const isProd = process.env.NODE_ENV === 'production';

  res.status(500).json({
    message: isProd
      ? 'Something went wrong. Please try again later.'
      : err.message,
  });
});

// --- Запуск сервера ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
