const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/webhook', async (req, res) => {
  const {message, token: API_TOKEN, chatId} = req.body;

  if (!chatId) {
    res.status(400).send({ mensagem: 'ID do chat não encontrado. Por favor, obtenha o ID do chat primeiro.' });
  }

  const response = await fetch(`https://api.telegram.org/bot${API_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    }
  );

  console.log('📩 Recebido Webhook:', req.body);

  if (response.ok) {
    res.status(200).send({ message: 'Message has been sent successfully' });
  } else {
    const errorData = await response.json();
    res.status(500).send({ message: 'error', error: errorData });
  }
});

app.listen(3001, () => {
  console.log('🚀 Webhook escutando em http://localhost:3001/webhook');
});