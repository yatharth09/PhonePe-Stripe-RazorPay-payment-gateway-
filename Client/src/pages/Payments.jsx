import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Payments(){
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    async function load(){
      try{
        const { data } = await axios.get('http://localhost:5000/orders')
        if(mounted){
          setItems(data.items || [])
          setTotal(data.total || 0)
        }
      }catch(e){
        if(mounted) setError('Failed to load payments')
      }finally{
        if(mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
          <Link to="/" className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">New Payment</Link>
        </div>

        {loading ? (
          <div className="text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <div className="p-4 text-sm text-gray-600">Total records: {total}</div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-2">Order ID</th>
                    <th className="text-left px-4 py-2">Customer</th>
                    <th className="text-left px-4 py-2">Mobile</th>
                    <th className="text-left px-4 py-2">Amount</th>
                    <th className="text-left px-4 py-2">Status</th>
                    <th className="text-left px-4 py-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((o) => (
                    <tr key={o.merchantOrderId} className="border-t">
                      <td className="px-4 py-2 font-mono text-xs">{o.merchantOrderId}</td>
                      <td className="px-4 py-2">{o.customerName}</td>
                      <td className="px-4 py-2">{o.mobileNumber}</td>
                      <td className="px-4 py-2">₹{(o.amount/100).toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${o.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : o.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{o.status}</span>
                      </td>
                      <td className="px-4 py-2 text-gray-500">{new Date(o.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Payments


