"use client";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import type { DragEvent } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import api from "@/services/api";

const REQUIRED_COLUMNS = [
  "transaction_id",
  "customer_id",
  "amount",
  "country",
  "merchant",
  "timestamp",
];

export default function ImportPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Record<string, string>[]>([]);
  const [fileError, setFileError] = useState("");
  const [canImport, setCanImport] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [importing, setImporting] = useState(false);

  const processFile = (file: File) => {
    setSelectedFile(file);
    setPreviewData([]);
    setFileError("");
    setCanImport(false);

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setFileError("Choose a CSV file to continue.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        if (results.errors.length > 0) {
          setFileError(`Could not read this CSV: ${results.errors[0].message}`);
          return;
        }

        const fields = results.meta.fields ?? [];
        const missingColumns = REQUIRED_COLUMNS.filter(
          (column) => !fields.includes(column),
        );
        if (missingColumns.length > 0) {
          setFileError(`Missing required columns: ${missingColumns.join(", ")}`);
          return;
        }

        const rows = results.data as Record<string, string>[];
        if (rows.length === 0) {
          setFileError("This CSV has a header but no transaction rows.");
          return;
        }

        const invalidRow = rows.findIndex((row) =>
          REQUIRED_COLUMNS.some((column) => !row[column]?.trim()) ||
          !Number.isFinite(Number(row.amount)) ||
          !Number.isFinite(Date.parse(row.timestamp)),
        );
        if (invalidRow !== -1) {
          setFileError(`Row ${invalidRow + 2} has a missing or invalid required value.`);
          return;
        }

        setPreviewData(rows.slice(0, 10));
        setCanImport(true);
      },
    });
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile || !canImport) return;

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
      setFileError("Import failed. Check that the backend is running and try again.");
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

          <div
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                setIsDragging(false);
              }
            }}
            onDrop={handleDrop}
            className={`rounded-2xl border-2 border-dashed p-12 text-center transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-white"
            }`}
          >
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
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) processFile(file);
                event.target.value = "";
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium shadow-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 active:translate-y-0 active:scale-[0.98]"
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
            {fileError && (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {fileError}
              </p>
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
              disabled={!canImport || importing}
              className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition disabled:cursor-not-allowed disabled:opacity-50"
            >
              {importing ? "Importing…" : "Import to Database"}
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
