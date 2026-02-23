export default function ledgerMembers({ ledger, openPaymentPopup }) {
  return (
    <>

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
        </>
    
  );
}