import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import admin from 'firebase-admin';

// Inicialização do Firebase Admin (apenas uma vez)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}
const db = admin.firestore();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' });
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const sig = req.headers['stripe-signature'] as string;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const email = session.customer_email;
    const empresaRef = db.collection('user_empresa').where('email_empresa', '==', email);
    const snapshot = await empresaRef.get();
    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await docRef.update({
        premium: true,
        data_pagamento_premium: admin.firestore.FieldValue.serverTimestamp(),
        dias_restantes_premium: 30,
        limite_publicacao_mensal: 20,
        publicacao_restante: 20,
      });
    }
  }

  return res.json({ received: true });
}

export const config = {
  api: {
    bodyParser: false, // Necessário para webhooks Stripe
  },
}; 