// ActivityFeed.jsx
import React from "react";

export default function ActivityFeed({ activities = [], onBack }) {
  return (
    <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Activity Feed</h2>
        <button
          onClick={onBack}
          className="text-sm px-3 py-1 rounded-md bg-gray-800 text-gray-200 hover:bg-gray-700"
        >
          Back
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="text-sm text-gray-400">No activity yet.</div>
      ) : (
        <div className="space-y-4">
          {activities.map((a, i) => (
            <div key={i} className="p-3 border rounded-lg bg-gray-800 border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-200">
                    <span className="font-semibold text-white">{a.actor}</span>{" "}
                    <span>{a.action}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{a.time}</div>
                </div>
                <div>
                  <span className={`inline-block px-2 py-1 text-xs rounded ${a.tagClass || "bg-red-100 text-red-800"}`}>
                    {a.tag || "Info"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
