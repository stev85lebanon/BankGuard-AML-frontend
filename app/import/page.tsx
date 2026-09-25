"use client";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import api from "@/services/api";
export default function ImportPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, string>[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const handleImport = async () => {
    if (!selectedFile) return;

    setImporting(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await api.post("/transactions/import", formData);

      alert(
        `Imported ${response.data.imported} transactions.\nDuplicates: ${response.data.duplicates}`,
      );

      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Import failed.");
    } finally {
      setImporting(false);
    }
  };
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
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                setSelectedFile(file);

                Papa.parse(file, {
                  header: true,
                  skipEmptyLines: true,
                  complete: (results) => {
                    setPreviewData(
                      results.data.slice(0, 10) as Record<string, string>[],
                    );
                  },
                });
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition"
            >
              Choose File
            </button>
            {selectedFile && (
              <div className="mt-6 bg-gray-50 border rounded-xl p-4 text-left max-w-md mx-auto">
                <p className="font-semibold">Selected File</p>
                <p className="text-gray-700">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            )}
            {previewData.length > 0 && (
              <div className="mt-6 bg-white border rounded-xl p-4 text-left">
                <h3 className="font-semibold mb-3">Preview (First 10 Rows)</h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {Object.keys(previewData[0]).map((key) => (
                          <th key={key} className="p-3 text-left">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {previewData.map((row, index) => (
                        <tr key={index} className="border-t">
                          {Object.values(row).map((value, i) => (
                            <td key={i} className="p-3">
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <button
              onClick={handleImport}
              className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
            >
              Import to Database
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
