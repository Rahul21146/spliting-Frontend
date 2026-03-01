// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import SettlementCard from "./SettlementCard";

// export default function SettlementDashboard({ userId }) {

//   const mainApi = process.env.REACT_APP_MAIN_API || "http://localhost:5000";
//   const [transactions, setTransactions] = useState([]);
//   const [activeTab, setActiveTab] = useState("receiver");
  

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   const fetchTransactions = async () => {
//     const res = await axios.get(
//       `${mainApi}/spliting/v1/settlement/pending-details/${userId}`
//     );
//     setTransactions(res.data.transactions || []);
//   };

//   const handleVerify = async (id) => {
//     await axios.post(`${mainApi}/spliting/v1/settlement/verify/${id}`);
//     fetchTransactions();
//   };

//   const handleReject = async (id) => {
//     await axios.post(`${mainApi}/spliting/v1/settlement/reject/${id}`);
//     fetchTransactions();
//   };

//   const filtered = transactions.filter((t) =>
//     activeTab === "receiver"
//       ? t.member_id === userId
//       : t.user_id === userId
//   );

//   return (
//     <div className="p-6">

//       {/* Tabs */}
//       <div className="flex gap-4 mb-6">
//         <button
//           onClick={() => setActiveTab("receiver")}
//           className={`px-4 py-2 rounded-lg ${
//             activeTab === "receiver"
//               ? "bg-blue-600 text-white"
//               : "bg-gray-800 text-gray-300"
//           }`}
//         >
//           Pending For Me
//         </button>

//         <button
//           onClick={() => setActiveTab("sender")}
//           className={`px-4 py-2 rounded-lg ${
//             activeTab === "sender"
//               ? "bg-blue-600 text-white"
//               : "bg-gray-800 text-gray-300"
//           }`}
//         >
//           My Initiated Payments
//         </button>
//       </div>

//       {/* Cards */}
//       <div className="space-y-4">
//         {filtered.length === 0 && (
//           <div className="text-gray-400 text-sm">
//             No transactions found.
//           </div>
//         )}

//         {filtered.map((transaction) => (
//           <SettlementCard
//             key={transaction.transaction_id}
//             transaction={transaction}
//             currentUserId={userId}
//             onVerify={handleVerify}
//             onReject={handleReject}
//           />
//         ))}
//       </div>

//     </div>
//   );
// }



import React, { useEffect, useState } from "react";
import SettlementCard from "./SettlementCard";

export default function SettlementDashboard({ userId = 5 }) {

  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("receiver");

  useEffect(() => {
    // 🔥 Dummy Transactions
    const dummyTransactions = [
      {
        transaction_id: 1,
        ledger_id: 10,
        user_id: 4,
        member_id: 5,
        balance: 349.5,
        utr_number: "UTR123456",
        status: "PENDING",
        transaction_date: new Date().toISOString(),

        Ledger: {
          ledger_name: "Goa Trip Ledger"
        },

        Expense: {
          title: "Hotel Booking"
        },

        sender: {
          id: 4,
          username: "Rahul"
        },

        receiver: {
          id: 5,
          username: "Kalindi"
        }
      },
      {
        transaction_id: 2,
        ledger_id: 11,
        user_id: 5,
        member_id: 4,
        balance: 1200,
        utr_number: "UTR999888",
        status: "VERIFIED",
        transaction_date: new Date().toISOString(),

        Ledger: {
          ledger_name: "Office Lunch Ledger"
        },

        Expense: {
          title: "Team Lunch"
        },

        sender: {
          id: 5,
          username: "Kalindi"
        },

        receiver: {
          id: 4,
          username: "Rahul"
        }
      },
      {
        transaction_id: 3,
        ledger_id: 12,
        user_id: 5,
        member_id: 6,
        balance: 500,
        utr_number: "UTR777333",
        status: "PENDING",
        transaction_date: new Date().toISOString(),

        Ledger: {
          ledger_name: "Birthday Party Ledger"
        },

        Expense: {
          title: "Cake & Decorations"
        },

        sender: {
          id: 5,
          username: "Kalindi"
        },

        receiver: {
          id: 6,
          username: "Aman"
        }
      }
    ];

    setTransactions(dummyTransactions);
  }, []);

  // 🔥 Dummy Verify
  const handleVerify = (id) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.transaction_id === id ? { ...t, status: "VERIFIED" } : t
      )
    );
  };

  // 🔥 Dummy Reject
  const handleReject = (id) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.transaction_id === id ? { ...t, status: "REJECTED" } : t
      )
    );
  };

  const filtered = transactions.filter((t) =>
    activeTab === "receiver"
      ? t.member_id === userId
      : t.user_id === userId
  );

  return (
    <div className="p-6 bg-gray-800 min-h-screen">

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("receiver")}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === "receiver"
              ? "bg-blue-600 text-white"
              : "bg-gray-900 text-gray-300"
          }`}
        >
          Pending For Me
        </button>

        <button
          onClick={() => setActiveTab("sender")}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === "sender"
              ? "bg-blue-600 text-white"
              : "bg-gray-900 text-gray-300"
          }`}
        >
          My Initiated Payments
        </button>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-gray-400 text-sm">
            No transactions found.
          </div>
        )}

        {filtered.map((transaction) => (
          <SettlementCard
            key={transaction.transaction_id}
            transaction={transaction}
            currentUserId={userId}
            onVerify={handleVerify}
            onReject={handleReject}
          />
        ))}
      </div>

    </div>
  );
}