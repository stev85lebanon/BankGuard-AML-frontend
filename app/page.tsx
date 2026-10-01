"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import api from "@/services/api";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import SummaryCard from "@/components/SummaryCard";

type Transaction = {
  _id: string;
  transaction_id: string;
  customer_id: string;
  amount: number;
  country: string;
  merchant: string;
  timestamp: string;
  risk_score: number;
  status?: string;
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    api
      .get("/transactions")
      .then((response) => setTransactions(response.data.transactions))
      .catch((error) => {
        console.error("Transactions request failed:", error);
        setLoadError("Could not load transactions. Check that the backend is running.");
      })
      .finally(() => setLoading(false));
  }, []);

  const highRisk = transactions.filter((transaction) => transaction.risk_score >= 50);
  const mediumRisk = transactions.filter(
    (transaction) => transaction.risk_score >= 20 && transaction.risk_score < 50,
  );
  const lowRisk = transactions.filter((transaction) => transaction.risk_score < 20);
  const underReview = transactions.filter(
    (transaction) => transaction.status === "Under Review",
  ).length;
  const priorityTransactions = [...highRisk]
    .sort((a, b) => b.risk_score - a.risk_score)
    .slice(0, 5);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1">
        <Topbar />

        <div className="p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Risk Overview</h1>
              <p className="mt-2 text-gray-600">
                Transaction counts by risk score and current review workload.
              </p>
            </div>
            <Link
              href="/transactions"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
            >
              View all transactions
            </Link>
          </div>

          {loadError && (
            <p role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {loadError}
            </p>
          )}

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <SummaryCard title="Total Transactions" value={loading ? "—" : transactions.length} />
            <SummaryCard title="High Risk · 50+" value={loading ? "—" : highRisk.length} />
            <SummaryCard title="Medium Risk · 20–49" value={loading ? "—" : mediumRisk.length} />
            <SummaryCard title="Low Risk · 0–19" value={loading ? "—" : lowRisk.length} />
            <SummaryCard title="Under Review" value={loading ? "—" : underReview} />
          </div>

          <section className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
              <div>
                <h2 className="text-lg font-semibold">Highest Risk Transactions</h2>
                <p className="mt-1 text-sm text-gray-500">
                  The five highest scoring transactions that may need attention.
                </p>
              </div>
              <Link href="/transactions" className="text-sm font-medium text-blue-700 hover:underline">
                Open transaction list
              </Link>
            </div>

            {loading ? (
              <p className="p-5 text-sm text-gray-500">Loading transactions…</p>
            ) : priorityTransactions.length === 0 ? (
              <p className="p-5 text-sm text-gray-500">
                No high-risk transactions found.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="p-4">Transaction</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Risk Score</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priorityTransactions.map((transaction) => (
                      <tr key={transaction._id} className="border-t hover:bg-gray-50">
                        <td className="p-4 font-medium">
                          <Link
                            href={`/transactions/${transaction.transaction_id}`}
                            className="text-blue-700 hover:underline"
                          >
                            {transaction.transaction_id}
                          </Link>
                        </td>
                        <td className="p-4">{transaction.customer_id}</td>
                        <td className="p-4">{transaction.amount.toLocaleString()} DKK</td>
                        <td className="p-4 font-semibold text-red-700">{transaction.risk_score}</td>
                        <td className="p-4">{transaction.status ?? "Pending"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
