import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import axios from "axios";
import { jwtDecode as jwt_decode } from "jwt-decode";

export default function LedgerDetails({ ledgerId, onBack }) {
  const [ledger, setLedger] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [activities, setActivities] = useState([]);

  // Show limited preview
  const previewActivities = activities.slice(0, 2);
  const previewTransactions = transactions.slice(0, 4);

  // FULLSCREEN POPUP STATES
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  // Expense popup
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Payment popup
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [payData, setPayData] = useState(null);
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [holderName, setHolderName] = useState("");
  const [paymentQr, setPaymentQr] = useState("");
  const mainApi = process.env.REACT_APP_MAIN_API || "http://localhost:5000";

  // =======================
  // FETCH LEDGER DETAILS
  // =======================
  useEffect(() => {
    const fetchLedger = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) return alert("User not logged in");

      const decoded = jwt_decode(token);
      const user_id = decoded.id;

      try {
        const res = await axios.get(
          `${mainApi}/spliting/v1/ledger/${ledgerId}/${user_id}/details`
        );
        if (res.data.success) setLedger(res.data.ledger);
      } catch (err) {
        console.error("Ledger Fetch Error:", err);
      }
    };

    fetchLedger();
  }, [ledgerId]);

  // =======================
  // FETCH TRANSACTIONS
  // =======================
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          `${mainApi}/spliting/v1/ledger/${ledgerId}/transactions`
        );
        if (res.data.success) setTransactions(res.data.transactions);
      } catch (err) {
        console.error("Transaction Fetch Error:", err);
      }
    };

    fetchTransactions();
  }, [ledgerId]);

  // =======================
  // FETCH ACTIVITY
  // =======================
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get(
          `${mainApi}/spliting/v1/activity/ledger/${ledgerId}`
        );
        if (res.data.success) setActivities(res.data.activities);
      } catch (err) {
        console.error("Activity Fetch Error:", err);
      }
    };

    fetchActivity();
  }, [ledgerId]);

  const toggleMember = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // =======================
  // ADD EXPENSE
  // =======================
  const handleAddExpense = async () => {
    if (!expenseTitle.trim()) return alert("Enter expense title");
    if (!expenseAmount || parseFloat(expenseAmount) <= 0)
      return alert("Enter valid amount");

    if (selectedMembers.length === 0)
      return alert("Select at least one member");

    const token = localStorage.getItem("userToken");
    if (!token) return alert("Not logged in");

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
        `${mainApi}/spliting/v1/addexpense`,
        payload
      );

      if (res.data.success) {
        setIsExpenseOpen(false);
        setExpenseTitle("");
        setExpenseAmount("");
        setSelectedMembers([]);

        // REFRESH BOTH
        const a = await axios.get(
          `${mainApi}/spliting/v1/activity/ledger/${ledgerId}`
        );
        if (a.data.success) setActivities(a.data.activities);

        const t = await axios.get(
          `${mainApi}/spliting/v1/ledger/${ledgerId}/transactions`
        );
        if (t.data.success) setTransactions(t.data.transactions);

        alert("Expense added successfully!");
      }
    } catch (err) {
      console.error("Add Expense Error:", err);
    }
  };

  // =======================
  // PAYMENT POPUP
  // =======================
  const openPaymentPopup = async (tx) => {
    setPayData(tx);
    setIsPayOpen(true);

    try {
      const qr = await QRCode.toDataURL(`PAY ₹${tx.amount}`);
      setPaymentQr(qr);
    } catch {
      setPaymentQr("");
    }
  };

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

          <button
            onClick={onBack}
            className="px-3 py-1 bg-gray-100 rounded-md"
          >
            Back
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* MEMBERS */}
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
                  {m.you_will_receive > 0 && (
                    <div className="text-sm text-green-600 font-semibold">
                      Will Pay You: ₹{m.you_will_receive}
                    </div>
                  )}

                  {m.you_have_to_pay > 0 && (
                    <>
                      <div className="text-sm text-red-600 font-semibold">
                        You Pay: ₹{m.you_have_to_pay}
                      </div>

                      <button
                        onClick={() =>
                          openPaymentPopup({
                            amount: m.you_have_to_pay,
                            for_member: m,
                            expense_id: 0,
                          })
                        }
                        className="mt-1 text-xs px-2 py-1 bg-blue-600 text-white rounded-md"
                      >
                        Pay
                      </button>
                    </>
                  )}

                  {m.you_have_to_pay === 0 && m.you_will_receive === 0 && (
                    <div className="text-sm text-gray-500">Settled</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVITY TIMELINE (PREVIEW 3) */}
        <div>
          <h3 className="font-semibold mb-4">Member Activity</h3>

          {!activities.length ? (
            <div className="text-gray-500">No activity yet.</div>
          ) : (
            <>
              <div className="relative border-l-2 border-green-600 pl-6 space-y-6">
                {previewActivities.map((a) => (
                  <div key={a.activity_id} className="relative">
                    <div className="absolute -left-3 top-1 w-3 h-3 bg-green-600 rounded-full"></div>

                    <div className="bg-white border p-3 rounded-lg shadow-sm">
                      <div className="font-semibold">{a.user}</div>
                      <div className="text-green-700 font-bold text-xs">
                        {a.activity_type}
                      </div>
                      <div className="text-gray-700">{a.description}</div>
                      <div className="text-xs text-gray-400">
                        {a.created_at}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show ALL Button */}
              {activities.length > 3 && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setShowAllActivity(true)}
                    className="text-sm text-blue-600 underline"
                  >
                    Show All Activity
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* TRANSACTION HISTORY PREVIEW */}
      <div className="mt-10">
        <h3 className="font-semibold mb-3">Transaction History</h3>

        {!transactions.length ? (
          <div className="text-sm text-gray-500">No transactions</div>
        ) : (
          <>
            <div className="space-y-2">
              {previewTransactions.map((t) => (
                <div
                  key={t.expense_id}
                  className="p-3 border bg-white rounded flex justify-between"
                >
                  <div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-xs text-gray-400">
                      {t.added_by?.username} → {t.for_member?.username}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold">₹{t.amount.toFixed(2)}</div>
                    <button
                      onClick={() => openPaymentPopup(t)}
                      className="text-xs mt-1 px-2 py-1 bg-blue-600 text-white rounded"
                    >
                      Pay
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SHOW ALL */}
            {transactions.length > 5 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowAllTransactions(true)}
                  className="text-sm text-blue-600 underline"
                >
                  Show All Transactions
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ================================
          FULL SCREEN MODAL - ACTIVITY
      ================================== */}
      {showAllActivity && (
        <div className="fixed inset-0 z-50 bg-black/60 flex flex-col">
          <div className="bg-white flex-1 overflow-y-auto p-6 rounded-t-2xl">
            <h2 className="text-xl font-bold mb-4">All Member Activity</h2>

            <div className="relative border-l-2 border-green-600 pl-6 space-y-6">
              {activities.map((a) => (
                <div key={a.activity_id} className="relative">
                  <div className="absolute -left-3 top-1 w-3 h-3 bg-green-600 rounded-full"></div>

                  <div className="bg-white border p-3 rounded-lg shadow-sm">
                    <div className="font-semibold">{a.user}</div>
                    <div className="text-green-700 font-bold text-xs">
                      {a.activity_type}
                    </div>
                    <div className="text-gray-700">{a.description}</div>
                    <div className="text-xs text-gray-400">
                      {a.created_at}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAllActivity(false)}
                className="px-4 py-2 mt-4 bg-green-600 text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================
          FULL SCREEN MODAL - TRANSACTIONS
      ================================== */}
      {showAllTransactions && (
        <div className="fixed inset-0 z-50 bg-black/60 flex flex-col">
          <div className="bg-white flex-1 overflow-y-auto p-6 rounded-t-2xl">
            <h2 className="text-xl font-bold mb-4">All Transactions</h2>

            <div className="space-y-2">
              {transactions.map((t) => (
                <div
                  key={t.expense_id}
                  className="p-3 border bg-white rounded flex justify-between"
                >
                  <div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-xs text-gray-400">
                      {t.added_by?.username} → {t.for_member?.username}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold">₹{t.amount}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-4">
              <button
                onClick={() => setShowAllTransactions(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT MODAL */}
      {isPayOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-5">
          <div className="bg-white w-full max-w-sm p-6 rounded-xl">
            <h3 className="text-lg font-bold">
              Pay ₹{payData.amount.toFixed(2)}
            </h3>

            {paymentQr && (
              <div className="flex justify-center my-4">
                <img src={paymentQr} className="w-40 h-40 border p-2 rounded" />
              </div>
            )}

            <label className="block mb-3">
              <span className="text-sm">Card Holder Name</span>
              <input
                className="w-full border p-2 rounded"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
              />
            </label>

            <label className="block mb-3">
              <span className="text-sm">Card Number</span>
              <input
                className="w-full border p-2 rounded"
                maxLength={16}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                type="number"
              />
            </label>

            <label className="block mb-3">
              <span className="text-sm">CVV</span>
              <input
                className="w-full border p-2 rounded"
                maxLength={3}
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsPayOpen(false)}
                className="px-3 py-1 bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD EXPENSE POPUP */}
      {isExpenseOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-5">
          <div className="bg-white w-full max-w-md p-6 rounded-xl">
            <h3 className="text-lg font-bold mb-3">Add Expense</h3>

            <label className="block mb-3">
              <span className="text-sm">Title</span>
              <input
                className="w-full border p-2 rounded"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
              />
            </label>

            <label className="block mb-3">
              <span className="text-sm">Amount (₹)</span>
              <input
                className="w-full border p-2 rounded"
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
              />
            </label>

            <div className="mb-3">
              <span className="text-sm">Select Participants</span>
              <div className="mt-2 space-y-2">
                {ledger.members.map((m) => (
                  <label key={m.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(m.id)}
                      onChange={() => toggleMember(m.id)}
                    />
                    {m.username}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsExpenseOpen(false)}
                className="px-3 py-1 bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
