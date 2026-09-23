"use client";

import { Upload } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function ImportPage() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <main className="flex-1">
        <Topbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-2">
            Import Transaction Dataset
          </h1>

          <p className="text-gray-600 mb-8">
            Upload a CSV file containing transaction data.
          </p>

          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
            <Upload className="mx-auto mb-4 text-gray-400" size={48} />

            <h2 className="text-xl font-semibold mb-2">
              Drag & Drop your CSV file here
            </h2>

            <p className="text-gray-500 mb-6">
              or choose a file from your computer
            </p>

            <button className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition">
              Choose File
            </button>
          </div>

          <div className="mt-8 bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-3">Expected CSV Format</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">transaction_id</th>
                    <th className="p-3 text-left">customer_id</th>
                    <th className="p-3 text-left">amount</th>
                    <th className="p-3 text-left">country</th>
                    <th className="p-3 text-left">merchant</th>
                    <th className="p-3 text-left">timestamp</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-t">
                    <td className="p-3">TX001</td>
                    <td className="p-3">C001</td>
                    <td className="p-3">1500</td>
                    <td className="p-3">Denmark</td>
                    <td className="p-3">Netto</td>
                    <td className="p-3">2026-09-23T10:00:00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button className="mt-4 text-blue-600 hover:underline">
              Download Template
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
