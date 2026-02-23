export default function PaymentModel({ payData, paymentQr, holderName, cardNumber, cvv, setHolderName, setCardNumber, setCvv, setIsPayOpen, handlePayment }) {
  return (
    <>

        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-5">
          <div className="bg-gray-900 w-full max-w-sm p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-bold text-white">
              Pay ₹{payData.amount.toFixed(2)}
            </h3>

            {paymentQr && (
              <div className="flex justify-center my-4">
                <img src={paymentQr} alt="Payment QR" className="w-40 h-40 border border-gray-800 p-2 rounded" />
              </div>
            )}

            <label className="block mb-3">
              <span className="text-sm text-gray-400">Card Holder Name</span>
              <input
                className="w-full border border-gray-800 p-2 rounded bg-gray-800 text-gray-200"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
              />
            </label>

            <label className="block mb-3">
              <span className="text-sm text-gray-400">Card Number</span>
              <input
                className="w-full border border-gray-800 p-2 rounded bg-gray-800 text-gray-200"
                maxLength={16}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                type="number"
              />
            </label>

            <label className="block mb-3">
              <span className="text-sm text-gray-400">CVV</span>
              <input
                className="w-full border border-gray-800 p-2 rounded bg-gray-800 text-gray-200"
                maxLength={3}
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsPayOpen(false)}
                className="px-3 py-1 bg-gray-800 text-gray-200 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
        </>
    
  );
}