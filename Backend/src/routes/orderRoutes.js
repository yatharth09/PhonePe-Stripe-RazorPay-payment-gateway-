import { Router } from 'express'

export function createOrderRouter(controller){
  const router = Router()
  router.post('/create-order-razorpay', controller.razorpayOrder)
  router.post('/validate-razorpay', controller.validateRazorpay)
  router.post('/create-order-stripe', controller.stripeOrder)
  router.post('/create-order-phonepe', controller.createPhonePeOrder)
  router.get('/check-status', controller.checkPhonePeStatus)
  router.get('/order/:merchantOrderId', controller.getPhonePeOrder)
  router.get('/orders', controller.listOrders)
  router.post('/webhook/phonepe', controller.phonepeWebhook)
  return router
}


