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
  }, [ledgerId, mainApi]);

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
  }, [ledgerId, mainApi]);

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
  }, [ledgerId, mainApi]);

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

  if (!ledger) return <div className="p-6 text-gray-300">Loading...</div>;

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{ledger.ledger_name}</h2>
          <div className="text-sm text-gray-400">{ledger.description}</div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpenseOpen(true)}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            + Add Expense
          </button>

          <button
            onClick={onBack}
            className="px-3 py-1 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700"
          >
            Back
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* MEMBERS */}
        <div>
          <h3 className="font-semibold mb-3 text-white">Members</h3>
          <div className="space-y-3">
            {ledger.members.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-3 bg-gray-900 border border-gray-800 rounded-lg"
              >
                <div>
                  <div className="font-semibold text-white">{m.username}</div>
                  <div className="text-xs text-gray-400">{m.email}</div>
                </div>

                <div className="text-right">
                  {m.you_will_receive > 0 && (
                    <div className="text-sm text-red-400 font-semibold">
                      Will Pay You: ₹{m.you_will_receive}
                    </div>
                  )}

                  {m.you_have_to_pay > 0 && (
                    <>
                      <div className="text-sm text-red-500 font-semibold">
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
                        className="mt-1 text-xs px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Pay
                      </button>
                    </>
                  )}

                  {m.you_have_to_pay === 0 && m.you_will_receive === 0 && (
                    <div className="text-sm text-gray-400">Settled</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVITY TIMELINE (PREVIEW 3) */}
        <div>
          <h3 className="font-semibold mb-4 text-white">Member Activity</h3>

          {!activities.length ? (
            <div className="text-gray-400">No activity yet.</div>
          ) : (
            <>
              <div className="relative border-l-2 border-red-600 pl-6 space-y-6">
                {previewActivities.map((a) => (
                  <div key={a.activity_id} className="relative">
                    <div className="absolute -left-3 top-1 w-3 h-3 bg-red-600 rounded-full"></div>

                    <div className="bg-gray-900 border border-gray-800 p-3 rounded-lg shadow-sm">
                      <div className="font-semibold text-white">{a.user}</div>
                      <div className="text-red-500 font-bold text-xs">
                        {a.activity_type}
                      </div>
                      <div className="text-gray-300">{a.description}</div>
                      <div className="text-xs text-gray-500">
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
                    className="text-sm text-red-500 underline hover:text-red-400"
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
        <h3 className="font-semibold mb-3 text-white">Transaction History</h3>

        {!transactions.length ? (
          <div className="text-sm text-gray-400">No transactions</div>
        ) : (
          <>
            <div className="space-y-2">
              {previewTransactions.map((t) => (
                <div
                  key={t.expense_id}
                  className="p-3 border bg-gray-900 rounded border-gray-800 flex justify-between"
                >
                  <div>
                    <div className="font-semibold text-white">{t.title}</div>
                    <div className="text-xs text-gray-400">
                      {t.added_by?.username} → {t.for_member?.username}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-white">₹{t.amount.toFixed(2)}</div>
                    <button
                      onClick={() => openPaymentPopup(t)}
                      className="text-xs mt-1 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
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
                  className="text-sm text-red-500 underline hover:text-red-400"
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
          <div className="bg-gray-900 flex-1 overflow-y-auto p-6 rounded-t-2xl border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">All Member Activity</h2>

            <div className="relative border-l-2 border-red-600 pl-6 space-y-6">
              {activities.map((a) => (
                <div key={a.activity_id} className="relative">
                  <div className="absolute -left-3 top-1 w-3 h-3 bg-red-600 rounded-full"></div>

                  <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-sm">
                    <div className="font-semibold text-white">{a.user}</div>
                    <div className="text-red-500 font-bold text-xs">
                      {a.activity_type}
                    </div>
                    <div className="text-gray-300">{a.description}</div>
                    <div className="text-xs text-gray-500">
                      {a.created_at}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAllActivity(false)}
                className="px-4 py-2 mt-4 bg-red-600 text-white rounded-md hover:bg-red-700"
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
          <div className="bg-gray-900 flex-1 overflow-y-auto p-6 rounded-t-2xl border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">All Transactions</h2>

            <div className="space-y-2">
              {transactions.map((t) => (
                <div
                  key={t.expense_id}
                  className="p-3 border bg-gray-800 rounded flex justify-between border-gray-700"
                >
                  <div>
                    <div className="font-semibold text-white">{t.title}</div>
                    <div className="text-xs text-gray-400">
                      {t.added_by?.username} → {t.for_member?.username}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-white">₹{t.amount}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-4">
              <button
                onClick={() => setShowAllTransactions(false)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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
      )}

      {/* ADD EXPENSE POPUP */}
      {isExpenseOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-5">
          <div className="bg-gray-900 w-full max-w-md p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-bold mb-3 text-white">Add Expense</h3>

            <label className="block mb-3">
              <span className="text-sm text-gray-400">Title</span>
              <input
                className="w-full border border-gray-800 p-2 rounded bg-gray-800 text-gray-200"
                value={expenseTitle}
                onChange={(e) => setExpenseTitle(e.target.value)}
              />
            </label>

            <label className="block mb-3">
              <span className="text-sm text-gray-400">Amount (₹)</span>
              <input
                className="w-full border border-gray-800 p-2 rounded bg-gray-800 text-gray-200"
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
              />
            </label>

            <div className="mb-3">
              <span className="text-sm text-gray-400">Select Participants</span>
              <div className="mt-2 space-y-2">
                {ledger.members.map((m) => (
                  <label key={m.id} className="flex items-center gap-2 text-gray-300">
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
                className="px-3 py-1 bg-gray-800 text-gray-200 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExpense}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
