import TransactionRow from "./TransactionRow";

export default function TransactionTable() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold">Transaction History</h3>

      <div className="bg-white border border-[#d5e7cf] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-[#d5e7cf] text-xs uppercase text-gray-500">
            <tr>
              <th className="p-4">withdrawalID</th>
              <th className="p-4">Transaction</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Amount</th>
            </tr>
          </thead>

          <tbody>
            <TransactionRow
              withdrawalID="FGHJKSK"
              title="Cassava Farm Cycle 2"
              subtitle="ROI Payment"
              date="Oct 24, 2023"
              time="10:42 AM"
              status="Completed"
              amount="+$450.00"
              positive
            />

            <TransactionRow
              withdrawalID="FGHJKSK"
              title="Withdrawal to Bank"
              subtitle="Transfer to ****1234"
              date="Oct 20, 2023"
              time="02:15 PM"
              status="Processing"
              amount="-$1000.00"
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}
