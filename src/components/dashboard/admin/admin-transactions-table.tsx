import { DollarSign, CreditCard, Calendar, Download } from "lucide-react";
import { AdminTransaction } from "@/types/admin";

interface AdminTransactionsTableProps {
  transactions: AdminTransaction[];
  totalCount: number;
  loading: boolean;
}

export function AdminTransactionsTable({
  transactions,
  totalCount,
  loading,
}: AdminTransactionsTableProps) {
  return (
    <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground">
            Subscription Transactions
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalCount} total verified payments
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-muted/30 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <CreditCard className="size-8 mx-auto text-muted-foreground/60 mb-2" />
          <p className="text-xs font-semibold text-foreground">No transactions recorded yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-100 dark:border-stone-800 text-[11px] font-semibold text-muted-foreground">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Vendor</th>
                <th className="py-2.5 px-3">Plan</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80">
              {transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                    {tx.createdAt
                      ? new Date(tx.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-medium text-foreground truncate max-w-[150px]">
                      {tx.vendor?.businessName || tx.vendor?.name || "Vendor"}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">
                      {tx.vendor?.email}
                    </p>
                  </td>
                  <td className="py-3 px-3 capitalize whitespace-nowrap">
                    {tx.plan ? tx.plan.replace("_", " ") : "Premium"}
                  </td>
                  <td className="py-3 px-3 font-semibold text-foreground whitespace-nowrap">
                    ${Number(tx.amount || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 rounded-full px-2.5 py-0.5 text-[10px] font-semibold">
                      Paid
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
