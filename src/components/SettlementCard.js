// import React from "react";

// export default function SettlementCard({
//   transaction,
//   currentUserId,
//   onVerify,
//   onReject
// }) {
//   const isReceiver = transaction.member_id === currentUserId;
//   const isSender = transaction.user_id === currentUserId;

//   return (
//     <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 shadow-md">

//       {/* Header */}
//       <div className="flex justify-between items-center mb-3">
//         <h4 className="text-lg font-semibold text-white">
//           {transaction.Ledger?.ledger_name}
//         </h4>

//         <span className={`px-2 py-1 text-xs rounded ${
//           transaction.status === "PENDING"
//             ? "bg-yellow-600 text-white"
//             : transaction.status === "VERIFIED"
//             ? "bg-green-600 text-white"
//             : "bg-red-600 text-white"
//         }`}>
//           {transaction.status}
//         </span>
//       </div>

//       {/* Expense Info */}
//       <div className="text-sm text-gray-300 space-y-1">
//         <p><span className="text-gray-400">Expense:</span> {transaction.Expense?.title}</p>
//         <p><span className="text-gray-400">Amount:</span> ₹{transaction.balance}</p>
//         <p><span className="text-gray-400">UTR:</span> {transaction.utr_number || "N/A"}</p>
//         <p><span className="text-gray-400">Paid By:</span> {transaction.sender?.username}</p>
//         <p><span className="text-gray-400">Paid To:</span> {transaction.receiver?.username}</p>
//         <p className="text-xs text-gray-500">
//           {new Date(transaction.transaction_date).toLocaleString()}
//         </p>
//       </div>

//       {/* Receiver Buttons */}
//       {isReceiver && transaction.status === "PENDING" && (
//         <div className="flex gap-3 mt-4">
//           <button
//             onClick={() => onVerify(transaction.transaction_id)}
//             className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white text-sm"
//           >
//             Verify
//           </button>

//           <button
//             onClick={() => onReject(transaction.transaction_id)}
//             className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white text-sm"
//           >
//             Reject
//           </button>
//         </div>
//       )}

//       {/* Sender Waiting Message */}
//       {isSender && transaction.status === "PENDING" && (
//         <div className="mt-4 text-yellow-400 text-sm font-medium">
//           Waiting for receiver verification...
//         </div>
//       )}

//     </div>
//   );
// }


// import React from "react";

// export default function SettlementCard({
//   transaction,
//   currentUserId,
//   onVerify,
//   onReject
// }) {
//   const isReceiver = transaction.member_id === currentUserId;
//   const isSender = transaction.user_id === currentUserId;

//   return (
//     <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 shadow-md">

//       {/* Header */}
//       <div className="flex justify-between items-center mb-3">
//         <h4 className="text-lg font-semibold text-white">
//           {transaction.Ledger?.ledger_name}
//         </h4>

//         <span className={`px-2 py-1 text-xs rounded ${
//           transaction.status === "PENDING"
//             ? "bg-yellow-600 text-white"
//             : transaction.status === "VERIFIED"
//             ? "bg-green-600 text-white"
//             : "bg-red-600 text-white"
//         }`}>
//           {transaction.status}
//         </span>
//       </div>

//       {/* Expense Info */}
//       <div className="text-sm text-gray-300 space-y-1">
//         <p><span className="text-gray-400">Expense:</span> {transaction.Expense?.title}</p>
//         <p><span className="text-gray-400">Amount:</span> ₹{transaction.balance}</p>
//         <p><span className="text-gray-400">UTR:</span> {transaction.utr_number || "N/A"}</p>
//         <p><span className="text-gray-400">Paid By:</span> {transaction.sender?.username}</p>
//         <p><span className="text-gray-400">Paid To:</span> {transaction.receiver?.username}</p>
//         <p className="text-xs text-gray-500">
//           {new Date(transaction.transaction_date).toLocaleString()}
//         </p>
//       </div>

//       {/* Receiver Buttons */}
//       {isReceiver && transaction.status === "PENDING" && (
//         <div className="flex gap-3 mt-4">
//           <button
//             onClick={() => onVerify(transaction.transaction_id)}
//             className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white text-sm"
//           >
//             Verify
//           </button>

//           <button
//             onClick={() => onReject(transaction.transaction_id)}
//             className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white text-sm"
//           >
//             Reject
//           </button>
//         </div>
//       )}

//       {/* Sender Waiting Message */}
//       {isSender && transaction.status === "PENDING" && (
//         <div className="mt-4 text-yellow-400 text-sm font-medium">
//           Waiting for receiver verification...
//         </div>
//       )}

