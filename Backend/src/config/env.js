import dotenv from 'dotenv'

dotenv.config()

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/phonepe_demo',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  clientVersion: Number(process.env.CLIENT_VERSION || 1),
  phonepeEnv: (process.env.PHONEPE_ENV || 'SANDBOX').toUpperCase(),
  webhookSecret: process.env.WEBHOOK_SECRET || '',
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
}

export function assertEnv() {
  const missing = []
  if (!env.clientId) missing.push('CLIENT_ID')
  if (!env.clientSecret) missing.push('CLIENT_SECRET')
  if (missing.length) {
    throw new Error(`Missing required env: ${missing.join(', ')}`)
  }
}

