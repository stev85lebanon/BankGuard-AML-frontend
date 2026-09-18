type Props = {
  title: string;
  value: number | string;
};

export default function SummaryCard({ title, value }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">
      <p className="text-gray-500 text-sm">{title}</p>

      <h3 className="text-3xl font-bold mt-2">{value}</h3>
    </div>
  );
}
