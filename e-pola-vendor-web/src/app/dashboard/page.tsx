"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Plus, 
  ShoppingCart, 
  TrendingUp, 
  Clock, 
  ChevronRight,
  MoreVertical
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

// Mock chart data
const data = [
  { name: "Mon", sales: 4000 },
  { name: "Tue", sales: 3000 },
  { name: "Wed", sales: 5000 },
  { name: "Thu", sales: 2780 },
  { name: "Fri", sales: 8900 },
  { name: "Sat", sales: 12390 },
  { name: "Sun", sales: 14490 },
];

export default function DashboardHome() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("vendorToken");
      if (!token) return;

      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch("/api/v1/orders/vendor", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/v1/products/vendor", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (ordersRes.ok && productsRes.ok) {
          const ordersData = await ordersRes.json();
          const productsData = await productsRes.json();
          setOrders(ordersData);
          setProducts(productsData);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalSales = orders.filter(o => o.fulfillmentStatus === 'delivered' || o.fulfillmentStatus === 'completed').reduce((sum, o) => sum + o.totalValue, 0);
  const pendingOrders = orders.filter(o => o.fulfillmentStatus === 'pending');

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'confirmed': 
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery':
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] pb-12 font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* 1. Welcome Header Section */}
        <div className="relative overflow-hidden rounded-2xl p-8 sm:p-10 shadow-sm" style={{ background: 'linear-gradient(135deg, #0F6F3E 0%, #118A4A 50%, #22C55E 100%)' }}>
          {/* Decorative background elements (glassmorphism/illustrations) */}
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute right-20 -bottom-20 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Good Morning, Vendor 👋</h1>
              <p className="mt-2 text-green-50 text-lg max-w-xl">Manage products, track orders, and grow your grocery business.</p>
            </div>
            <div className="mt-6 sm:mt-0 flex items-center bg-white/20 backdrop-blur-md rounded-full py-2 px-4 border border-white/20 shadow-inner">
              <Clock className="w-5 h-5 text-white mr-2" />
              <span className="text-white font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* 2. Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Sales Card */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform duration-300 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Sales</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">Rs. {totalSales.toLocaleString()}</h3>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 text-[#0F6F3E]">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-semibold flex items-center bg-green-50 px-2 py-1 rounded-md">
                <TrendingUp className="w-4 h-4 mr-1" /> +12.5%
              </span>
              <span className="text-gray-400 ml-2">from last month</span>
            </div>
          </div>

          {/* Total Orders Card */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform duration-300 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{orders.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-semibold flex items-center bg-green-50 px-2 py-1 rounded-md">
                <TrendingUp className="w-4 h-4 mr-1" /> +8.2%
              </span>
              <span className="text-gray-400 ml-2">from last month</span>
            </div>
          </div>

          {/* Total Products Card */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform duration-300 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{products.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 text-purple-600">
                <Package className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-semibold flex items-center bg-green-50 px-2 py-1 rounded-md">
                <TrendingUp className="w-4 h-4 mr-1" /> +5.4%
              </span>
              <span className="text-gray-400 ml-2">from last month</span>
            </div>
          </div>
        </div>

        {/* 3. Quick Actions Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/add-product" className="group flex flex-col justify-center items-center p-6 bg-gradient-to-br from-[#118A4A] to-[#0F6F3E] rounded-2xl shadow-sm hover:shadow-md transition-all text-white text-center h-32">
            <Plus className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-sm">Add New Product</span>
          </Link>
          
          <Link href="/dashboard/orders" className="relative group flex flex-col justify-center items-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-center h-32">
            {pendingOrders.length > 0 && (
              <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm animate-pulse">
                {pendingOrders.length} New
              </span>
            )}
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2 group-hover:bg-[#E8F5EE] transition-colors">
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-[#0F6F3E]" />
            </div>
            <span className="font-semibold text-sm text-gray-900">View Pending Orders</span>
          </Link>

          <Link href="/dashboard/products" className="group flex flex-col justify-center items-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-center h-32">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2 group-hover:bg-[#E8F5EE] transition-colors">
              <Package className="w-6 h-6 text-gray-700 group-hover:text-[#0F6F3E]" />
            </div>
            <span className="font-semibold text-sm text-gray-900">Manage Inventory</span>
          </Link>

          <button className="group flex flex-col justify-center items-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-center h-32 opacity-70 cursor-not-allowed">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-gray-400" />
            </div>
            <span className="font-semibold text-sm text-gray-400">Sales Analytics (Soon)</span>
          </button>
        </div>

        {/* Main Content Layout (Table + Chart) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 4. Recent Orders Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <Link href="/dashboard/orders" className="text-sm font-medium text-[#118A4A] hover:text-[#0F6F3E] flex items-center bg-[#E8F5EE] px-3 py-1.5 rounded-full transition-colors">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">Loading orders...</td></tr>
                  ) : orders.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400">No recent orders found.</td></tr>
                  ) : (
                    orders.slice(0, 5).map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">#{order._id.slice(-6)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.userId?.name || 'Customer'}</div>
                          <div className="text-xs text-gray-500">{order.items.length} items</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Rs. {order.totalValue}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium capitalize border ${getStatusBadge(order.fulfillmentStatus).replace('bg-', 'bg-opacity-20 border-')}`}>
                            {order.fulfillmentStatus.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-gray-400 hover:text-gray-900 p-1 rounded-md hover:bg-gray-100 transition-colors">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 5. Performance Analytics Widget */}
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Weekly Revenue</h2>
              <p className="text-sm text-gray-500 mt-1">Your sales over the last 7 days</p>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-center bg-gradient-to-b from-transparent to-gray-50/30">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      cursor={{ stroke: '#118A4A', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Line type="monotone" dataKey="sales" stroke="#118A4A" strokeWidth={3} dot={{ r: 4, fill: '#118A4A', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#0F6F3E', stroke: '#fff', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
