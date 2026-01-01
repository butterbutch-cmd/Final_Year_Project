// const AdminHome = () => {
//   return (
//     <div>
//       <h3>Welcome to Admin Dashboard</h3>
//       <p>Use the sidebar to manage products.</p>
//     </div>
//   );
// };

// export default AdminHome;

import { Leaf, ShoppingCart, Users, TrendingUp, Package, DollarSign } from 'lucide-react';

const AdminHome = () => {
  const stats = [
    { icon: ShoppingCart, label: 'Total Orders', value: '1,234', change: '+12%', color: 'bg-emerald-500' },
    { icon: DollarSign, label: 'Revenue', value: '$45,678', change: '+8%', color: 'bg-blue-500' },
    { icon: Package, label: 'Products', value: '156', change: '+3', color: 'bg-purple-500' },
    { icon: Users, label: 'Customers', value: '892', change: '+23%', color: 'bg-orange-500' },
  ];

  const recentActivity = [
    { action: 'New order placed', item: 'Monstera Deliciosa', time: '5 min ago' },
    { action: 'Product added', item: 'Snake Plant', time: '23 min ago' },
    { action: 'Stock updated', item: 'Pothos Golden', time: '1 hour ago' },
    { action: 'Customer registered', item: 'john@example.com', time: '2 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Leaf className="w-8 h-8 text-emerald-600" />
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back, Admin</h1>
          </div>
          <p className="text-gray-600">Here's what's happening with your plant store today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Package className="w-5 h-5" />
                Add New Product
              </button>
              <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors border border-gray-300 flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                View Orders
              </button>
              <button className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors border border-gray-300 flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Analytics
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{activity.action}</p>
                    <p className="text-gray-600 text-sm">{activity.item}</p>
                  </div>
                  <span className="text-gray-500 text-sm whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">Use the sidebar to manage your store</h3>
              <p className="text-emerald-100">Navigate through products, orders, customers, and more to keep your plant business thriving.</p>
            </div>
            <Leaf className="w-16 h-16 opacity-20" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;