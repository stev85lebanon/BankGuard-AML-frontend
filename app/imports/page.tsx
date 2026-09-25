"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import api from "@/services/api";

type ImportRecord = {
  _id: string;
  file_name: string;
  imported: number;
  duplicates: number;
  total_rows: number;
  status: string;
  created_at: string;
};

export default function ImportsPage() {
  const [imports, setImports] = useState<ImportRecord[]>([]);

  useEffect(() => {
    api.get("/imports").then((response) => {
      setImports(response.data.imports);
    });
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <main className="flex-1">
        <Topbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">Import History</h1>

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="p-4">File</th>
                  <th className="p-4">Imported</th>
                  <th className="p-4">Duplicates</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {imports.map((item) => (
                  <tr key={item._id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-medium">{item.file_name}</td>

                    <td className="p-4">{item.imported}</td>

                    <td className="p-4">{item.duplicates}</td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
