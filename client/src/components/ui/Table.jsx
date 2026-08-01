import { cn } from "../../lib/cn";

const Table = ({ columns = [], data = [], renderRow, empty = "No records found.", className = "" }) => (
  <div className={cn("overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.055)]", className)}>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th key={column.key || column} scope="col" className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                {column.label || column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.length > 0 ? (
            data.map((row, index) => renderRow(row, index))
          ) : (
            <tr>
              <td colSpan={columns.length || 1} className="px-5 py-12 text-center text-sm font-medium text-slate-500">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default Table;
