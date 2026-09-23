import {
  LayoutDashboard,
  Wallet,
  Bell,
  ShieldCheck,
  Upload,
  Settings,
} from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-8">BankGuard AML</h1>

      <nav className="space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 p-3 rounded-lg bg-slate-800 hover:bg-slate-700"
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        <Link
          href="/"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
        >
          <Wallet size={20} />
          Transactions
        </Link>

        <Link
          href="/import"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
        >
          <Upload size={20} />
          Import Dataset
        </Link>

        <Link
          href="/"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
        >
          <Bell size={20} />
          Alerts
        </Link>

        <Link
          href="/"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
        >
          <ShieldCheck size={20} />
          Cases
        </Link>

        <Link
          href="/"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
        >
          <Settings size={20} />
          Settings
        </Link>
      </nav>
    </aside>
  );
}
