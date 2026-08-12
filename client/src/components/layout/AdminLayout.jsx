import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingBag, 
  Users, 
  Sparkles, 
  RotateCcw, 
  FileSpreadsheet, 
  Settings, 
  Image as ImageIcon, 
  Crown, 
  LogOut, 
  MessageSquare,
  Bell,
  TrendingUp,
  CheckCircle,
  X,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { toast } from 'react-toastify';

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuth();
  const { 
    settings, 
    updateGlobalSettings, 
    lowStockProducts, 
    unreadOrdersCount, 
    pendingReturnsCount, 
    pendingInquiriesCount, 
    allOrders, 
    markAllOrdersAsRead 
  } = useAdmin();

  const location = useLocation();
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Daily Gold Rate Modal State
  const [showGoldRateModal, setShowGoldRateModal] = useState(false);
  const [gold22K, setGold22K] = useState(6850);
  const [gold24K, setGold24K] = useState(7470);
  const [gold18K, setGold18K] = useState(5600);

  const todayStr = new Date().toISOString().split('T')[0];
  const isGoldUpdatedToday = settings?.goldRateLastUpdated === todayStr;

  const [hasInitializedGoldModal, setHasInitializedGoldModal] = useState(false);

  useEffect(() => {
    if (settings && !hasInitializedGoldModal) {
      if (settings.goldRate22K) setGold22K(settings.goldRate22K);
      if (settings.goldRate24K) setGold24K(settings.goldRate24K);
      if (settings.goldRate18K) setGold18K(settings.goldRate18K);

      if (settings.goldRateLastUpdated !== todayStr) {
        setShowGoldRateModal(true);
      }
      setHasInitializedGoldModal(true);
    }
  }, [settings, todayStr, hasInitializedGoldModal]);

  if (!user || !isAdmin) {
    return <Navigate to="/login" state={{ redirect: '/admin' }} replace />;
  }

  const handleUpdateTodayRates = async (e) => {
    e.preventDefault();
    try {
      await updateGlobalSettings({
        goldRate22K: Number(gold22K),
        goldRate24K: Number(gold24K),
        goldRate18K: Number(gold18K),
        goldRateLastUpdated: todayStr
      });
      setShowGoldRateModal(false);
      toast.success("Today's Gold Rates updated successfully!", {
        style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
      });
    } catch (err) {
      toast.error("Failed to update gold rates");
    }
  };

  const handleConfirmSameAsYesterday = async () => {
    try {
      await updateGlobalSettings({
        goldRate22K: Number(gold22K),
        goldRate24K: Number(gold24K),
        goldRate18K: Number(gold18K),
        goldRateLastUpdated: todayStr
      });
      setShowGoldRateModal(false);
      toast.info("Confirmed yesterday's gold rates for today!", {
        style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
      });
    } catch (err) {
      toast.error("Failed to confirm gold rates");
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { 
      label: 'Update Gold Rates', 
      onClick: () => setShowGoldRateModal(true),
      icon: TrendingUp,
      badge: isGoldUpdatedToday ? 'Today ✓' : 'REQ Today',
      badgeColor: isGoldUpdatedToday ? 'bg-emerald-600 text-white font-bold' : 'bg-rose-600 text-white font-extrabold animate-pulse'
    },
    { 
      label: '1-Gram Products', 
      path: '/admin/products', 
      icon: Package,
      badge: lowStockProducts.length > 0 ? `${lowStockProducts.length} Low` : null,
      badgeColor: 'bg-rose-600 text-white font-extrabold'
    },
    { label: 'Real Gold Collection', path: '/admin/real-gold', icon: Crown },
    { label: 'Categories', path: '/admin/categories', icon: Tags },
    { 
      label: 'Orders', 
      path: '/admin/orders', 
      icon: ShoppingBag,
      badge: unreadOrdersCount > 0 ? `${unreadOrdersCount} NEW` : null,
      badgeColor: 'bg-gold text-slate-900 font-extrabold animate-pulse'
    },
    { 
      label: 'Returns Manager', 
      path: '/admin/returns', 
      icon: RotateCcw,
      badge: pendingReturnsCount > 0 ? `${pendingReturnsCount} REQ` : null,
      badgeColor: 'bg-rose-600 text-white font-extrabold animate-bounce'
    },
    { 
      label: 'Contact Inquiries', 
      path: '/admin/contact', 
      icon: MessageSquare,
      badge: pendingInquiriesCount > 0 ? `${pendingInquiriesCount} NEW` : null,
      badgeColor: 'bg-amber-500 text-white font-extrabold'
    },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Dynamic Offers', path: '/admin/offers', icon: Sparkles },
    { label: 'Banners Manager', path: '/admin/banners', icon: ImageIcon },
    { label: 'Export Reports', path: '/admin/reports', icon: FileSpreadsheet },
    { label: 'Store Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-800 flex relative">

      {/* DAILY GOLD RATE MODAL OVERLAY WITH OUTSIDE CLICK CLOSE */}
      {showGoldRateModal && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget && isGoldUpdatedToday) setShowGoldRateModal(false);
          }}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="bg-white border-2 border-gold max-w-lg w-full p-6 sm:p-8 rounded-3xl space-y-6 text-slate-800 shadow-2xl relative animate-fadeIn">
            
            {/* Close button allowed ONLY IF rates are already updated today */}
            {isGoldUpdatedToday && (
              <button 
                onClick={() => setShowGoldRateModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="w-16 h-16 bg-amber-100 rounded-full border-2 border-gold flex items-center justify-center mx-auto text-amber-800 shadow-gold-glow">
              <TrendingUp className="w-8 h-8 text-gold" />
            </div>

            <div className="text-center space-y-2">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-3 py-1 rounded-full border border-gold/40 uppercase tracking-widest inline-block">
                {isGoldUpdatedToday ? 'Update Daily Gold Rates' : 'Mandatory Daily Admin Verification'}
              </span>
              <h2 className="font-luxury font-bold text-2xl text-slate-900">
                Set Today's Gold Prices per Gram
              </h2>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                Rates set here are displayed live to customers on the Real 22K/24K Gold Showcase page.
              </p>
            </div>

            {/* GOLD RATES FORM */}
            <form onSubmit={handleUpdateTodayRates} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-3 gap-3">
                
                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-[11px]">22K (916) Gold (₹/g)</label>
                  <input
                    type="number"
                    required
                    value={gold22K}
                    onChange={(e) => setGold22K(e.target.value)}
                    className="w-full bg-amber-50/50 border border-gold/40 text-slate-900 p-2.5 rounded-xl font-bold font-mono text-center text-sm focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-[11px]">24K Pure Gold (₹/g)</label>
                  <input
                    type="number"
                    required
                    value={gold24K}
                    onChange={(e) => setGold24K(e.target.value)}
                    className="w-full bg-amber-50/50 border border-gold/40 text-slate-900 p-2.5 rounded-xl font-bold font-mono text-center text-sm focus:border-gold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-[11px]">18K Gold (₹/g)</label>
                  <input
                    type="number"
                    required
                    value={gold18K}
                    onChange={(e) => setGold18K(e.target.value)}
                    className="w-full bg-amber-50/50 border border-gold/40 text-slate-900 p-2.5 rounded-xl font-bold font-mono text-center text-sm focus:border-gold"
                  />
                </div>

              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-gold-gradient text-slate-900 font-luxury font-bold text-xs py-3.5 rounded-full shadow-gold-glow hover:scale-102 transition-transform flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Save & Update Today's Gold Rates
                </button>

                <button
                  type="button"
                  onClick={handleConfirmSameAsYesterday}
                  className="w-full bg-slate-900 text-gold font-bold text-xs py-3 rounded-full hover:bg-slate-800 transition-colors border border-gold/40 flex items-center justify-center gap-2"
                >
                  Keep Same Rates as Yesterday
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MOBILE SIDEBAR DRAWER */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex">
          <div className="w-72 bg-white h-full flex flex-col p-4 shadow-2xl border-r border-gold/30 space-y-4 overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <img src="/shoplogo.png" alt="SWARNIKA" className="h-10 w-auto object-contain" />
                <div className="leading-tight">
                  <span className="font-brand-royal font-black text-lg text-gold-royal block uppercase">SWARNIKA</span>
                  <span className="text-[8px] text-amber-900 font-extrabold uppercase tracking-widest">LUXURY HERITAGE</span>
                </div>
              </div>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-2 text-gray-500 hover:text-slate-900">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                if (item.onClick) {
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.onClick();
                        setMobileSidebarOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-gold/30 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-gold" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-gold-gradient text-slate-900 shadow-gold-glow'
                        : 'text-slate-700 hover:bg-amber-50 hover:text-gold'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-gold'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-gray-100 space-y-2">
              {/* <Link
                to="/"
                target="_blank"
                className="flex items-center justify-center gap-2 text-xs font-bold text-slate-900 bg-amber-50 p-2.5 rounded-xl border border-gold/30"
              >
                <Crown className="w-4 h-4 text-gold" /> View Live SWARNIKA Store
              </Link> */}
              
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl"
              >
                <LogOut className="w-4 h-4" /> Admin Logout
              </button>
            </div>

          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gold/30 sticky top-0 h-screen overflow-y-auto shrink-0 z-30 shadow-sm">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <img 
            src="/shoplogo.png" 
            alt="SWARNIKA Logo" 
            className="h-12 w-auto object-contain shrink-0"
            onError={(e) => {
              e.target.onerror = null;
            }}
          />
          <div className="leading-tight">
            <h2 className="font-brand-royal font-black text-slate-900 text-lg tracking-wide uppercase">SWARNIKA</h2>
            <span className="text-[8px] text-amber-900 block font-extrabold uppercase tracking-widest mt-0.5">LUXURY HERITAGE</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            if (item.onClick) {
              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-gold/40 hover:bg-gold hover:text-slate-900 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-gold" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gold-gradient text-slate-900 shadow-gold-glow'
                    : 'text-slate-700 hover:bg-amber-50 hover:text-gold'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-gold'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          {/* <button
            onClick={() => setShowGoldRateModal(true)}
            className="w-full flex items-center gap-2 text-xs font-bold text-amber-900 hover:text-gold transition-colors p-2 rounded-lg bg-amber-50/90 border border-gold/30"
          >
            <TrendingUp className="w-4 h-4 text-gold" /> Update Today's Gold Rates
          </button>

          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-gold transition-colors p-2 rounded-lg bg-gray-50"
          >
            <Crown className="w-4 h-4 text-gold" /> View Live SWARNIKA Store
          </Link> */}

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 text-xs font-bold text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" /> Admin Logout
          </button>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
          
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-700 hover:text-gold rounded-lg border border-gray-200 bg-gray-50"
            >
              <Menu className="w-5 h-5 text-slate-800" />
            </button>

            <h1 className="font-luxury font-bold text-base sm:text-xl text-slate-900 line-clamp-1">
              {navItems.find(i => i.path === location.pathname)?.label || 'SWARNIKA Admin Workspace'}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Quick Gold Rates Header Chip */}
            <button
              onClick={() => setShowGoldRateModal(true)}
              className="hidden md:flex items-center gap-2 text-xs bg-amber-50 hover:bg-gold/20 text-amber-900 px-3 py-1.5 rounded-full border border-gold/40 transition-colors font-bold"
            >
              <TrendingUp className="w-3.5 h-3.5 text-gold" />
              <span>22K: ₹{gold22K}/g</span>
              <span className="text-[10px] bg-slate-900 text-gold px-1.5 py-0.5 rounded font-mono">
                {isGoldUpdatedToday ? 'Updated' : 'Needs Update'}
              </span>
            </button>

            {/* Live Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  markAllOrdersAsRead();
                }}
                className="p-2 text-slate-700 hover:text-gold rounded-full bg-gray-50 border border-gray-200 relative"
              >
                <Bell className="w-5 h-5 text-gold" />
                {(unreadOrdersCount > 0 || pendingReturnsCount > 0 || pendingInquiriesCount > 0) && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center animate-pulse shadow">
                    {unreadOrdersCount + pendingReturnsCount + pendingInquiriesCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Menu */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gold/40 py-3 z-50 text-xs">
                  <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                    <strong className="font-luxury font-bold text-gold">SWARNIKA Alerts</strong>
                    <span className="text-[10px] text-gray-500 font-bold">Live Updates</span>
                  </div>

                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                    {pendingInquiriesCount > 0 && (
                      <Link to="/admin/contact" onClick={() => setNotifDropdownOpen(false)} className="p-3 hover:bg-amber-50/60 block space-y-0.5">
                        <span className="font-bold text-amber-800 flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-gold" /> New Contact Inquiry!
                        </span>
                        <p className="text-gray-500 line-clamp-1">{pendingInquiriesCount} inquiry(s) awaiting reply.</p>
                      </Link>
                    )}

                    {pendingReturnsCount > 0 && (
                      <Link to="/admin/returns" onClick={() => setNotifDropdownOpen(false)} className="p-3 hover:bg-amber-50/60 block space-y-0.5">
                        <span className="font-bold text-rose-600 flex items-center gap-1">
                          <RotateCcw className="w-3.5 h-3.5" /> Return Request Received!
                        </span>
                        <p className="text-gray-500 line-clamp-1">{pendingReturnsCount} return request(s) awaiting Admin approval.</p>
                      </Link>
                    )}

                    {unreadOrdersCount > 0 ? (
                      allOrders.filter(o => o.orderStatus === 'Confirmed').map(order => (
                        <Link key={order.id} to="/admin/orders" onClick={() => setNotifDropdownOpen(false)} className="p-3 hover:bg-amber-50/60 block space-y-0.5">
                          <span className="font-bold text-slate-900 flex items-center gap-1">
                            <ShoppingBag className="w-3.5 h-3.5 text-gold" /> New Order #{order.id}
                          </span>
                          <p className="text-gray-500">Amount: ₹{order.total} • Customer: {order.userName}</p>
                        </Link>
                      ))
                    ) : (
                      pendingReturnsCount === 0 && pendingInquiriesCount === 0 && (
                        <div className="p-4 text-center text-gray-400">No new notifications</div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Chip */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-gold-gradient text-slate-900 font-luxury font-bold text-xs flex items-center justify-center shadow">
                S
              </div>
              <div className="hidden md:block">
                <span className="font-bold text-slate-900 text-xs block leading-tight">{user.name || 'SWARNIKA Admin'}</span>
                <span className="text-[10px] text-gray-500 block leading-tight">Super Administrator</span>
              </div>
            </div>

          </div>

        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
