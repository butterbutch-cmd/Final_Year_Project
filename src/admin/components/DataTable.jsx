import { useMemo, useState, useEffect } from "react";
import { 
  Search, 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

/**
 * columns can be:
 *  - array of strings (labels) [backwards compatible] — not sortable
 *  - array of objects: { label: 'Product', key: 'productName', sortable: true }
 */
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

  // Sorting State
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc"); // 'asc' | 'desc'

  /* ---------- FIX: RESET PAGE ONLY ON FILTER / SEARCH CHANGE ---------- */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  /* ---------- NORMALIZE COLUMNS FOR BACKWARD COMPATIBILITY ---------- */
  const normalizedColumns = useMemo(() => {
    return columns.map((col, idx) => {
      if (typeof col === "string") {
        return { label: col, key: null, sortable: false, idx };
      }
      return {
        label: col.label,
        key: col.key,
        sortable: !!col.sortable,
        idx,
      };
    });
  }, [columns]);

  /* ---------- FILTER, SEARCH, SORT ENGINE ---------- */
  const processedData = useMemo(() => {
    let result = [...data];

    // 🔍 Search Handling
    if (search && searchableKeys.length > 0) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        searchableKeys.some((key) => {
          const val = key.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), item);
          return String(val || "").toLowerCase().includes(q);
        })
      );
    }

    // 🎯 Dropdown Filtering (Handles simple matches & deep tags)
    if (filter !== "all" && filterKey) {
      result = result.filter((item) => {
        const value = item[filterKey];
        return Array.isArray(value) ? value.includes(filter) : value === filter;
      });
    }

    // 🔽 Intelligent Data Sorting
    if (sortKey) {
      result.sort((a, b) => {
        const av = sortKey.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), a);
        const bv = sortKey.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), b);

        if (av == null && bv == null) return 0;
        if (av == null) return sortDir === "asc" ? -1 : 1;
        if (bv == null) return sortDir === "asc" ? 1 : -1;

        // Numeric evaluation
        if (!isNaN(av) && !isNaN(bv)) {
          return sortDir === "asc" ? Number(av) - Number(bv) : Number(bv) - Number(av);
        }

        // Standard lexicographical string fallback
        return sortDir === "asc"
          ? String(av).toLowerCase().localeCompare(String(bv).toLowerCase())
          : String(bv).toLowerCase().localeCompare(String(aV).toLowerCase());
      });
    }

    return result;
  }, [data, search, filter, searchableKeys, filterKey, sortKey, sortDir]);

  /* ---------- CONSTRAINED PAGINATION ---------- */
  const totalPages = Math.max(1, Math.ceil(processedData.length / itemsPerPage));

  // Fix bounds if data completely mutates underneath current pagination index
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedData.slice(start, start + itemsPerPage);
  }, [processedData, currentPage, itemsPerPage]);

  // Generates smart page jumps so pagination layout doesn't break if pages blow up
  const visiblePages = useMemo(() => {
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + maxVisible - 1, totalPages);
    
    if (end === totalPages) {
      start = Math.max(end - maxVisible + 1, 1);
    }
    return Array.from({ length: (end - start) + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  const toggleSort = (col) => {
    if (!col.sortable || !col.key) return;
    if (sortKey === col.key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col.key);
      setSortDir("asc");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#2d4a2d]/10 bg-white font-sans shadow-sm">
      
      {/* ---------- TOOLBAR & HEADINGS ---------- */}
      <div className="border-b border-gray-100 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif text-[#1a3320]">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            {searchableKeys.length > 0 && (
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search table..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-64 rounded-xl border border-[#2d4a2d]/20 bg-white/50 py-2 pl-9 pr-4 text-sm text-[#1a3320] outline-none transition placeholder:text-gray-400 focus:border-[#2d4a2d]/50 focus:bg-white focus:ring-1 focus:ring-[#2d4a2d]/50"
                />
              </div>
            )}

            {filterOptions.length > 0 && (
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="cursor-pointer rounded-xl border border-[#2d4a2d]/20 bg-white/50 px-4 py-2 text-sm text-gray-700 outline-none transition focus:border-[#2d4a2d]/50 focus:bg-white focus:ring-1 focus:ring-[#2d4a2d]/50"
              >
                <option value="all">All Categories</option>
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

      {/* ---------- GRID DATA TABLE ---------- */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-[#f7f4ee]/50">
              {normalizedColumns.map((col, i) => {
                const isCurrentSort = sortKey === col.key;
                return (
                  <th
                    key={i}
                    onClick={() => toggleSort(col)}
                    className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 ${
                      col.sortable && col.key ? "cursor-pointer select-none hover:text-[#1a3320]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.label}</span>
                      {col.sortable && col.key && (
                        <span className="text-gray-400">
                          {!isCurrentSort ? (
                            <ChevronsUpDown size={14} className="opacity-60" />
                          ) : sortDir === "asc" ? (
                            <ChevronUp size={14} className="text-[#2d4a2d]" />
                          ) : (
                            <ChevronDown size={14} className="text-[#2d4a2d]" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
              {actions && (
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr key={row._id || index} className="transition-colors hover:bg-[#f7f4ee]/20">
                  {renderRow(row)}
                  {actions && (
                    <td className="whitespace-nowrap px-6 py-4 text-center">
                      <div className="flex justify-center">{actions(row)}</div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={normalizedColumns.length + (actions ? 1 : 0)}
                  className="px-6 py-16 text-center text-sm font-medium text-gray-400"
                >
                  {emptyState}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- PAGINATION UI ---------- */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between border-t border-gray-100 bg-[#f7f4ee]/30 px-6 py-4 gap-4">
          <p className="text-xs text-gray-500 font-medium">
            Showing <span className="text-gray-800 font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="text-gray-800 font-semibold">{Math.min(currentPage * itemsPerPage, processedData.length)}</span> of{" "}
            <span className="text-gray-800 font-semibold">{processedData.length}</span> items
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2d4a2d]/10 bg-white text-gray-600 transition hover:bg-[#eef5ee] hover:text-[#2d4a2d] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-600"
            >
              <ChevronLeft size={16} />
            </button>

            {visiblePages.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-9 min-w-[36px] rounded-xl px-2 text-xs font-semibold transition ${
                  page === currentPage
                    ? "bg-[#1a3320] text-white shadow-sm"
                    : "border border-[#2d4a2d]/10 bg-white text-gray-700 hover:bg-[#eef5ee] hover:text-[#2d4a2d]"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2d4a2d]/10 bg-white text-gray-600 transition hover:bg-[#eef5ee] hover:text-[#2d4a2d] disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-gray-600"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;