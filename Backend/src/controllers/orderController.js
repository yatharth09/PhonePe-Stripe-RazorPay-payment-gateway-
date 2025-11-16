import { randomUUID } from 'crypto'
import { StandardCheckoutPayRequest } from 'pg-sdk-node'
import { env } from '../config/env.js'
import { Order } from '../models/Order.js'
import { type } from 'os'
const stripe = require('stripe')('')
const Razorpay = require("razorpay");

export function makeOrderController(client){
  return {
    async razorpayOrder(req, res){
      try {
        const merchantOrderId = randomUUID()
        const razorpay = new Razorpay({
            key_id: env.key_id,
            key_secret: env.key_secret
        });

        if(!req.body){
            return res.status(400).send("Bad Request");

        }
        const options = req.body;

        await Order.create({
          merchantOrderId,
          amount: options.amount,
          customerName: options.customerName,
          mobileNumber: options.mobileNumber,
          email: options.email || undefined,
          note: options.note || undefined,
          status: 'PENDING',
          type: 'RAZORPAY'
        })

        const order = await razorpay.orders.create(options);

        if(!order){
            return res.status(400).send("Bad Request");
        }

        res.json(order);
        
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

    },

    async validateRazorpay(req, res){
      const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body
      
          const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
          // order_id + " | " + razorpay_payment_id
      
          sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
      
          const digest = sha.digest("hex");
      
          if (digest!== razorpay_signature) {
              return res.status(400).json({msg: " Transaction is not legit!"});
          }
      
          res.json({msg: " Transaction is legit!", orderId: razorpay_order_id,paymentId: razorpay_payment_id});
    },

    async stripeOrder(req, res){
      // Stripe order creation logic here
      const { amount, customerName, mobileNumber, email, note } = req.body
      const merchantOrderId = randomUUID()

      await Order.create({
          merchantOrderId,
          amount,
          customerName,
          mobileNumber,
          email: email || undefined,
          note: note || undefined,
          status: 'PENDING',
          type: 'STRIPE'
        })

        const product = await stripe.products.create({
          name:"T-Shirt"
      });

      
      if(product){
          var price = await stripe.prices.create({
              product: `${product.id}`,
              unit_amount: amount,
              currency:'inr',
          });
      }


      if(price.id){
        var session = await stripe.checkout.sessions.create({
          line_items: [
              {
                  price: `${price.id}`,
                  quantity: 1,
              }
          ],
          mode:'payment',
          success_url: 'http://localhost:3000/success',
          cancel_url: 'http://localhost:3000/cancel',
          customer_email: email || undefined

        }) 
      }

      res.json(session)

    },



    async createPhonePeOrder(req, res){
      try{
        const { amount, customerName, mobileNumber, email, note } = req.body

        if (!amount) return res.status(400).send('Amount is required')
        if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0) {
          return res.status(400).send('Amount must be a positive number in paise')
        }
        if (!customerName || typeof customerName !== 'string' || !customerName.trim()) {
          return res.status(400).send('Customer name is required')
        }
        if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
          return res.status(400).send('Valid 10-digit mobile number is required')
        }
        if (email && typeof email === 'string') {
          const simpleEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!simpleEmail.test(email)) return res.status(400).send('Email is invalid')
        }

        const merchantOrderId = randomUUID()

        await Order.create({
          merchantOrderId,
          amount,
          customerName,
          mobileNumber,
          email: email || undefined,
          note: note || undefined,
          status: 'PENDING',
          type: 'PHONEPE'
        })

        const redirectUrl = `${env.frontendUrl.replace(/\/$/, '')}/processing`
        const statusCallback = `http://localhost:${env.port}/check-status?merchantOrderId=${merchantOrderId}`

        const request = StandardCheckoutPayRequest.builder()
          .merchantOrderId(merchantOrderId)
          .amount(amount)
          .redirectUrl(statusCallback)
          .build()

        const response = await client.pay(request)

        return res.json({ checkoutPageUrl: response.redirectUrl, merchantOrderId })
      }catch(e){
        console.error('error creating order', e)
        return res.status(500).send('Error creating order')
      }
    },

    async checkPhonePeStatus(req, res){
      try{
        const { merchantOrderId } = req.query
        if(!merchantOrderId) return res.status(400).send('MerchantOrderId is required')

        const response = await client.getOrderStatus(merchantOrderId)
        const status = response.state

        await Order.findOneAndUpdate(
          { merchantOrderId },
          { status, updatedAt: new Date() },
          { new: true }
        )

        const successUrl = `${env.frontendUrl.replace(/\/$/, '')}/success?merchantOrderId=${encodeURIComponent(merchantOrderId)}`
        const failureUrl = `${env.frontendUrl.replace(/\/$/, '')}/failure?merchantOrderId=${encodeURIComponent(merchantOrderId)}`
        return res.redirect(status === 'COMPLETED' ? successUrl : failureUrl)
      }catch(e){
        console.error('error getting status', e)
        return res.status(500).send('Error getting status')
      }
    },

    async getPhonePeOrder(req, res){
      try{
        const { merchantOrderId } = req.params
        const order = await Order.findOne({ merchantOrderId })
        if(!order) return res.status(404).send('Order not found')
        return res.json(order)
      }catch(e){
        return res.status(500).send('Error fetching order')
      }
    },

    async listOrders(req, res){
      try{
        const { limit = 100, skip = 0 } = req.query
        const parsedLimit = Math.min(Number(limit) || 100, 500)
        const parsedSkip = Number(skip) || 0
        const [items, total] = await Promise.all([
          Order.find({}).sort({ createdAt: -1 }).limit(parsedLimit).skip(parsedSkip),
          Order.countDocuments({})
        ])
        return res.json({ total, items })
      }catch(e){
        return res.status(500).send('Error listing orders')
      }
    },

    // Webhook to receive async status updates from PhonePe
    async phonepeWebhook(req, res){
      try{
        // Optional: simple shared-secret check via header
        const signature = req.headers['x-webhook-signature'] || req.headers['x-signature']
        if (env.webhookSecret) {
          if (!signature || signature !== env.webhookSecret) {
            return res.status(401).send('Invalid webhook signature')
          }
        }

        const payload = req.body || {}
        const merchantOrderId = payload.merchantOrderId || payload.orderId || payload.data?.merchantOrderId
        const status = payload.state || payload.status || payload.data?.state
        if(!merchantOrderId){
          return res.status(400).send('merchantOrderId missing')
        }

        const update = { lastWebhook: payload, updatedAt: new Date() }
        if (status) update.status = status

        await Order.findOneAndUpdate(
          { merchantOrderId },
          update,
          { upsert: false }
        )

        return res.json({ ok: true })
      }catch(e){
        console.error('webhook error', e)
        return res.status(500).send('Webhook handling error')
      }
    }
  }
}


