// LedgerForm.jsx
import React, { useState } from "react";
import { toast } from "react-toastify";
 import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function LedgerForm({ onCreate, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState([
    { id: Date.now(), username: "", email: "" },
  ]);

  const addParticipant = () => {
    setParticipants(s => [...s, { id: Date.now() + Math.random(), username: "", email: "" }]);
  };
  const updateParticipant = (id, field, value) => {
    setParticipants(s => s.map(p => (p.id === id ? { ...p, [field]: value } : p)));
  };
  const removeParticipant = (id) => {
    setParticipants(s => s.filter(p => p.id !== id));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name.trim()) {
    return toast.error("Enter ledger name");
  }

  // Collect emails (ignore empty ones)
  const member_emails = participants
    .map(p => p.email.trim())
    .filter(email => email !== "");

  // Payload EXACTLY matching backend expectation
  const token = localStorage.getItem("userToken");

  if (!token) {
    return alert("User not logged in!");
  }

  let decoded;
  try {
    decoded = jwtDecode(token);   // { id: 5, email: "...", ... }
  } catch (err) {
    console.error("Invalid Token:", err);
    return toast.error("Invalid session token");
  }

  const user_id = decoded.id;
  const payload = {
    user_id, // use logged-in user id from token
    ledger_name: name.trim(),
    description: description.trim(),
    member_emails: member_emails
  };

  console.log("Sending payload:", payload);

  try {
    const { data } = await axios.post(
      "http://localhost:5000/spliting/v1/createLedger",
      payload
    );

    toast.success("Ledger created successfully!");

    // Send the response to the parent
    onCreate && onCreate(data);

    // Reset the form
    setName("");
    setDescription("");
    setParticipants([{ id: Date.now(), username: "", email: "" }]);


  } catch (error) {
    console.error("API Error:", error);

    if (error.response) {
      toast.error("Error: " + error.response.data.error);
    } else {
      toast.error("Something went wrong while creating the ledger.");
    }
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative z-10 bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Create New Ledger</h3>
          <button type="button" className="text-sm text-gray-600" onClick={onClose}>Close</button>
        </div>

        <label className="block mb-3">
          <div className="text-sm font-medium text-gray-700 mb-1">Ledger Name</div>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
            placeholder="e.g. Goa Trip, Rent June" />
        </label>

        <label className="block mb-3">
          <div className="text-sm font-medium text-gray-700 mb-1">Description</div>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded-md h-24 focus:outline-none focus:ring-2 focus:ring-green-300"
            placeholder="Describe this ledger - purpose, notes..." />
        </label>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-700">Participants</div>
            <div className="text-xs text-gray-500">{participants.length} added</div>
          </div>

          <div className="space-y-2">
            {participants.map((p, i) => (
              <div key={p.id} className="grid grid-cols-12 gap-2 items-center">
                <input className="col-span-4 border px-2 py-2 rounded-md"
                  placeholder="Username" value={p.username}
                  onChange={(e) => updateParticipant(p.id, "username", e.target.value)} />
                <input className="col-span-6 border px-2 py-2 rounded-md"
                  placeholder="Email (optional)" value={p.email}
                  onChange={(e) => updateParticipant(p.id, "email", e.target.value)} />
                <button type="button" onClick={() => removeParticipant(p.id)}
                  className="col-span-2 text-sm text-red-500">Remove</button>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-3">
            <button type="button" onClick={addParticipant} className="text-sm text-green-600">+ Add Participant</button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">Ledger will appear under "Your Ledgers" when created.</div>
          <div>
            <button type="button" onClick={onClose} className="px-3 py-2 rounded-md text-gray-600 mr-2">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-md bg-green-600 text-white">Create Ledger</button>
          </div>
        </div>
      </form>
    </div>
  );
}
