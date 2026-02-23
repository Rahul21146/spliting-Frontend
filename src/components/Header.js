export default function Header({ ledger, setIsExpenseOpen, onBack }) {
  return (
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
  );
}