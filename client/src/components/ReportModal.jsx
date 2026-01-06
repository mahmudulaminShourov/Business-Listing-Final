// client/src/components/ReportModal.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import { listingAPI } from "../lib/api"; // adjust path if needed

export default function ReportModal({ isOpen, onClose, listingId }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Please write a reason");
      return;
    }
    try {
      setLoading(true);
      await listingAPI.reportListing(listingId, reason);
      toast.success("Report submitted");
      setReason("");
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-lg font-bold mb-3">Report Listing</h2>

        <form onSubmit={handleSubmit}>
          <textarea
            rows="4"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border p-2 mb-4"
            placeholder="Write reason..."
            required
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              {loading ? "Reporting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
