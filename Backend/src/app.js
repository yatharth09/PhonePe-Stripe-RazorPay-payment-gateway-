import express from 'express'
import cors from 'cors'
import { connectDb } from './config/db.js'
import { env, assertEnv } from './config/env.js'
import { createPhonePeClient } from './config/phonepe.js'
import { makeOrderController } from './controllers/orderController.js'
import { createOrderRouter } from './routes/orderRoutes.js'

export async function createApp(){
  assertEnv()
  await connectDb()

  const app = express()
  app.use(express.json())
  app.use(cors())

  const client = createPhonePeClient()
  const controller = makeOrderController(client)
  app.use('/', createOrderRouter(controller))

  // health check
  app.get('/health', (req, res) => res.json({ status: 'ok' }))

  return app
}


