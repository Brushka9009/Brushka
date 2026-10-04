import express from 'express'
import dotenv from 'dotenv'
import OpenAI from 'openai'

dotenv.config()

const app = express()
const port = 3001

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }

  next()
})

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body

    if (!message?.trim()) {
      return res.status(400).json({
        error: 'Сообщение пустое',
      })
    }

    const response = await client.responses.create({
      model: 'gpt-5.6-luna',
      input: [
        {
          role: 'developer',
          content:
            'Ты Горизонт AI — дружелюбный помощник для путешествий. Помогай планировать поездки и создавать понятные маршруты. Отвечай на языке пользователя.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
    })

    res.json({
      reply: response.output_text,
    })
  } catch (error) {
    console.error('OpenAI error:', error.status, error.code, error.message)

    res.status(500).json({
      error: error.message || 'Ошибка OpenAI API',
    })
  }
})

app.listen(port, () => {
  console.log(`Горизонт AI server запущен: http://localhost:${port}`)
})