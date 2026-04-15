import React, { useEffect, useState } from "react";
// import QRCode from "qrcode";
import { useDispatch } from "react-redux";
import { jwtDecode as jwt_decode } from "jwt-decode";
import Header from "../Header";
import LedgerMembers from "../LedgerMembers";
import MemberActivity from "../MemberActivity";
import TransactionHistory from "../TransactionHistory";
import MemberActivityFullScreen from "../MemberActivityFullScreen";
import FullScreenTransaction from "../FullScreenTransaction";
import PaymentModel from "../PaymentModel";
import AddExpence from "../AddExpence";
import { getLedgerDetails, getActivity, getTransactions, addExpense } from "../../servises/operations";

export default function LedgerDetails({ ledgerId, onBack }) {
  const [ledger, setLedger] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [upiLink, setUpiLink] = useState("");
  const dispatch = useDispatch();

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
  const [paymentQr, setPaymentQr] = useState("");

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
        const res = await dispatch(getLedgerDetails(ledgerId, user_id));
        if (res?.success) setLedger(res.ledger);
      } catch (err) {
        console.error("Ledger Fetch Error:", err);
      }
    };

    fetchLedger();
  }, [ledgerId, dispatch]);

//   const handleMarkAsPaid = async () => {
//   try {
//     await axios.post(`${mainApi}/spliting/v1/settlement/mark-paid`, {
//       transactionId: payData.transaction_id,
//       payerId: payData.user_id
//     });

//     alert("Marked as Paid. Waiting for confirmation.");
//     setIsPayOpen(false);

//   } catch (err) {
//     console.error(err);
//     alert("Error marking as paid");
//   }
// };

  // =======================
  // FETCH TRANSACTIONS
  // =======================
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await dispatch(getTransactions(ledgerId));
        if (res?.success) setTransactions(res.transactions);
      } catch (err) {
        console.error("Transaction Fetch Error:", err);
      }
    };

    fetchTransactions();
  }, [ledgerId, dispatch]);

  // =======================
  // FETCH ACTIVITY
  // =======================
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await dispatch(getActivity(ledgerId));
        if (res?.success) setActivities(res.activities);
      } catch (err) {
        console.error("Activity Fetch Error:", err);
      }
    };

    fetchActivity();
  }, [ledgerId, dispatch]);

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

      const res = await dispatch(addExpense(payload));

      if (res?.success) {
        setIsExpenseOpen(false);
        setExpenseTitle("");
        setExpenseAmount("");
        setSelectedMembers([]);

        const a = await dispatch(getActivity(ledgerId));
        if (a?.success) setActivities(a.activities);

        const t = await dispatch(getTransactions(ledgerId));
        if (t?.success) setTransactions(t.transactions);

        alert("Expense added successfully!");
      }
    } catch (err) {
      console.error("Add Expense Error:", err);
    }
  };

  // =======================
  // PAYMENT POPUP
  // =======================
  // const openPaymentPopup = async (tx) => {
  //   setPayData(tx);
  //   setIsPayOpen(true);

  //   try {
  //     const qr = await QRCode.toDataURL(`PAY ₹${tx.amount}`);
  //     setPaymentQr(qr);
  //   } catch {
  //     setPaymentQr("");
  //   }
  // };

//   const openPaymentPopup = async (tx) => {
//   setPayData(tx);
//   setIsPayOpen(true);

//   const upiId = tx.upi_id || "rahulsingh894856@okhdfcbank"; // receiver UPI
//   const name = tx.receiver_name || "Receiver";

//   const upiLink = `upi://pay?pa=${upiId}&pn=${name}&am=${tx.amount}&cu=INR&tn=Settlement for Ledger ${ledgerId}`;

//   setUpiLink(upiLink);

//   try {
//     const qr = await QRCode.toDataURL(upiLink);
//     setPaymentQr(qr);
//   } catch {
//     setPaymentQr("");
//   }
// };
const openPaymentPopup = (tx) => {
  setPayData(tx);  // 👈 full expense object

  const upiId = tx.for_member?.upi_id;
  const name = tx.for_member?.username;
  const qrImage = tx.for_member?.qr_code; // ✅ real QR from DB

  if (!upiId && !qrImage) {
    alert("Receiver payment details not available");
    return;
  }

  const upiLink = upiId
    ? `upi://pay?pa=${upiId}&pn=${name}&am=${tx.amount}&cu=INR&tn=Settlement for Ledger ${ledgerId}`
    : "";

  setUpiLink(upiLink);
  setPaymentQr(qrImage);  // ✅ use stored QR image
  setIsPayOpen(true);
};

  // const handlePayment = () => {
  //   if (!cardNumber || !cvv || !holderName)
  //     return alert("Please fill all fields");

  //   alert("Payment Successful!");
  //   setIsPayOpen(false);
  // };

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
  upiLink={upiLink}
  setIsPayOpen={setIsPayOpen}
  ledgerId={ledgerId}
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
