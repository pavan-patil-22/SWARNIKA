import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Layers, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Sparkles, 
  PackageCheck, 
  AlertTriangle,
  Download,
  Filter,
  BarChart3,
  PieChart as PieIcon
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { toast } from 'react-toastify';

export default function AdminReports() {
  const { 
    products, 
    allOrders, 
    users, 
    exportProductReport, 
    exportOrderReport, 
    exportUserReport,
    totalRevenue,
    deliveredOrdersCount,
    pendingReturnsCount,
    lowStockProducts
  } = useAdmin();

  // Tab State: 'products' | 'orders' | 'users'
  const [activeTab, setActiveTab] = useState('products');

  // Filters for Product Export
  const [productStockFilter, setProductStockFilter] = useState('ALL');

  // Filters for Order Export
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Filtered lists for live page previews
  const previewProducts = products.filter(p => {
    if (productStockFilter === 'IN_STOCK') return (p.stock || 0) > 5;
    if (productStockFilter === 'LOW_STOCK') return (p.stock || 0) > 0 && (p.stock || 0) <= 5;
    if (productStockFilter === 'OUT_OF_STOCK') return (p.stock || 0) === 0;
    return true;
  });

  const previewOrders = allOrders.filter(o => {
    if (orderStatusFilter !== 'ALL') return (o.orderStatus || 'Confirmed') === orderStatusFilter;
    return true;
  });

  const productStockValue = previewProducts.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);
  const previewOrderRev = previewOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="space-y-8 text-slate-800">
      
      {/* Top Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="font-luxury font-bold text-3xl text-gold-gradient flex items-center gap-2.5">
          <Download className="w-7 h-7 text-gold" /> Admin Export & Business Intelligence Center
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Export full business reports in PDF and Excel formats with embedded product image thumbnails and dashboard analytics charts
        </p>
      </div>

      {/* THREE MAIN TAB SWITCHER BUTTONS */}
      <div className="flex flex-wrap gap-3 border-b border-gray-200 pb-1">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-luxury font-bold text-xs transition-all ${
            activeTab === 'products'
              ? 'bg-slate-900 text-gold border-2 border-gold shadow-gold-glow scale-102'
              : 'bg-white text-slate-600 hover:bg-amber-50 border border-gray-200'
          }`}
        >
          <Layers className="w-4 h-4 text-gold" /> Products & Inventory Export ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-luxury font-bold text-xs transition-all ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-gold border-2 border-gold shadow-gold-glow scale-102'
              : 'bg-white text-slate-600 hover:bg-amber-50 border border-gray-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-gold" /> Orders & Financial Revenue Export ({allOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-luxury font-bold text-xs transition-all ${
            activeTab === 'users'
              ? 'bg-slate-900 text-gold border-2 border-gold shadow-gold-glow scale-102'
              : 'bg-white text-slate-600 hover:bg-amber-50 border border-gray-200'
          }`}
        >
          <Users className="w-4 h-4 text-gold" /> User Accounts & Registry Export ({users.length})
        </button>
      </div>

      {/* SECTION 1: PRODUCTS EXPORT PAGE */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gold/30 shadow-xs">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Filtered Items</span>
              <span className="font-luxury font-bold text-2xl text-slate-900">{previewProducts.length}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gold/30 shadow-xs">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Filtered Stock Value</span>
              <span className="font-luxury font-bold text-xl text-gold-gradient">₹{productStockValue.toLocaleString()}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gold/30 shadow-xs">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Low Stock Alert</span>
              <span className="font-luxury font-bold text-2xl text-amber-600">{lowStockProducts.length}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gold/30 shadow-xs">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Out of Stock</span>
              <span className="font-luxury font-bold text-2xl text-rose-600">{products.filter(p => p.stock === 0).length}</span>
            </div>
          </div>

          {/* Export Action Card */}
          <div className="bg-white p-6 rounded-3xl border border-gold/30 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-luxury font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gold" /> Filter & Download Product Catalogue
                </h3>
                <p className="text-xs text-gray-500">Includes embedded product image thumbnails in PDF exports</p>
              </div>

              {/* Stock Filter Selection */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Filter Stock Status:</span>
                <select
                  value={productStockFilter}
                  onChange={(e) => setProductStockFilter(e.target.value)}
                  className="bg-amber-50/50 border border-gold/40 text-slate-900 font-bold text-xs rounded-xl p-2.5"
                >
                  <option value="ALL">All Products ({products.length})</option>
                  <option value="IN_STOCK">In Stock (&gt; 5)</option>
                  <option value="LOW_STOCK">Low Stock Alert (1 - 5)</option>
                  <option value="OUT_OF_STOCK">Out of Stock (0)</option>
                </select>
              </div>
            </div>

            {/* Download Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => exportProductReport(productStockFilter, 'pdf')}
                className="p-4 bg-slate-900 hover:bg-slate-800 text-gold border border-gold/40 rounded-2xl font-luxury font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-md"
              >
                <FileText className="w-5 h-5 text-gold" /> Export PDF with Embedded Product Images
              </button>

              <button
                onClick={() => exportProductReport(productStockFilter, 'excel')}
                className="p-4 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-300 text-emerald-800 rounded-2xl font-luxury font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-sm"
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> Export Excel (.xlsx) Spreadsheet
              </button>
            </div>
          </div>

          {/* Live Data Preview Table */}
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm p-4 space-y-3">
            <h4 className="font-luxury font-bold text-sm text-slate-900">Live Products Export Preview ({previewProducts.length} items)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-amber-50/60 text-amber-900 font-bold border-b border-gold/30">
                    <th className="p-3">Product Image</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {previewProducts.slice(0, 8).map(p => (
                    <tr key={p.id} className="hover:bg-amber-50/20">
                      <td className="p-3">
                        <img src={p.images?.[0] || p.image} alt="" className="w-10 h-10 object-cover rounded-lg border border-gold/30" />
                      </td>
                      <td className="p-3 font-mono">{p.sku}</td>
                      <td className="p-3 font-bold text-slate-900">{p.name}</td>
                      <td className="p-3">{p.category}</td>
                      <td className="p-3 font-bold text-gold-gradient">₹{p.price}</td>
                      <td className="p-3 font-bold">{p.stock}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.stock === 0 ? 'bg-rose-100 text-rose-700' : (p.stock <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800')
                        }`}>
                          {p.stock === 0 ? 'OUT OF STOCK' : (p.stock <= 5 ? 'LOW STOCK' : 'IN STOCK')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 2: ORDERS EXPORT PAGE WITH DASHBOARD CHARTS */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Dashboard Visual Charts & Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gold/30 shadow-xs">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Total Revenue</span>
              <span className="font-luxury font-bold text-2xl text-gold-gradient">₹{totalRevenue.toLocaleString()}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gold/30 shadow-xs">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Total Orders</span>
              <span className="font-luxury font-bold text-2xl text-slate-900">{allOrders.length}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gold/30 shadow-xs">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Delivered Orders</span>
              <span className="font-luxury font-bold text-2xl text-emerald-600">{deliveredOrdersCount}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gold/30 shadow-xs">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Pending Return Claims</span>
              <span className="font-luxury font-bold text-2xl text-amber-600">{pendingReturnsCount}</span>
            </div>
          </div>

          {/* Admin Dashboard Financial Chart & Distribution Summary Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-3xl border border-gold/30 shadow-sm space-y-3">
              <h4 className="font-luxury font-bold text-sm text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gold" /> Admin Financial Revenue Distribution
              </h4>
              <div className="h-32 bg-amber-50/50 rounded-2xl p-4 border border-gold/20 flex items-end justify-between gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                  const h = [40, 65, 80, 55, 90, 100, 75][idx];
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1">
                      <div style={{ height: `${h}%` }} className="w-full bg-gold-gradient rounded-t-lg transition-all" />
                      <span className="text-[9px] font-bold text-gray-500">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gold/30 shadow-sm space-y-3">
              <h4 className="font-luxury font-bold text-sm text-slate-900 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-gold" /> Order Status Fulfillment Pie Graph
              </h4>
              <div className="space-y-2 text-xs pt-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">Confirmed Orders</span>
                  <span className="font-bold text-gold">{allOrders.filter(o => o.orderStatus === 'Confirmed').length}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-gold h-full" style={{ width: `${(allOrders.filter(o => o.orderStatus === 'Confirmed').length / (allOrders.length || 1)) * 100}%` }} />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-slate-700">Delivered Orders</span>
                  <span className="font-bold text-emerald-600">{deliveredOrdersCount}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${(deliveredOrdersCount / (allOrders.length || 1)) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Export Action Controls */}
          <div className="bg-white p-6 rounded-3xl border border-gold/30 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-luxury font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Download className="w-5 h-5 text-gold" /> Export Complete Order Audit History
                </h3>
                <p className="text-xs text-gray-500">Includes customer details, shipping address, products, pricing, payment, and return claims</p>
              </div>

              {/* Status Filter Selection */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Filter Order Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-amber-50/50 border border-gold/40 text-slate-900 font-bold text-xs rounded-xl p-2.5"
                >
                  <option value="ALL">All Orders ({allOrders.length})</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Download Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => exportOrderReport('pdf', { orderStatusFilter })}
                className="p-4 bg-slate-900 hover:bg-slate-800 text-gold border border-gold/40 rounded-2xl font-luxury font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-md"
              >
                <FileText className="w-5 h-5 text-gold" /> Export Financial PDF Audit Report
              </button>

              <button
                onClick={() => exportOrderReport('excel', { orderStatusFilter })}
                className="p-4 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-300 text-emerald-800 rounded-2xl font-luxury font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-sm"
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> Export Complete Orders Excel (.xlsx)
              </button>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 3: USERS & CUSTOMERS EXPORT PAGE */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-gold/30 shadow-xs">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Total User Accounts</span>
              <span className="font-luxury font-bold text-2xl text-slate-900">{users.length}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gold/30 shadow-xs">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Customer Accounts</span>
              <span className="font-luxury font-bold text-2xl text-gold-gradient">{users.filter(u => u.role !== 'admin').length}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gold/30 shadow-xs">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">System Administrators</span>
              <span className="font-luxury font-bold text-2xl text-amber-900">{users.filter(u => u.role === 'admin').length}</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gold/30 shadow-xs">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Average Orders per User</span>
              <span className="font-luxury font-bold text-2xl text-emerald-600">
                {(allOrders.length / (users.length || 1)).toFixed(1)}
              </span>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="bg-white p-6 rounded-3xl border border-gold/30 shadow-sm space-y-5">
            <h3 className="font-luxury font-bold text-lg text-slate-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Download className="w-5 h-5 text-gold" /> Export Registered User Accounts Registry
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => exportUserReport('pdf')}
                className="p-4 bg-slate-900 hover:bg-slate-800 text-gold border border-gold/40 rounded-2xl font-luxury font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-md"
              >
                <FileText className="w-5 h-5 text-gold" /> Export Users Registry PDF Report
              </button>

              <button
                onClick={() => exportUserReport('excel')}
                className="p-4 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-300 text-emerald-800 rounded-2xl font-luxury font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-sm"
              >
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> Export Users Excel (.xlsx) Spreadsheet
              </button>
            </div>
          </div>

          {/* User Registry Preview Table */}
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm p-4 space-y-3">
            <h4 className="font-luxury font-bold text-sm text-slate-900">User Registry Preview ({users.length} accounts)</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-amber-50/60 text-amber-900 font-bold border-b border-gold/30">
                    <th className="p-3">User ID</th>
                    <th className="p-3">Full Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Total Orders</th>
                    <th className="p-3">Total Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-amber-50/20">
                      <td className="p-3 font-mono">{u.id}</td>
                      <td className="p-3 font-bold text-slate-900">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'admin' ? 'bg-slate-900 text-gold' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {u.role?.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 font-bold">{u.totalOrders || 0}</td>
                      <td className="p-3 font-bold text-gold-gradient">₹{(u.totalSpent || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