//     </div>
//   );
// }


import React, { useState } from "react";
import { 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Wallet,
  Info,
  Copy,
  Check,
  X
} from 'lucide-react';

export default function SettlementCard({
  transaction,
  currentUserId,
  onVerify,
  onReject
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const isReceiver = transaction.member_id === currentUserId;
  const isSender = transaction.user_id === currentUserId;

  // Get status configuration
  const getStatusConfig = () => {
    switch(transaction.status) {
      case "PENDING":
        return {
          dot: "bg-yellow-500",
          text: "text-yellow-500",
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/20",
          label: "Pending",
          icon: Clock,
          message: "Awaiting verification",
          gradient: "from-yellow-600 to-yellow-500"
        };
      case "VERIFIED":
        return {
          dot: "bg-green-500",
          text: "text-green-500",
          bg: "bg-green-500/10",
          border: "border-green-500/20",
          label: "Verified",
          icon: CheckCircle,
          message: "Payment verified",
          gradient: "from-green-600 to-green-500"
        };
      case "REJECTED":
        return {
          dot: "bg-red-500",
          text: "text-red-500",
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          label: "Rejected",
          icon: XCircle,
          message: "Payment rejected",
          gradient: "from-red-600 to-red-500"
        };
      default:
        return {
          dot: "bg-gray-500",
          text: "text-gray-500",
          bg: "bg-gray-500/10",
          border: "border-gray-500/20",
          label: "Unknown",
          icon: Clock,
          message: "Unknown status",
          gradient: "from-gray-600 to-gray-500"
        };
    }
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Settlement Card */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-red-600/50 transition-all duration-300">
        {/* Status Bar */}
        <div className={`h-1 w-full ${status.bg}`}></div>
        
        {/* Main Content */}
        <div className="p-4">
          {/* Header - Ledger & Status */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center">
                <Wallet className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">
                  {transaction.Ledger?.ledger_name || "Ledger"}
                </h4>
                <p className="text-xs text-gray-500">#{transaction.transaction_id}</p>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
              <StatusIcon className="w-3 h-3" />
              {status.label}
            </div>
          </div>

          {/* Expense Info - Compact */}
          <div className="mb-3 pb-3 border-b border-gray-800">
            <p className="text-xs text-gray-500 mb-1">Expense</p>
            <p className="text-white text-sm font-medium">{transaction.Expense?.title || "Untitled Expense"}</p>
          </div>

          {/* Amount - Prominent but Compact */}
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Amount</p>
              <p className="text-2xl font-bold text-red-500">₹{transaction.balance}</p>
            </div>
            
            {/* UTR if exists - small chip */}
            {transaction.utr_number && (
              <div className="bg-gray-800/50 px-2 py-1 rounded-md">
                <p className="text-xs text-gray-500">UTR</p>
                <p className="text-xs text-gray-300 font-mono">{transaction.utr_number.slice(0,8)}...</p>
              </div>
            )}
          </div>

          {/* People Grid - Clean Layout */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {/* Sender */}
            <div className={`bg-gray-800/30 rounded-lg p-2 ${isSender ? 'ring-1 ring-yellow-500/50' : ''}`}>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                  ${isSender ? 'bg-yellow-600/20 text-yellow-500' : 'bg-gray-700 text-gray-300'}`}>
                  {transaction.sender?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500">From</p>
                  <p className="text-xs font-medium text-white truncate max-w-[80px]">
                    {transaction.sender?.username || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            {/* Receiver */}
            <div className={`bg-gray-800/30 rounded-lg p-2 ${isReceiver ? 'ring-1 ring-green-500/50' : ''}`}>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                  ${isReceiver ? 'bg-green-600/20 text-green-500' : 'bg-gray-700 text-gray-300'}`}>
                  {transaction.receiver?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500">To</p>
                  <p className="text-xs font-medium text-white truncate max-w-[80px]">
                    {transaction.receiver?.username || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Verify/Reject and Know More */}
          <div className="flex items-center gap-2 mt-2">
            {isReceiver && transaction.status === "PENDING" ? (
              <>
                <button
                  onClick={() => onVerify(transaction.transaction_id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 rounded-lg transition-all hover:scale-105 shadow-lg shadow-green-600/20 flex items-center justify-center gap-1"
                >
                  <CheckCircle className="w-3 h-3" />
                  Verify
                </button>
                <button
                  onClick={() => onReject(transaction.transaction_id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-2 rounded-lg transition-all hover:scale-105 shadow-lg shadow-red-600/20 flex items-center justify-center gap-1"
                >
                  <XCircle className="w-3 h-3" />
                  Reject
                </button>
              </>
            ) : (
              <div className="flex-1"></div>
            )}
            
            {/* Know More Button - Always visible */}
            <button
              onClick={() => setShowDetails(true)}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs font-semibold py-2 px-3 rounded-lg transition-all flex items-center gap-1 border border-gray-700"
            >
              <Info className="w-3 h-3" />
              Know More
            </button>
          </div>

          {/* Status Message */}
          {isSender && transaction.status === "PENDING" && (
            <div className="mt-2 bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 text-yellow-500" />
                <p className="text-xs text-yellow-500 font-medium">Waiting for {transaction.receiver?.username}</p>
              </div>
            </div>
          )}

          {transaction.status === "VERIFIED" && (
            <div className="mt-2 bg-green-500/5 border border-green-500/20 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <p className="text-xs text-green-500 font-medium">Verified by {transaction.receiver?.username}</p>
              </div>
            </div>
          )}

          {transaction.status === "REJECTED" && (
            <div className="mt-2 bg-red-500/5 border border-red-500/20 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <XCircle className="w-3 h-3 text-red-500" />
                <p className="text-xs text-red-500 font-medium">Rejected by {transaction.receiver?.username}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${status.gradient} bg-opacity-20 flex items-center justify-center`}>
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-white">Payment Details</h3>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status Banner */}
              <div className={`p-4 rounded-xl ${status.bg} border ${status.border}`}>
                <div className="flex items-center gap-3">
                  <StatusIcon className={`w-8 h-8 ${status.text}`} />
                  <div>
                    <p className={`text-sm font-semibold ${status.text}`}>{status.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{status.message}</p>
                  </div>
                </div>
              </div>

              {/* Transaction Overview */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Transaction Overview</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Transaction ID</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-mono">#{transaction.transaction_id}</span>
                      <button
                        onClick={() => copyToClipboard(`#${transaction.transaction_id}`)}
                        className="text-gray-500 hover:text-gray-300"
                      >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Ledger</span>
                    <span className="text-sm text-white">{transaction.Ledger?.ledger_name || "N/A"}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Expense</span>
                    <span className="text-sm text-white">{transaction.Expense?.title || "N/A"}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Amount</span>
                    <span className="text-lg font-bold text-red-500">₹{transaction.balance}</span>
                  </div>
                </div>
              </div>

              {/* Party Details */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Parties Involved</h4>
                
                <div className="space-y-4">
                  {/* Sender Details */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {transaction.sender?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{transaction.sender?.username || 'Unknown'}</p>
                        {isSender && (
                          <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full">You</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Sender • Paid this amount</p>
                      {transaction.sender?.email && (
                        <p className="text-xs text-gray-600 mt-1">{transaction.sender.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Arrow Divider */}
                  <div className="flex justify-center">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Receiver Details */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {transaction.receiver?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{transaction.receiver?.username || 'Unknown'}</p>
                        {isReceiver && (
                          <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">You</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">Receiver • Needs to verify</p>
                      {transaction.receiver?.email && (
                        <p className="text-xs text-gray-600 mt-1">{transaction.receiver.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Payment Information</h4>
                
                <div className="space-y-3">
                  {transaction.utr_number ? (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">UTR Number</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white font-mono">{transaction.utr_number}</span>
                        <button
                          onClick={() => copyToClipboard(transaction.utr_number)}
                          className="text-gray-500 hover:text-gray-300"
                        >
                          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">UTR Number</span>
                      <span className="text-sm text-gray-600">Not provided</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Transaction Date</span>
                    <span className="text-sm text-white">
                      {new Date(transaction.transaction_date).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {transaction.payment_method && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Payment Method</span>
                      <span className="text-sm text-white">{transaction.payment_method}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Timeline</h4>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm text-white">Payment Initiated</p>
                      <p className="text-xs text-gray-500">
                        {new Date(transaction.transaction_date).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {transaction.status === "VERIFIED" && (
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm text-white">Verified by {transaction.receiver?.username}</p>
                        <p className="text-xs text-gray-500">
                          {new Date().toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )}

                  {transaction.status === "REJECTED" && (
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm text-white">Rejected by {transaction.receiver?.username}</p>
                        <p className="text-xs text-gray-500">
                          {new Date().toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes if any */}
              {transaction.notes && (
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Additional Notes</h4>
                  <p className="text-sm text-gray-300">{transaction.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-4">
              <button
                onClick={() => setShowDetails(false)}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold py-3 rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}