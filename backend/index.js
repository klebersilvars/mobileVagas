const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const app = express();

// Inicializa o Firebase Admin com as credenciais fornecidas
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "novostalentos-84288",
    clientEmail: "firebase-adminsdk-bhcbt@novostalentos-84288.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCZzuIsJkwONhG8\nmfYuU4IxALsupxuRIHviZ+O9ugM86xCFoDUpap6MKEjzwB68fU/Qk8Bt19XJxPG3\nMxhLmIg75in5WqDbNNMKIzA+JoZFbewtUbmsJOArvMHsTFJiIw08bVaVcOe+OPCA\nBdTxWz+SkccltvxMjs6l9pNtpundn/N6ycSUOjqOK403rbsf32qewmSAXNQwHEhg\nMGNglc2wirgaADOeryZSGwk6L6OCZnnxwIDJJnLAcxqww/Iq9zT8ZUMJ4h4ElYJy\nJHVG3PdpeB6xO1Gn9tMb5Jqp0s2n6tmjhniPzGX/Eqiw3dw+v1KjfKqyVvxy8JyO\nX3SltNTRAgMBAAECggEAG4Fr4QlYQJJayaee5tn4RlsjHky0GVf9z5dUmvFQ8uv2\noG7uEuIGSHpL0Yth88NVKq/BkeMvUE3wDBsPFTXJ5yxaBUW3znu74ew5DGRHTtNB\nkTk0Qxy1Gh0/cMqVUQeDrnK/MSpnxxTXrY1db2wqCkQXoR8AL5C6U+OsqcdXu1JA\nOFYRE9wqYOh73Gxg38wI7AwtNeq2EpUpeHRQ5+PRFaKyOPuMtdlSyUlR3CEKb/Xc\nrA6JtuaflIDe2K4Qpdfx782k9EqAiGYSKUai3Oxk3FBCK2SzBTL0gMbQB9nmiUHG\nj5jBf91Ws6wGbCY59ym2QJv6v2Ajx6sJwWm3nYjvgQKBgQDXtf7HaMoLjRu3MyCn\nRm7B/pJ/PHQPkidJj4ogtvs5XtgqIClDQCNFAZuSDWH1NFwfnnUez09u2lOGH41O\npSdBOr2w3RKmt8CoQWyMyZt+16KzgzuyK6QTtxKnR/JLsA8wTuQYUO8cmmhkqGwl\nZ4QjU6fmyZXfndanQBtaxWjHBQKBgQC2iRFhQYQklVtlYByZ9iplWPR0gnglT0Bl\ncRzhwzAjk9fHNizJ5SRq9KrodwGcdYarXVwINqS43Y0SWVzg8n16UJq19I4Bok/Q\n8XGSFoXBxZ7ugeZ+l6Clc0BfDchtoQDiypn23IJGv/8lRjO4pSyQEb+MRG6QhGU9\n5uqcE6joXQKBgQC9wt/YIoojcUYhervOC7rhtAbCIbdj/0nKf5iewPnudU4qeNJz\n09dzHD/0UwuKvz4PnsEfknYpaa0yf007EzSeQIOhNEn1Gg9EtRE+JRlCk4YQ73Cz\ng4q6wUGKoVM4XDBwaeZkscY33mnZqwRAP3lR7oT1FP9gkaTEyzOFPca31QKBgQCT\n/u4ofIY3YyGHQDXwXrZhFY6eKGphVbBQjzVrlmYhcm0xB6uoxjCQx28Kq/KSeHeH\n2VoVDrjfakJG7k1v1SwHT/MgM/gvOvqb3ibG25v3T9NcbdYELcwCWT+H0hT/Tdr6\nBmpuzLqTwneMMS8eNk27QaicgZ9jbPTpC6CMiyQXwQKBgQCAzaf3BdojlXFsVo5I\nvcxlcgnSUfDScBOuk8gSLBA/91kI2HFisxijJ5Pk/5oCjD4qaN95hiYMHVdKNhlJ\nVF+KPLktEGdOX83Ug4UwE8LSDLo7gZnc4vjuSmH5xfGKTz20Pqo1jbxvQUFFILtf\nAmLHWP4uEba+U6ro/qFIuPQ/BQ==\n-----END PRIVATE KEY-----\n"
  })
});

const db = admin.firestore();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

app.use(express.json());

// Endpoint para criar sessão de checkout
app.post('/api/create-checkout-session', async (req, res) => {
  const { email } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: { name: 'Assinatura Plano Empresa' },
            unit_amount: 500, // valor em centavos (R$49,90)
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: 'https://SEU_FRONTEND/sucesso',
      cancel_url: 'https://SEU_FRONTEND/cancelado',
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Webhook Stripe (precisa do bodyParser.raw!)
app.post('/webhook-stripe', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_ENDPOINT_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_email;

    try {
      // Busca a empresa pelo email
      const empresasRef = db.collection('user_empresa');
      const snapshot = await empresasRef.where('email_empresa', '==', email).get();

      if (snapshot.empty) {
        console.log('Nenhuma empresa encontrada com o email:', email);
        return res.status(404).json({ error: 'Empresa não encontrada' });
      }

      // Atualiza o documento da empresa
      const empresaDoc = snapshot.docs[0];
      await empresaDoc.ref.update({
        premium: true,
        limite_publicacao_mensal: 20, // Limite de 20 publicações mensais
        publicacao_restante: 20, // 20 publicações disponíveis
        data_pagamento_premium: new Date().toISOString() // Data do pagamento
      });

      console.log('Empresa atualizada com sucesso:', email);
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      return res.status(500).json({ error: 'Erro ao atualizar empresa' });
    }
  }

  res.json({ received: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`)); 