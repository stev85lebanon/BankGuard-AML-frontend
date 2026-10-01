"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import api from "@/services/api";

const TRANSACTION_STATUSES = [
  "Pending",
  "Under Review",
  "Cleared",
  "Escalated",
] as const;

type Transaction = {
  _id: string;
  transaction_id: string;
  customer_id: string;
  amount: number;
  country: string;
  merchant: string;
  risk_score: number;
  status?: string;
};

type Status = (typeof TRANSACTION_STATUSES)[number];

const riskBadge = (score: number) => {
  if (score >= 50) return "bg-red-100 text-red-700";

  if (score >= 20) return "bg-yellow-100 text-yellow-700";

  return "bg-green-100 text-green-700";
};
const statusBadge = (status?: string) => {
  switch (status) {
    case "Under Review":
      return "bg-yellow-100 text-yellow-700";
    case "Cleared":
      return "bg-green-100 text-green-700";
    case "Escalated":
      return "bg-red-100 text-red-700";
    default:
      return "bg-blue-100 text-blue-700";
  }
};
export default function TransactionTable({
  transactions,
  onStatusChange,
  onDelete,
}: {
  transactions: Transaction[];
  onStatusChange: (transactionId: string, status: Status) => void;
  onDelete: (transactionId: string) => void;
}) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const updateStatus = async (transactionId: string, status: Status) => {
    setUpdatingId(transactionId);
    setActionError(null);

    try {
      await api.patch(`/transactions/${transactionId}/status`, { status });
      onStatusChange(transactionId, status);
    } catch (error) {
      console.error("Could not update transaction status:", error);
      setActionError(`Could not update ${transactionId}. Please try again.`);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    const confirmed = window.confirm(
      `Delete transaction ${transactionId}? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setDeletingId(transactionId);
    setActionError(null);
    try {
      await api.delete(`/transactions/${transactionId}`);
      onDelete(transactionId);
    } catch (error) {
      console.error("Could not delete transaction:", error);
      setActionError(`Could not delete ${transactionId}. Please try again.`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-4">Transaction</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Country</th>
            <th className="p-4">Risk</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id} className="border-t hover:bg-gray-50">
              <td className="p-4 font-semibold">
                <Link
                  href={`/transactions/${transaction.transaction_id}`}
                  className="text-blue-600 hover:underline"
                >
                  {transaction.transaction_id}
                </Link>
              </td>
              <td className="p-4">{transaction.customer_id}</td>

              <td className="p-4">{transaction.amount.toLocaleString()} DKK</td>

              <td className="p-4">{transaction.country}</td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${riskBadge(
                    transaction.risk_score,
                  )}`}
                >
                  {transaction.risk_score}
                </span>
              </td>
              <td className="p-4">
                <select
                  aria-label={`Status for transaction ${transaction.transaction_id}`}
                  value={transaction.status ?? "Pending"}
                  disabled={updatingId === transaction.transaction_id}
                  onChange={(event) =>
                    updateStatus(transaction.transaction_id, event.target.value as Status)
                  }
                  className={`rounded-full border-0 px-3 py-1 text-sm font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-wait disabled:opacity-60 ${statusBadge(
                    transaction.status,
                  )}`}
                >
                  {TRANSACTION_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-4">
                <button
                  type="button"
                  aria-label={`Delete transaction ${transaction.transaction_id}`}
                  title="Delete transaction"
                  disabled={deletingId === transaction.transaction_id}
                  onClick={() => deleteTransaction(transaction.transaction_id)}
                  className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-wait disabled:opacity-50"
                >
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {actionError && (
        <p role="alert" className="border-t px-4 py-3 text-sm text-red-700">
          {actionError}
        </p>
      )}
    </div>
  );
}
