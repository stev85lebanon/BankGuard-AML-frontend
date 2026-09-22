"use client";

import { useEffect, useState } from "react";

import api from "@/services/api";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import SummaryCard from "@/components/SummaryCard";
import TransactionTable from "@/components/TransactionTable";
type Transaction = {
  _id: string;
  transaction_id: string;
  customer_id: string;
  amount: number;
  country: string;
  merchant: string;
  risk_score: number;
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    api.get("/transactions").then((response) => {
      setTransactions(response.data.transactions);
    });
  }, []);
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.transaction_id.toLowerCase().includes(search.toLowerCase()) ||
      transaction.customer_id.toLowerCase().includes(search.toLowerCase()),
  );
  const highRisk = transactions.filter((t) => t.risk_score >= 50).length;
  const countries = new Set(transactions.map((t) => t.country)).size;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <main className="flex-1">
        <Topbar />

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <SummaryCard
              title="Total Transactions"
              value={transactions.length}
            />

            <SummaryCard title="High Risk Cases" value={highRisk} />

            <SummaryCard title="Countries" value={countries} />
          </div>

          <h2 className="text-xl font-semibold mb-4">Transactions</h2>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search by Transaction ID or Customer ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-3">
            <TransactionTable transactions={filteredTransactions} />{" "}
          </div>
        </div>
      </main>
    </div>
  );
}
