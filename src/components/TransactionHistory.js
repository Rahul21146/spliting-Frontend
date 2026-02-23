export default function TransactionHistory({ transactions, previewTransactions, setShowAllTransactions ,openPaymentPopup}) {
  return (
    <>
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
    </>
  );
}