export default function FullScreenTransaction({ transactions, previewTransactions, setShowAllTransactions ,openPaymentPopup}) {
  return (
    <>
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
    </>
  );
}