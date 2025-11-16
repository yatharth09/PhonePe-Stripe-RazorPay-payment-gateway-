import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import axios from 'axios'

function Success(){
  const [params] = useSearchParams()
  const merchantOrderId = params.get('merchantOrderId')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    async function fetchOrder(){
      if(!merchantOrderId){
        setLoading(false)
        return
      }
      try{
        const { data } = await axios.get(`http://localhost:5000/order/${merchantOrderId}`)
        if(mounted) setOrder(data)
      }catch(e){
        if(mounted) setError('Unable to fetch order details')
      }finally{
        if(mounted) setLoading(false)
      }
    }
    fetchOrder()
    return () => { mounted = false }
  }, [merchantOrderId])

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border border-green-100 p-8 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-600"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53-1.76-1.76a.75.75 0 0 0-1.06 1.06l2.4 2.4a.75.75 0 0 0 1.159-.103l3.717-5.255Z" clipRule="evenodd"/></svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Payment Successful</h1>
        <p className="text-gray-600 mt-1">Thank you! Your payment has been processed.</p>
        {merchantOrderId && (
          <p className="text-sm text-gray-500 mt-2">Order ID: <span className="font-mono">{merchantOrderId}</span></p>
        )}

        {loading ? (
          <p className="text-sm text-gray-500 mt-4">Loading order details...</p>
        ) : error ? (
          <p className="text-sm text-red-600 mt-4">{error}</p>
        ) : order ? (
          <div className="mt-6 text-left bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Customer</div>
              <div className="font-medium">{order.customerName}</div>
              <div className="text-gray-500">Mobile</div>
              <div className="font-medium">{order.mobileNumber}</div>
              <div className="text-gray-500">Amount</div>
              <div className="font-medium">₹{(order.amount/100).toFixed(2)}</div>
              <div className="text-gray-500">Status</div>
              <div className="font-medium text-green-700">{order.status}</div>
            </div>
          </div>
        ) : null}

        <div className="mt-8">
          <Link to="/" className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

export default Success


