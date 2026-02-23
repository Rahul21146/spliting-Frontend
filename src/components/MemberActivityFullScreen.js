export default function MemberActivityFullScreen({ activities = [], setShowAllActivity , previewActivities}) {
  return (
    <>
       <div className="fixed inset-0 z-50 bg-black/60 flex flex-col">
          <div className="bg-gray-900 flex-1 overflow-y-auto p-6 rounded-t-2xl border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-white">All Member Activity</h2>

            <div className="relative border-l-2 border-red-600 pl-6 space-y-6">
              {activities.map((a) => (
                <div key={a.activity_id} className="relative">
                  <div className="absolute -left-3 top-1 w-3 h-3 bg-red-600 rounded-full"></div>

                  <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-sm">
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

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAllActivity(false)}
                className="px-4 py-2 mt-4 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
        
        </>
    
  );
}