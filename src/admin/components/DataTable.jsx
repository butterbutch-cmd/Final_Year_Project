// import { useMemo, useState, useEffect } from "react";
// import { Search } from "lucide-react";

// const DataTable = ({
//   title,
//   subtitle,
//   columns = [],
//   data = [],
//   renderRow,
//   actions,

//   searchableKeys = [],
//   filterOptions = [],
//   filterKey = "",

//   itemsPerPage = 5,
//   emptyState = "No data available",
// }) => {
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);

//   /* ---------- RESET PAGE ON DATA CHANGE ---------- */
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search, filter, data]);

//   /* ---------- SEARCH + FILTER ---------- */
//   const processedData = useMemo(() => {
//     let result = [...data];

//     // 🔍 SEARCH
//     if (search && searchableKeys.length > 0) {
//       result = result.filter((item) =>
//         searchableKeys.some((key) =>
//           String(item[key] || "")
//             .toLowerCase()
//             .includes(search.toLowerCase())
//         )
//       );
//     }

//     // 🎯 FILTER (supports arrays like tags)
//     if (filter !== "all" && filterKey) {
//       result = result.filter((item) => {
//         const value = item[filterKey];

//         // if it's an array (like tags)
//         if (Array.isArray(value)) {
//           return value.includes(filter);
//         }

//         // normal value
//         return value === filter;
//       });
//     }

//     return result;
//   }, [data, search, filter, searchableKeys, filterKey]);

//   /* ---------- PAGINATION ---------- */
//   const totalPages = Math.ceil(processedData.length / itemsPerPage);

//   const paginatedData = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return processedData.slice(start, start + itemsPerPage);
//   }, [processedData, currentPage, itemsPerPage]);

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//       {/* ---------- HEADER ---------- */}
//       <div className="px-6 py-5 border-b border-gray-200">
//         <div className="flex flex-wrap justify-between gap-4 items-start">
//           <div>
//             <h2 className="text-lg font-semibold text-gray-900">
//               {title}
//             </h2>
//             {subtitle && (
//               <p className="text-sm text-gray-600 mt-1">
//                 {subtitle}
//               </p>
//             )}
//           </div>

//           {/* SEARCH & FILTER */}
//           <div className="flex gap-3 items-center">
//             {/* Search */}
//             {searchableKeys.length > 0 && (
//               <div className="relative">
//                 <Search
//                   size={18}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow w-64"
//                 />
//               </div>
//             )}

//             {/* Filter */}
//             {filterOptions.length > 0 && (
//               <select
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value)}
//                 className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow cursor-pointer"
//               >
//                 <option value="all">All</option>
//                 {filterOptions.map((opt) => (
//                   <option
//                     key={opt.value}
//                     value={opt.value}
//                   >
//                     {opt.label}
//                   </option>
//                 ))}
//               </select>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ---------- TABLE ---------- */}
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead>
//             <tr className="bg-gray-50 border-b border-gray-200">
//               {columns.map((col, i) => (
//                 <th
//                   key={i}
//                   className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
//                 >
//                   {col}
//                 </th>
//               ))}
//               {actions && (
//                 <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                   Actions
//                 </th>
//               )}
//             </tr>
//           </thead>

//           <tbody className="bg-white divide-y divide-gray-200">
//             {paginatedData.length > 0 ? (
//               paginatedData.map((row, index) => (
//                 <tr
//                   key={row._id || index}
//                   className="hover:bg-gray-50 transition-colors"
//                 >
//                   {renderRow(row)}
//                   {actions && (
//                     <td className="px-6 py-4 text-center whitespace-nowrap">
//                       {actions(row)}
//                     </td>
//                   )}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan={
//                     columns.length + (actions ? 1 : 0)
//                   }
//                   className="px-6 py-12 text-center text-gray-500"
//                 >
//                   {emptyState}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ---------- PAGINATION UI ---------- */}
//       {totalPages > 1 && (
//         <div className="flex flex-wrap items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
//           {/* Info */}
//           <p className="text-sm text-gray-600">
//             Showing{" "}
//             <span className="font-medium">
//               {(currentPage - 1) * itemsPerPage + 1}
//             </span>{" "}
//             to{" "}
//             <span className="font-medium">
//               {Math.min(
//                 currentPage * itemsPerPage,
//                 processedData.length
//               )}
//             </span>{" "}
//             of{" "}
//             <span className="font-medium">
//               {processedData.length}
//             </span>{" "}
//             results
//           </p>

