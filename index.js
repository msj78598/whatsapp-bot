
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// مفتاح OpenAI الخاص بك من بيئة التشغيل
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("✅ Mashhour GPT WhatsApp Bot is Live!");
});

app.post('/webhook', async (req, res) => {
  const userMessage = req.body.Body || '';
  console.log("📩 Received message:", userMessage);

  try {
    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = openaiResponse.data.choices[0].message.content;

    res.set('Content-Type', 'text/xml');
    res.send(`
      <Response>
        <Message>${reply}</Message>
      </Response>
    `);
  } catch (err) {
    console.error("OpenAI Error:", err.message);
    res.send("<Response><Message>⚠️ حدث خطأ أثناء المعالجة. حاول لاحقًا.</Message></Response>");
  }
});

app.listen(port, () => {
  console.log(`🚀 ChatGPT WhatsApp bot running on port ${port}`);
});
