import { useEffect, useState } from "react";
import axios from "axios";

export default function PaymentModel({
  payData,
  paymentQr,
  upiLink,
  setIsPayOpen,
  ledgerId
}) {
  const mainApi = process.env.REACT_APP_MAIN_API || "http://localhost:5000";
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
  if (payData) {
    console.log("💳 Payment Data:", payData);
  }
}, [payData]);


  const handleUPIRedirect = () => {
    if (upiLink) {
      window.location.href = upiLink;
    }
  };

 const submitPayment = async () => {
  if (!utrNumber.trim()) {
    alert("Please enter UTR number");
    return;
  }

  try {
    setLoading(true);

    await axios.post(`${mainApi}/spliting/v1/settlement/mark-paid`, {
      ledger_id: ledgerId,        // make sure this exists
      expense_id: payData.expense_id,
      sender_id: payData.for_member?.id,  // who is paying (current user)
      receiver_id: payData.added_by?.id,  // who will verify
      amount: payData.amount,
      utr_number: utrNumber
    });

    alert("Marked as Paid. Waiting for confirmation.");
    setIsPayOpen(false);

  } catch (err) {
    console.error(err);
    alert("Error marking as paid");
  } finally {
    setLoading(false);
  }
};

  // return (
  //   <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
  //     <div className="bg-gray-900 w-full max-w-md p-6 rounded-2xl border border-gray-800 shadow-2xl">

  //       {/* Header */}
  //       <div className="flex justify-between items-center mb-6">
  //         <h3 className="text-xl font-bold text-white">
  //           Pay ₹{payData?.amount?.toFixed(2)}
  //         </h3>
  //         <button
  //           onClick={() => setIsPayOpen(false)}
  //           className="text-gray-400 hover:text-white text-sm"
  //         >
  //           ✕
  //         </button>
  //       </div>

  //       {/* Step 1 - Select Payment Method */}
  //       {!paymentMethod && (
  //         <div className="space-y-4">

  //           <button
  //             onClick={() => setPaymentMethod("upi")}
  //             className="w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition"
  //           >
  //             Pay with UPI
  //           </button>

  //           <button
  //             onClick={() => setPaymentMethod("qr")}
  //             className="w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition"
  //           >
  //             Pay with QR
  //           </button>

  //         </div>
  //       )}

  //       {/* ================================
  //           UPI SECTION
  //       ================================= */}
  //       {paymentMethod === "upi" && (
  //         <div className="space-y-4">

  //           {/* Instruction */}
  //           <div className="text-sm text-gray-400 text-center leading-relaxed">
  //             Click below to open your UPI app and complete the payment.
  //             <br />
  //             After successful payment, enter the UTR number and click
  //             <span className="text-green-500 font-semibold">
  //               {" "}Submit Payment
  //             </span>.
  //           </div>

  //           <button
  //             onClick={handleUPIRedirect}
  //             className="w-full p-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition"
  //           >
  //             Open UPI App
  //           </button>

  //           <input
  //             type="text"
  //             placeholder="Enter UTR Number"
  //             value={utrNumber}
  //             onChange={(e) => setUtrNumber(e.target.value)}
  //             className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
  //           />

  //           <button
  //             onClick={submitPayment}
  //             disabled={!utrNumber.trim() || loading}
  //             className={`w-full p-3 rounded-lg text-white transition ${
  //               loading || !utrNumber.trim()
  //                 ? "bg-gray-600 cursor-not-allowed"
  //                 : "bg-green-600 hover:bg-green-700"
  //             }`}
  //           >
  //             {loading ? "Submitting..." : "Submit Payment"}
  //           </button>

  //           <button
  //             onClick={() => setPaymentMethod(null)}
  //             className="w-full text-sm text-gray-400 hover:text-white"
  //           >
  //             ← Back
  //           </button>

  //         </div>
  //       )}

  //       {/* ================================
  //           QR SECTION
  //       ================================= */}
  //       {paymentMethod === "qr" && (
  //         <div className="space-y-4">

  //           {/* Instruction */}
  //           <div className="text-sm text-gray-400 text-center leading-relaxed">
  //             Please scan the QR code using your UPI app and complete the payment.
  //             <br />
  //             After payment, enter the UTR number and click
  //             <span className="text-green-500 font-semibold">
  //               {" "}Submit Payment
  //             </span>.
  //           </div>

  //           {paymentQr && (
  //             <div className="flex justify-center">
  //               <img
  //                 src={paymentQr}
  //                 alt="QR"
  //                 className="w-44 h-44 border border-gray-800 p-2 rounded-lg"
  //               />
  //             </div>
  //           )}

  //           <input
  //             type="text"
  //             placeholder="Enter UTR Number"
  //             value={utrNumber}
  //             onChange={(e) => setUtrNumber(e.target.value)}
  //             className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
  //           />

  //           <button
  //             onClick={submitPayment}
  //             disabled={!utrNumber.trim() || loading}
  //             className={`w-full p-3 rounded-lg text-white transition ${
  //               loading || !utrNumber.trim()
  //                 ? "bg-gray-600 cursor-not-allowed"
  //                 : "bg-green-600 hover:bg-green-700"
  //             }`}
  //           >
  //             {loading ? "Submitting..." : "Submit Payment"}
  //           </button>

  //           <button
  //             onClick={() => setPaymentMethod(null)}
  //             className="w-full text-sm text-gray-400 hover:text-white"
  //           >
  //             ← Back
  //           </button>

  //         </div>
  //       )}

  //     </div>
  //   </div>
  // );
