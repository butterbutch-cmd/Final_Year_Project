import { useMemo, useState } from "react";
import { Search } from "lucide-react";

const DataTable = ({
  title,
  subtitle,
  columns = [],
  data = [],
  renderRow,
  actions,

  searchableKeys = [],
  filterOptions = [],
  filterKey = "",

  itemsPerPage = 5,
  emptyState = "No data available",
}) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  /* ---------- SEARCH + FILTER ---------- */
  const processedData = useMemo(() => {
    let result = [...data];

    // 🔍 SEARCH
    if (search && searchableKeys.length > 0) {
      result = result.filter((item) =>
        searchableKeys.some((key) =>
          String(item[key] || "")
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      );
    }

    // 🎯 FILTER (supports arrays like tags)
    if (filter !== "all" && filterKey) {
      result = result.filter((item) => {
        const value = item[filterKey];

        // if it's an array (like tags)
        if (Array.isArray(value)) {
          return value.includes(filter);
        }

        // normal value
        return value === filter;
      });
    }

    return result;
  }, [data, search, filter, searchableKeys, filterKey]);

  /* ---------- PAGINATION ---------- */
  const totalPages = Math.ceil(processedData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedData.slice(start, start + itemsPerPage);
  }, [processedData, currentPage, itemsPerPage]);

  const resetPage = () => setCurrentPage(1);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* ---------- HEADER ---------- */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex flex-wrap justify-between gap-4 items-start">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>

          {/* SEARCH & FILTER */}
          <div className="flex gap-3 items-center">
            {/* Search */}
            {searchableKeys.length > 0 && (
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    resetPage();
                  }}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow w-64"
                />
              </div>
            )}

            {/* Filter */}
            {filterOptions.length > 0 && (
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  resetPage();
                }}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow cursor-pointer"
              >
                <option value="all">All</option>
                {filterOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* ---------- TABLE ---------- */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {col}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr
                  key={row._id || index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {renderRow(row)}
                  {actions && (
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyState}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
