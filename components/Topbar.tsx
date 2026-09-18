export default function Topbar() {
  const today = new Date().toLocaleDateString("en-GB");

  return (
    <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
      <h2 className="text-2xl font-semibold">AML Dashboard</h2>

      <div className="text-gray-600">{today}</div>
    </header>
  );
}
