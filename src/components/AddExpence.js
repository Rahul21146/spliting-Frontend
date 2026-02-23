export default function AddExpence({ ledger, setIsExpenseOpen, handleAddExpense, expenseTitle, setExpenseTitle, expenseAmount, setExpenseAmount, selectedMembers, toggleMember }) {
  return (
    <>
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
        
        </>
    
  );
}