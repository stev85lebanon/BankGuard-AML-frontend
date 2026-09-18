import Link from "next/link";
type Transaction = {
  _id: string;
  transaction_id: string;
  customer_id: string;
  amount: number;
  country: string;
  merchant: string;
  risk_score: number;
};

const riskBadge = (score: number) => {
  if (score >= 50) return "bg-red-100 text-red-700";

  if (score >= 20) return "bg-yellow-100 text-yellow-700";

  return "bg-green-100 text-green-700";
};

export default function TransactionTable({
  transactions,
}: {
  transactions: Transaction[];
}) {
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