//           {/* Controls */}
//           <div className="flex items-center gap-2">
//             {/* Prev */}
//             <button
//               onClick={() =>
//                 setCurrentPage((p) =>
//                   Math.max(p - 1, 1)
//                 )
//               }
//               disabled={currentPage === 1}
//               className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition"
//             >
//               Prev
//             </button>

//             {/* Page Numbers */}
//             {Array.from(
//               { length: totalPages },
//               (_, i) => i + 1
//             ).map((page) => (
//               <button
//                 key={page}
//                 onClick={() =>
//                   setCurrentPage(page)
//                 }
//                 className={`px-3 py-1.5 rounded-lg border text-sm transition ${
//                   page === currentPage
//                     ? "bg-emerald-500 text-white border-emerald-500"
//                     : "hover:bg-white"
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}

//             {/* Next */}
//             <button
//               onClick={() =>
//                 setCurrentPage((p) =>
//                   Math.min(p + 1, totalPages)
//                 )
//               }
//               disabled={
//                 currentPage === totalPages
//               }
//               className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DataTable;


// file: src/admin/components/DataTable.jsx
import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";

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

  // sorting
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc"); // 'asc' | 'desc'

  /* ---------- RESET PAGE ON DATA CHANGE ---------- */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, data, sortKey, sortDir]);

  /* ---------- HELPERS to normalize column spec ---------- */
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

  /* ---------- SEARCH + FILTER + SORT ---------- */
  const processedData = useMemo(() => {
    let result = [...data];

    // 🔍 SEARCH
    if (search && searchableKeys.length > 0) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        searchableKeys.some((key) => {
          const val = key.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), item);
          return String(val || "").toLowerCase().includes(q);
        })
      );
    }

    // 🎯 FILTER (supports arrays like tags)
    if (filter !== "all" && filterKey) {
      result = result.filter((item) => {
        const value = item[filterKey];

        if (Array.isArray(value)) {
          return value.includes(filter);
        }
        return value === filter;
      });
    }

    // 🔽 SORT
    if (sortKey) {
      result.sort((a, b) => {
        const av = sortKey.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), a);
        const bv = sortKey.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), b);

        // handle null/undefined
        if (av == null && bv == null) return 0;
        if (av == null) return sortDir === "asc" ? -1 : 1;
        if (bv == null) return sortDir === "asc" ? 1 : -1;

        // numbers
        if (!isNaN(av) && !isNaN(bv)) {
          return sortDir === "asc" ? av - bv : bv - av;
        }

        // default string compare
        return sortDir === "asc"
          ? String(av).toLowerCase().localeCompare(String(bv).toLowerCase())
          : String(bv).toLowerCase().localeCompare(String(av).toLowerCase());
      });
    }

    return result;
  }, [data, search, filter, searchableKeys, filterKey, sortKey, sortDir]);

  /* ---------- PAGINATION ---------- */
  const totalPages = Math.max(1, Math.ceil(processedData.length / itemsPerPage));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedData.slice(start, start + itemsPerPage);
  }, [processedData, currentPage, itemsPerPage]);

  /* ---------- sort toggle ---------- */
  const onHeaderClick = (col) => {
    if (!col.sortable || !col.key) return;

    if (sortKey === col.key) {
      // toggle direction
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(col.key);
      setSortDir("asc");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* ---------- HEADER ---------- */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex flex-wrap justify-between gap-4 items-start">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
          </div>

          {/* SEARCH & FILTER */}
          <div className="flex gap-3 items-center">
            {searchableKeys.length > 0 && (
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow w-64"
                />
              </div>
            )}

            {filterOptions.length > 0 && (
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
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
              {normalizedColumns.map((col, i) => (
                <th
                  key={i}
                  onClick={() => onHeaderClick(col)}
                  className={`px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                    col.sortable && col.key ? "cursor-pointer select-none" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{col.label}</span>
                    {col.sortable && col.key && (
                      <span className="text-xs text-gray-400">
                        {sortKey === col.key ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
                      </span>
                    )}
                  </div>
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
                <tr key={row._id || index} className="hover:bg-gray-50 transition-colors">
                  {renderRow(row)}
                  {actions && (
                    <td className="px-6 py-4 text-center whitespace-nowrap">{actions(row)}</td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={normalizedColumns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center text-gray-500">
                  {emptyState}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- PAGINATION UI ---------- */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, processedData.length)}</span> of{" "}
            <span className="font-medium">{processedData.length}</span> results
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-lg border text-sm transition ${page === currentPage ? "bg-emerald-500 text-white border-emerald-500" : "hover:bg-white"}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
