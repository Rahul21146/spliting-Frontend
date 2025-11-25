import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import axios from "axios";
import { jwtDecode as jwt_decode } from "jwt-decode";

export default function LedgerDetails({ ledgerId, onBack }) {
  const [ledger, setLedger] = useState(null);
  const [qrMap, setQrMap] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  // PAYMENT POPUP STATES
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [payData, setPayData] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [holderName, setHolderName] = useState("");
  const [paymentQr, setPaymentQr] = useState("");

  const fallback = "/mnt/data/3b3bb00d-cc95-4799-9b60-3db31cd94245.png";

  // Fetch ledger details
  useEffect(() => {
    const fetchLedger = async () => {
      const token = localStorage.getItem("userToken");
    if (!token) return alert("User not logged in");

    const decoded = jwt_decode(token);
    const user_id = decoded.id;
      try {
        const res = await axios.get(
          `http://localhost:5000/spliting/v1/ledger/${ledgerId}/${user_id}/details`
        );
        if (res.data.success) setLedger(res.data.ledger);
        else alert("Failed to fetch ledger");
      } catch (err) {
        console.error("Error fetching ledger:", err);
      }
    };
    fetchLedger();
  }, [ledgerId]);

  // Fetch ledger transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/spliting/v1/ledger/${ledgerId}/transactions`
        );
        if (res.data.success) {
          setTransactions(res.data.transactions);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };
    fetchTransactions();
  }, [ledgerId]);

  // Generate member QR codes
  useEffect(() => {
    if (!ledger || !ledger.members) return;

    const generateQRs = async () => {
      const map = {};
      for (const m of ledger.members) {
        const url = `spliting://pay?ledger=${ledger.ledger_id}&user=${encodeURIComponent(
          m.id
        )}`;
        try {
          map[m.id] = await QRCode.toDataURL(url, { scale: 6, margin: 1 });
        } catch {
          map[m.id] = fallback;
        }
      }
      setQrMap(map);
    };

    generateQRs();
  }, [ledger]);

  const toggleMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ADD EXPENSE
  const handleAddExpense = async () => {
    if (!expenseTitle.trim()) return alert("Enter expense title");
    if (!expenseAmount || parseFloat(expenseAmount) <= 0)
      return alert("Enter valid amount");
    if (selectedMembers.length === 0)
      return alert("Select at least one member");

    const token = localStorage.getItem("userToken");
    if (!token) return alert("User not logged in");

    const decoded = jwt_decode(token);
    const user_id = decoded.id;

    try {
      const payload = {
        ledger_id: ledger.ledger_id,
        user_id,
        title: expenseTitle,
        amount: parseFloat(expenseAmount),
        selectedMembers,
      };

      const res = await axios.post(
        "http://localhost:5000/spliting/v1/addexpense",
        payload
      );

      if (res.data.success) {
        const perMemberShare =
          parseFloat(expenseAmount) / selectedMembers.length;
        const updatedMembers = ledger.members.map((m) =>
          selectedMembers.includes(m.id)
            ? { ...m, amount: (m.amount || 0) + perMemberShare }
            : m
        );
        setLedger({ ...ledger, members: updatedMembers });

        setExpenseAmount("");
        setExpenseTitle("");
        setSelectedMembers([]);
        setIsExpenseOpen(false);

        const txRes = await axios.get(
          `http://localhost:5000/spliting/v1/ledger/${ledgerId}/transactions`
        );
        if (txRes.data.success) setTransactions(txRes.data.transactions);

        alert("Expense added successfully!");
      } else {
        alert(res.data.message || "Failed to add expense");
      }
    } catch (err) {
      console.error("Add Expense Error:", err);
      alert("Server error while adding expense");
    }
  };

  // OPEN PAYMENT POPUP + GENERATE QR
  const openPaymentPopup = async (tx) => {
    setPayData(tx);
    setIsPayOpen(true);

    const qrPayload = `
PAYMENT REQUEST
Amount: ₹${tx.amount}
Pay To: ${tx.for_member?.username}
Ledger ID: ${ledger.ledger_id}
Transaction ID: ${tx.expense_id}
    `;

    try {
      const qr = await QRCode.toDataURL(qrPayload, { scale: 6, margin: 1 });
      setPaymentQr(qr);
    } catch (err) {
      console.error("QR Error:", err);
      setPaymentQr("");
    }
  };

  // HANDLE PAYMENT
  const handlePayment = () => {
    if (!cardNumber || !cvv || !holderName)
      return alert("Please fill all fields");

    alert("Payment Successful!");
    setIsPayOpen(false);
  };

  if (!ledger) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{ledger.ledger_name}</h2>
          <div className="text-sm text-gray-500">{ledger.description}</div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpenseOpen(true)}
            className="px-3 py-1 bg-green-600 text-white rounded-md"
          >
            + Add Expense
          </button>

          <button onClick={onBack} className="px-3 py-1 bg-gray-100 rounded-md">
            Back
          </button>
        </div>
      </div>

      {/* MEMBERS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Members */}
        <div>
          <h3 className="font-semibold mb-3">Members</h3>
          <div className="space-y-3">
            {ledger.members.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-3 bg-white border rounded-lg"
              >
                <div>
                  <div className="font-semibold">{m.username}</div>
                  <div className="text-xs text-gray-400">{m.email}</div>
                </div>

<div className="text-right">

  {/* THIS MEMBER WILL PAY THE LOGIN USER */}
  {m.you_will_receive > 0 && (
    <div className="text-sm text-green-600 font-semibold">
      Will Pay You: ₹{m.you_will_receive}
    </div>
  )}

  {/* LOGIN USER HAS TO PAY THIS MEMBER */}
  {m.you_have_to_pay > 0 && (
    <>
      <div className="text-sm text-red-600 font-semibold">
        You Pay: ₹{m.you_have_to_pay}
      </div>

      <button
        onClick={() =>
          openPaymentPopup({
            amount: m.you_will_receive,
            for_member: m,
            title: `Pay to ${m.username}`,
            expense_id: 0
          })
        }
        className="text-xs px-2 py-1 bg-blue-600 text-white rounded-md mt-1"
      >
        Pay
      </button>
    </>
  )}

  {/* NO DUES BOTH SIDES */}
  {m.you_have_to_pay === 0 &&
    m.you_will_receive === 0 && (
      <div className="text-sm text-gray-500 font-semibold">
        Settled
      </div>
    )}
</div>


              </div>
            ))}
          </div>
        </div>

        {/* QR CODES */}
        <div>
          <h3 className="font-semibold mb-3">QR Codes</h3>
          <div className="grid grid-cols-2 gap-3">
            {ledger.members.map((m) => (
              <div
                key={m.id}
                className="flex flex-col items-center p-3 bg-white border rounded-lg"
              >
                <div className="font-medium mb-2">{m.username}</div>
                <img
                  src={qrMap[m.id] || fallback}
                  alt="qr"
                  className="w-36 h-36 object-cover rounded-md"
                />
                <div className="text-xs text-gray-400 mt-2">
                  Scan to pay {m.username}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TRANSACTION HISTORY */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3">Transaction History</h3>

        {!transactions.length ? (
          <div className="text-sm text-gray-500">No transactions yet.</div>
        ) : (
          <div className="space-y-2">
            {transactions.map((t) => (
              <div
                key={t.expense_id}
                className="flex items-center justify-between p-3 border rounded bg-white"
              >
                <div>
                  <div className="text-sm">
                    <span className="font-semibold">{t.title}</span> –{" "}
                    {t.added_by?.username} → {t.for_member?.username}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(t.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="font-semibold">₹{t.amount.toFixed(2)}</div>

                  {/* PAY BUTTON */}
                  <button
                    onClick={() => openPaymentPopup(t)}
                    className="mt-1 text-xs px-2 py-1 bg-blue-600 text-white rounded-md"
                  >
                    Pay
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD EXPENSE POPUP */}
      {isExpenseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsExpenseOpen(false)}
          />

          <div className="relative z-10 bg-white w-full max-w-md p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold mb-3">Add New Expense</h3>

            <label className="block mb-3">
              <span className="text-sm text-gray-600">Title</span>
              <input
                className="w-full mt-1 border px-2 py-2 rounded-md"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
              />
            </label>

            <label className="block mb-3">
              <span className="text-sm text-gray-600">Amount (₹)</span>
              <input
                className="w-full mt-1 border px-2 py-2 rounded-md"
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
              />
            </label>

            <div className="mb-3">
              <span className="text-sm text-gray-600">Select Participants</span>
              <div className="mt-2 space-y-2">
                {ledger.members.map((m) => (
                  <label
                    key={m.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(m.id)}
                      onChange={() => toggleMember(m.id)}
                    />
                    <span>{m.username}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={() => setIsExpenseOpen(false)}
                className="px-3 py-1 bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT POPUP */}
      {isPayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsPayOpen(false)}
          />

          <div className="relative z-10 bg-white w-full max-w-sm p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold mb-3">
              Pay ₹{payData.amount.toFixed(2)}
            </h3>

            {/* QR CODE DISPLAY */}
            {paymentQr && (
              <div className="flex justify-center mb-4">
                <img
                  src={paymentQr}
                  alt="payment-qr"
                  className="w-40 h-40 border p-2 rounded-lg"
                />
              </div>
            )}

            <label className="block mb-3">
              <span className="text-sm text-gray-600">Card Holder Name</span>
              <input
                className="w-full mt-1 border px-2 py-2 rounded-md"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
              />
            </label>

            <label className="block mb-3">
              <span className="text-sm text-gray-600">Card Number</span>
              <input
                className="w-full mt-1 border px-2 py-2 rounded-md"
                maxLength={16}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                type="number"
              />
            </label>

            <label className="block mb-3">
              <span className="text-sm text-gray-600">CVV</span>
              <input
                className="w-full mt-1 border px-2 py-2 rounded-md"
                maxLength={3}
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
            </label>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsPayOpen(false)}
                className="px-3 py-1 bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
