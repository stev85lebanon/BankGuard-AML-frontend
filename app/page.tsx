"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";

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

  useEffect(() => {
    api.get("/transactions").then((response) => {
      setTransactions(response.data.transactions);
    });
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">BankGuard AML Dashboard</h1>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction._id}
            className="border rounded-xl p-4 shadow-sm"
          >
            <h2 className="font-semibold">{transaction.transaction_id}</h2>

            <p>Customer: {transaction.customer_id}</p>
            <p>Amount: {transaction.amount} DKK</p>
            <p>Country: {transaction.country}</p>
            <p>Risk Score: {transaction.risk_score}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
