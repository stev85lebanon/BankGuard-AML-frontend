"use client";

import { useEffect, useMemo, useState } from "react";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import TransactionTable from "@/components/TransactionTable";
import api from "@/services/api";

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

type RiskFilter = "all" | "high" | "medium" | "low";
type SortBy = "risk" | "newest" | "oldest" | "amount";

const PAGE_SIZE = 20;

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortBy>("risk");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/transactions")
      .then((response) => setTransactions(response.data.transactions))
      .catch((requestError) => {
        console.error("Transactions request failed:", requestError);
        setError("Could not load transactions. Check that the backend is running.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const matches = transactions.filter((transaction) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          transaction.transaction_id,
          transaction.customer_id,
          transaction.country,
          transaction.merchant,
        ].some((value) => value.toLowerCase().includes(normalizedSearch));
      const matchesRisk =
        riskFilter === "all" ||
        (riskFilter === "high" && transaction.risk_score >= 50) ||
        (riskFilter === "medium" && transaction.risk_score >= 20 && transaction.risk_score < 50) ||
        (riskFilter === "low" && transaction.risk_score < 20);
      const matchesStatus =
        statusFilter === "all" || (transaction.status ?? "Pending") === statusFilter;
      return matchesSearch && matchesRisk && matchesStatus;
    });

    return matches.sort((a, b) => {
      if (sortBy === "risk") return b.risk_score - a.risk_score;
      if (sortBy === "amount") return b.amount - a.amount;
      const difference = Date.parse(b.timestamp) - Date.parse(a.timestamp);
      return sortBy === "newest" ? difference : -difference;
    });
  }, [transactions, search, riskFilter, statusFilter, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE));
  const visibleTransactions = filteredTransactions.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const handleStatusChange = (transactionId: string, status: string) => {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.transaction_id === transactionId
          ? { ...transaction, status }
          : transaction,
      ),
    );
  };

  const handleDelete = (transactionId: string) => {
    setTransactions((current) =>
      current.filter((transaction) => transaction.transaction_id !== transactionId),
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <Topbar />
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Transactions</h1>
            <p className="mt-2 text-gray-600">
              Search, filter, and review the full transaction dataset.
            </p>
          </div>

          <section className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="text-sm font-medium text-gray-700">
                Search
                <input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setPage(1);
                    setSearch(event.target.value);
                  }}
                  placeholder="ID, customer, country, merchant"
                  className="mt-1 w-full rounded-lg border px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
              <label className="text-sm font-medium text-gray-700">
                Risk level
                <select
                  value={riskFilter}
                  onChange={(event) => {
                    setPage(1);
                    setRiskFilter(event.target.value as RiskFilter);
                  }}
                  className="mt-1 w-full rounded-lg border bg-white px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All risk levels</option>
                  <option value="high">High · 50+</option>
                  <option value="medium">Medium · 20–49</option>
                  <option value="low">Low · 0–19</option>
                </select>
              </label>
              <label className="text-sm font-medium text-gray-700">
                Status
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setPage(1);
                    setStatusFilter(event.target.value);
                  }}
                  className="mt-1 w-full rounded-lg border bg-white px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Cleared">Cleared</option>
                  <option value="Escalated">Escalated</option>
                </select>
              </label>
              <label className="text-sm font-medium text-gray-700">
                Sort by
                <select
                  value={sortBy}
                  onChange={(event) => {
                    setPage(1);
                    setSortBy(event.target.value as SortBy);
                  }}
                  className="mt-1 w-full rounded-lg border bg-white px-3 py-2 font-normal focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="risk">Highest risk</option>
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="amount">Highest amount</option>
                </select>
              </label>
            </div>
          </section>

          {error && (
            <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </p>
          )}

          {loading ? (
            <div className="rounded-xl border bg-white p-6 text-gray-500">Loading transactions…</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="rounded-xl border bg-white p-6 text-gray-500">
              No transactions match these filters.
            </div>
          ) : (
            <>
              <p className="mb-3 text-sm text-gray-600">
                Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </p>
              <TransactionTable
                transactions={visibleTransactions}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-sm text-gray-600">Page {page} of {pageCount}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={page >= pageCount}
                    onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                    className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
