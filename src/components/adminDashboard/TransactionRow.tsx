import { Transaction } from "@/lib";
import { FiMoreVertical } from "react-icons/fi";

interface TransactionRowProps {
  transaction: Transaction;
}

export default function TransactionRow({ transaction }: TransactionRowProps) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Completed":
        return {
          bg: "bg-green-100 dark:bg-green-900/40",
          text: "text-green-700 dark:text-green-300",
          dot: "bg-green-600 dark:bg-green-400",
        };
      case "Pending":
        return {
          bg: "bg-yellow-100 dark:bg-yellow-900/40",
          text: "text-yellow-700 dark:text-yellow-300",
          dot: "bg-yellow-600 dark:bg-yellow-400",
        };
      case "Failed":
        return {
          bg: "bg-red-100 dark:bg-red-900/40",
          text: "text-red-700 dark:text-red-300",
          dot: "bg-red-600 dark:bg-red-400",
        };
      default:
        return {
          bg: "bg-slate-100 dark:bg-slate-700",
          text: "text-slate-700 dark:text-slate-300",
          dot: "bg-slate-600 dark:bg-slate-400",
        };
    }
  };

  const statusStyles = getStatusStyles(transaction.status);

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
      <td className="px-6 lg:px-8 py-4 text-slate-900 dark:text-white">
        {transaction.id}
      </td>

      <td className="px-6 lg:px-8 py-4">
        <div className="flex items-center gap-3">
          <div
            className="size-8 rounded-full bg-slate-200 dark:bg-slate-600 bg-cover bg-center"
            style={{ backgroundImage: `url('${transaction.investorImage}')` }}
            aria-label={`Portrait of investor ${transaction.investor}`}
          />
          <span className="text-slate-700 dark:text-slate-200">
            {transaction.investor}
          </span>
        </div>
      </td>

      <td className="px-6 lg:px-8 py-4 text-slate-600 dark:text-slate-400">
        {transaction.type}
      </td>

      <td className="px-6 lg:px-8 py-4 text-slate-900 dark:text-white font-bold">
        {transaction.amount}
      </td>

      <td className="px-6 lg:px-8 py-4 text-slate-500 dark:text-slate-400">
        {transaction.date}
      </td>

      <td className="px-6 lg:px-8 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${statusStyles.bg} ${statusStyles.text}`}
        >
          <span className={`size-1.5 rounded-full ${statusStyles.dot}`}></span>
          {transaction.status}
        </span>
      </td>

      <td className="px-6 lg:px-8 py-4 text-right">
        <button className="text-slate-400 hover:text-primary transition-colors">
          <FiMoreVertical size={20} />
        </button>
      </td>
    </tr>
  );
}
