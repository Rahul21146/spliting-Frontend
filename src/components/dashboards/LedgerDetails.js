import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import axios from "axios";
import { jwtDecode as jwt_decode } from "jwt-decode";
import Header from "../Header";
import LedgerMembers from "../LedgerMembers";
import MemberActivity from "../MemberActivity";
import TransactionHistory from "../TransactionHistory";
import MemberActivityFullScreen from "../MemberActivityFullScreen";
import FullScreenTransaction from "../FullScreenTransaction";
import PaymentModel from "../PaymentModel";
import AddExpence from "../AddExpence";

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
    
      <Header ledger={ledger} setIsExpenseOpen={setIsExpenseOpen} onBack={onBack} />
      {/* HEADER */}
      {/* <div className="flex items-center justify-between mb-6">
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
      </div> */}
      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* MEMBERS */}
        <LedgerMembers ledger={ledger} openPaymentPopup={openPaymentPopup} />
        {/* ACTIVITY TIMELINE (PREVIEW 3) */}
        <MemberActivity activities={activities} previewActivities={previewActivities} setShowAllActivity={setShowAllActivity} /> 
      </div>

      {/* TRANSACTION HISTORY PREVIEW */}
      <TransactionHistory transactions={transactions} previewTransactions={previewTransactions} setShowAllTransactions={setShowAllTransactions} openPaymentPopup={openPaymentPopup} />

      {/* ================================
          FULL SCREEN MODAL - ACTIVITY
      ================================== */}
      {showAllActivity && (
        <MemberActivityFullScreen activities={activities} setShowAllActivity={setShowAllActivity} />
      )}

      {/* ================================
          FULL SCREEN MODAL - TRANSACTIONS
      ================================== */}
      {showAllTransactions && (
        <FullScreenTransaction transactions={transactions} previewTransactions={previewTransactions} setShowAllTransactions={setShowAllTransactions} openPaymentPopup={openPaymentPopup} />
      )}

      {/* PAYMENT MODAL */}
      {isPayOpen && (
        <PaymentModel
          payData={payData}
          paymentQr={paymentQr}
          holderName={holderName}
          cardNumber={cardNumber}
          cvv={cvv}
          setHolderName={setHolderName}
          setCardNumber={setCardNumber}
          setCvv={setCvv}
          setIsPayOpen={setIsPayOpen}
          handlePayment={handlePayment}
        />
      )}

      {/* ADD EXPENSE POPUP */}
      {isExpenseOpen && (
        <AddExpence
          ledger={ledger}
          setIsExpenseOpen={setIsExpenseOpen}
          handleAddExpense={handleAddExpense}
          expenseTitle={expenseTitle}
          setExpenseTitle={setExpenseTitle}
          expenseAmount={expenseAmount}
          setExpenseAmount={setExpenseAmount}
          selectedMembers={selectedMembers}
          toggleMember={toggleMember}
        />
      )}

    </div>
  );
}
