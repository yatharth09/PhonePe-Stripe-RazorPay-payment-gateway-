import axios from "axios"
import { useEffect, useState } from "react"


function App() {

  const [customerName, setCustomerName] = useState("John Doe")
  const [mobileNumber, setMobileNumber] = useState("9876543210")
  const [email, setEmail] = useState("john.doe@example.com")
  const [amountInRupees, setAmountInRupees] = useState(1000)
  const [note, setNote] = useState("Order #1001")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isValidMobile = (val) => /^\d{10}$/.test(val)
  const isValidAmount = Number(amountInRupees) > 0
  const isFormValid = customerName && isValidMobile(mobileNumber) && isValidAmount

  // Load saved values from localStorage on first render
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("pp_form") || "null")
      if (saved && typeof saved === "object") {
        if (saved.customerName) setCustomerName(saved.customerName)
        if (saved.mobileNumber) setMobileNumber(saved.mobileNumber)
        if (saved.email) setEmail(saved.email)
        if (saved.amountInRupees) setAmountInRupees(saved.amountInRupees)
        if (saved.note) setNote(saved.note)
      }
    } catch {}
  }, [])

  // Persist values to localStorage whenever they change
  useEffect(() => {
    const payload = {
      customerName,
      mobileNumber,
      email,
      amountInRupees,
      note,
    }
    try {
      localStorage.setItem("pp_form", JSON.stringify(payload))
    } catch {}
  }, [customerName, mobileNumber, email, amountInRupees, note])

  const createOrderPhonePe = async () => {
    try {
      setError("")
      setLoading(true)

      const amount = Math.round(Number(amountInRupees) * 100)

      const respons = await axios.post("http://localhost:5000/create-order-phonepe", {
        amount,
        customerName,
        mobileNumber,
        email,
        note,
      })

      window.location.href = respons.data.checkoutPageUrl
      
    } catch (error) {
      console.error("error creating order" + error)
      setError("Unable to create order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const createOrderRazorPay = async () => {
    try {
      setError("")
      setLoading(true)

      const amount = Math.round(Number(amountInRupees) * 100)

      const respons = await axios.post("http://localhost:5000/create-order-razorpay", {
        amount,
        customerName,
        mobileNumber,
        email,
        note,
      })

      window.location.href = respons.data.checkoutPageUrl
      
    } catch (error) {
      console.error("error creating order" + error)
      setError("Unable to create order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const createOrderStripe = async () => {
    try {
      setError("")
      setLoading(true)

      const amount = Math.round(Number(amountInRupees) * 100)

      const respons = await axios.post("http://localhost:5000/create-order-stripe", {
        amount,
        customerName,
        mobileNumber,
        email,
        note,
      })

      window.location.href = respons.data.checkoutPageUrl
      
    } catch (error) {
      console.error("error creating order" + error)
      setError("Unable to create order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
  
  <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
      <header className="fixed top-0 left-0 w-full z-30 bg-white/80 backdrop-blur shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-end">
          <a
            href="/payments"
            className="text-sm px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-black/80 transition"
          >
            Payment History
          </a>
        </div>
      </header>
      
      <div className="w-full max-w-xl">
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-8 pt-8 pb-2 text-center relative">
         
            <div className="mx-auto w-20 h-20  flex items-center justify-center mb-4">
              <img src="https://www.phonepe.com/static/pp-logo-4991b763165c94bfc95669f6dc28ad5f.svg" alt="" srcset="" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">PhonePe V2 Payment</h1>
            <p className="text-gray-500 mt-1">Complete your payment securely</p>
          </div>

          <div className="px-8 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile number</label>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/[^\d]/g, "").slice(0, 10))}
                  placeholder="10-digit mobile"
                  className="w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none px-3 py-2"
                />
                {!mobileNumber || isValidMobile(mobileNumber) ? null : (
                  <p className="text-xs text-red-500 mt-1">Enter a valid 10-digit mobile number</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (INR)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={amountInRupees}
                    onChange={(e) => setAmountInRupees(e.target.value)}
                    placeholder="Enter amount in INR"
                    className="w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none pl-8 pr-3 py-2"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Purpose or reference"
                  className="w-full rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none px-3 py-2"
                />
              </div>
            </div>

            {error ? (
              <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
            ) : null}

            <button
              onClick={createOrderPhonePe}
              disabled={!isFormValid || loading}
              className={`mt-6 w-full inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-white font-medium shadow-sm transition 
                ${!isFormValid || loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                  Processing...
                </span>
              ) : (
                <span>Pay Now Using Phone Pe</span>
              )}
              
            </button>
            <button
              onClick={createOrderStripe}
              disabled={!isFormValid || loading}
              className={`mt-6 w-full inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-white font-medium shadow-sm transition 
                ${!isFormValid || loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                  Processing...
                </span>
              ) : (
                <span>Pay Now Using Stripe</span>
              )}
              
            </button>
            <button
              onClick={createOrderRazorPay}
              disabled={!isFormValid || loading}
              className={`mt-6 w-full inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-white font-medium shadow-sm transition 
                ${!isFormValid || loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                  Processing...
                </span>
              ) : (
                <span>Pay Now Using RazorPay</span>
              )}
              
            </button>
            <p className="text-[11px] text-gray-500 text-center mt-2">You will be redirected to secure PhonePe checkout</p>
          </div>
        </div>
      </div>
    </div>
  
  </>
  )
}

export default App
