import { useState } from "react";
import { Search, Inbox } from "lucide-react";

export default function AdminHeader() {
  // Placeholder state for now; will be linked to API later
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy admin data; later replace with actual fetched data
  const adminInfo = {
    name: "Admin User",
    role: "Super Admin",
    avatar: "https://i.pinimg.com/736x/a9/f4/f0/a9f4f0c03220e7dd5d0c60a9add61c42.jpg",
  };

  const handleSearch = () => {
    // For now, just log the query; later replace with API call
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="px-3 py-4 bg-gray-50 border-b border-gray-300 backdrop-blur-2xl">
      <div className="flex justify-between items-center gap-4">
        {/* Logo */}
        <div>
          <div className="font-extrabold text-lg">FLORA VERSE</div>
          <p className="font-light text-sm">Admin Dashboard</p>
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex justify-center px-10">
          <div className="flex items-center w-full max-w-120 bg-white border border-black rounded-full overflow-hidden
                          transition-all duration-300 ease-in-out focus-within:border-[#329e5b]
                          focus-within:ring-3 focus-within:ring-[#329e5b]/10">
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-5 py-3 text-sm placeholder-black outline-none bg-white"
            />

            <button
              onClick={handleSearch}
              className="flex items-center justify-center px-3 py-3 bg-white rounded-full text-gray-600 hover:text-[#329e5b] transition-all duration-300 cursor-pointer"
            >
              <Search size={20} />
            </button>
          </div>
        </div>

        {/* Admin Info */}
        <div className="flex items-center gap-4">
          <Inbox size={25} className="text-gray-700" />

          <div>
            <p className="font-bold">{adminInfo.name}</p>
            <p className="font-light">{adminInfo.role}</p>
          </div>

          <img
            src={adminInfo.avatar}
            alt="Admin Avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
