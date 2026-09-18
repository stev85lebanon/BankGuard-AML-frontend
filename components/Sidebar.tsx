import {
  LayoutDashboard,
  Wallet,
  Bell,
  ShieldCheck,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-8">BankGuard AML</h1>

      <nav className="space-y-4">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800">
          <LayoutDashboard size={20} />
          Dashboard
        </div>

        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 cursor-pointer">
          <Wallet size={20} />
          Transactions
        </div>

        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 cursor-pointer">
          <Bell size={20} />
          Alerts
        </div>

        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 cursor-pointer">
          <ShieldCheck size={20} />
          Cases
        </div>

        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 cursor-pointer">
          <Settings size={20} />
          Settings
        </div>
      </nav>
    </aside>
  );
}
