type Props = {
  title: string;
  subtitle: string;
  date: string;
  time: string;
  status: string;
  amount: string;
  positive?: boolean;
  transactionID: string;
  id?: string;
  onOpen?: (id: string) => void;
};

export default function TransactionRow({
  transactionID,
  title,
  subtitle,
  date,
  time,
  status,
  amount,
  positive,
  id,
  onOpen,
}: Props) {
  return (
    <tr
      onClick={() => id && onOpen?.(id)}
      className="border-b last:border-b-0 border-[#e6f0e6] hover:bg-gray-50 cursor-pointer"
    >
      <td className="p-4">
        <span className="text-sm">{transactionID}</span>
      </td>

      <td className="p-4">
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </td>

      <td className="p-4">
        <p className="text-sm">{date}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </td>

      <td className="p-4">
        <span className="text-sm text-gray-600">{status}</span>
      </td>

      <td
        className={`p-4 text-right ${positive ? "text-green-600" : "text-gray-700"}`}
      >
        {amount}
      </td>
    </tr>
  );
}
