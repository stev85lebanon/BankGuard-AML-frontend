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
  timestamp: string;
  risk_score: number;
  reasons: string[];
  status?: string;
};

export default function TransactionPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    async function loadTransaction() {
      const { transactionId } = await params;
      const response = await api.get(`/transactions/${transactionId}`);
      setTransaction(response.data);
    }

    loadTransaction();
  }, [params]);

  if (!transaction) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <main className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Transaction {transaction.transaction_id}
      </h1>

      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-3">
        <p>
          <strong>Customer:</strong> {transaction.customer_id}
        </p>
        <p>
          <strong>Amount:</strong> {transaction.amount.toLocaleString()} DKK
        </p>
        <p>
          <strong>Country:</strong> {transaction.country}
        </p>
        <p>
          <strong>Merchant:</strong> {transaction.merchant}
        </p>
        <p>
          <strong>Risk Score:</strong> {transaction.risk_score}
        </p>
        <p>
          <strong>Status:</strong> {transaction.status ?? "Pending"}
        </p>

        <div>
          <strong>Reasons</strong>

          <ul className="list-disc ml-6 mt-2">
            {transaction.reasons.map((reason, index) => (
              <li key={index}>{reason}</li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
