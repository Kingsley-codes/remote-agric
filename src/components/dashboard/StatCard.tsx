interface Props {
  title: string;
  value: string;
  badge?: string;
}

export default function StatCard({ title, value, badge }: Props) {
  return (
    <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between">
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>

        {badge && (
          <span className="text-xs font-bold text-[#078821] bg-[#eaf3e7] px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>

      <div>
        <h3 className="text-2xl pl-3 text-gray-800 font-bold">{value}</h3>
      </div>
    </div>
  );
}
