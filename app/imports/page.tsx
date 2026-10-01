"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/imports").then((response) => {
      setImports(response.data.imports);
    });
  }, []);

  const deleteImport = async (item: ImportRecord) => {
    if (!window.confirm(`Remove import history for ${item.file_name}?`)) return;

    setDeletingId(item._id);
    setError("");
    try {
      await api.delete(`/imports/${item._id}`);
      setImports((current) => current.filter((record) => record._id !== item._id));
    } catch (deleteError) {
      console.error("Could not remove import history:", deleteError);
      setError(`Could not remove ${item.file_name}. Please try again.`);
    } finally {
      setDeletingId(null);
    }
  };

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
                  <th className="p-4">Actions</th>
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

                    <td className="p-4">
                      <button
                        type="button"
                        aria-label={`Remove history for ${item.file_name}`}
                        title="Remove import history"
                        disabled={deletingId === item._id}
                        onClick={() => deleteImport(item)}
                        className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-wait disabled:opacity-50"
                      >
                        <Trash2 size={18} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {error && (
            <p role="alert" className="mt-4 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
