import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import OpenAI from 'openai';

// Завантажуємо змінні середовища з .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Дозвіл на парсинг JSON
app.use(express.json());

// Роздача статичних файлів з папки "modul"
app.use(express.static(path.join(__dirname, 'modul')));

// Віддаємо index.html на /
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'modul', 'index.html'));
});

// Підключення OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Ендпоінт для AI-чату та діагностики
app.post('/ask-ai', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ answer: "❗ Потрібно вказати повідомлення" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }]
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer });

  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ answer: "❌ Сталася помилка AI" });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