return (
  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
    <div className="bg-gray-900 w-full max-w-md sm:max-w-lg p-4 sm:p-6 rounded-2xl border border-gray-800 shadow-2xl max-h-[95vh] overflow-y-auto">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            ₹{payData?.amount?.toFixed(2)}
          </h3>
          <p className="text-sm text-gray-400 break-words">
            {payData?.title}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {payData?.paid === 0 ? (
            <span className="px-2 py-1 text-xs bg-red-600 text-white rounded">
              Unpaid
            </span>
          ) : (
            <span className="px-2 py-1 text-xs bg-green-600 text-white rounded">
              Paid
            </span>
          )}

          <button
            onClick={() => setIsPayOpen(false)}
            className="text-gray-400 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>
      </div>

      {/* EXPENSE DETAILS */}
      <div className="bg-gray-800 rounded-xl p-4 mb-5 border border-gray-700 space-y-3 text-sm">

        <div className="flex justify-between gap-3">
          <span className="text-gray-400">Added By</span>
          <span className="text-gray-200 text-right break-words">
            {payData?.added_by?.username}
          </span>
        </div>

        <div className="flex justify-between gap-3">
          <span className="text-gray-400">Pay To</span>
          <span className="text-gray-200 text-right break-words">
            {payData?.for_member?.username}
          </span>
        </div>

        <div className="flex justify-between gap-3">
          <span className="text-gray-400">UPI ID</span>
          <span className="text-gray-200 text-right text-xs break-all">
            {payData?.for_member?.upi_id || "Not Available"}
          </span>
        </div>

        <div className="flex justify-between gap-3">
          <span className="text-gray-400">Created</span>
          <span className="text-gray-200 text-right text-xs">
            {new Date(payData?.created_at).toLocaleString()}
          </span>
        </div>

      </div>

      {/* PAYMENT METHOD SELECT */}
      {!paymentMethod && payData?.paid === 0 && (
        <div className="space-y-3">

          <button
            onClick={() => setPaymentMethod("upi")}
            className="w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition text-sm sm:text-base"
          >
            Pay with UPI
          </button>

          <button
            onClick={() => setPaymentMethod("qr")}
            className="w-full p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition text-sm sm:text-base"
          >
            Pay with QR
          </button>

        </div>
      )}

      {/* UPI SECTION */}
      {paymentMethod === "upi" && (
        <div className="space-y-4 mt-4">

          <button
            onClick={handleUPIRedirect}
            className="w-full p-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition text-sm sm:text-base"
          >
            Open UPI App
          </button>

          <input
            type="text"
            placeholder="Enter UTR Number"
            value={utrNumber}
            onChange={(e) => setUtrNumber(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-600"
          />

          <button
            onClick={submitPayment}
            disabled={!utrNumber.trim() || loading}
            className={`w-full p-3 rounded-lg text-white transition text-sm sm:text-base ${
              loading || !utrNumber.trim()
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Payment"}
          </button>

          <button
            onClick={() => setPaymentMethod(null)}
            className="w-full text-sm text-gray-400 hover:text-white"
          >
            ← Back
          </button>

        </div>
      )}

      {/* QR SECTION */}
      {paymentMethod === "qr" && (
        <div className="space-y-4 mt-4">

          {paymentQr && (
            <div className="flex justify-center">
              <img
                src={paymentQr}
                alt="QR"
                className="w-36 h-36 sm:w-44 sm:h-44 border border-gray-800 p-2 rounded-lg"
              />
            </div>
          )}

          <input
            type="text"
            placeholder="Enter UTR Number"
            value={utrNumber}
            onChange={(e) => setUtrNumber(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-200 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-600"
          />

          <button
            onClick={submitPayment}
            disabled={!utrNumber.trim() || loading}
            className={`w-full p-3 rounded-lg text-white transition text-sm sm:text-base ${
              loading || !utrNumber.trim()
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Payment"}
          </button>

          <button
            onClick={() => setPaymentMethod(null)}
            className="w-full text-sm text-gray-400 hover:text-white"
          >
            ← Back
          </button>

        </div>
      )}

    </div>
  </div>
);

}
