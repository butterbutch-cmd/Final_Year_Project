import { Plus } from "lucide-react";

const StatCard = ({
  pageTitle = "Dashboard",
  pageSubtitle = "Overview of statistics",
  buttonText = "Add",
  onButtonClick = () => {},
  stats = [],
}) => {
  return (
    <div className="bg-transparent p-0 rounded-2xl pb-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{pageTitle}</h2>
          <p className="text-gray-500 text-sm">{pageSubtitle}</p>
        </div>

        <button
          onClick={onButtonClick}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} />
          {buttonText}
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((item, index) => (
          <div
            key={index}
            className="p-5 bg-white border border-gray-200 rounded-xl flex items-center justify-between"
          >
            <div>
              <p className="text-gray-500 text-sm">{item.title}</p>
              <h3 className="text-3xl font-bold text-gray-900">{item.value}</h3>
              <p className="text-gray-400 text-xs mt-1">{item.subtitle}</p>
            </div>
            <div className={`p-3 rounded-lg ${item.iconBg}`}>
              <item.Icon className={`w-6 h-6 ${item.iconColor}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatCard;
