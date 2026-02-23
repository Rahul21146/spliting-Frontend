export default function MemberActivity({ activities = [], setShowAllActivity , previewActivities}) {
  return (
    <>
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
        
        </>
    
  );
}