import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-03-31.basil' });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  try {
    const { email } = req.body;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: 'price_1RI8EbKIrnZlDBR3uXUQaIIl', // Substitua pelo ID do preço do seu produto no Stripe
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: 'https://google.com',
      cancel_url: 'https://google.com',
    });
    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
} 