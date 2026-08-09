import React from 'react';
import { useAdmin } from '../../context/AdminContext';

export default function AdminUsers() {
  const { totalUsersCount } = useAdmin();

  const dummyUsersList = [
    { id: 'usr-001', name: 'Valued Customer', email: 'user@gmail.com', role: 'Customer', ordersCount: 3, joined: '2026-06-12' },
    { id: 'usr-2', name: 'Meera Nair', email: 'meera@example.com', role: 'Customer', ordersCount: 2, joined: '2026-07-04' },
    { id: 'usr-3', name: 'Priya Sharma', email: 'priya@example.com', role: 'Customer', ordersCount: 5, joined: '2026-05-19' },
    { id: 'admin-001', name: 'System Administrator', email: 'admin@gmail.com', role: 'Admin', ordersCount: 0, joined: '2026-01-01' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="font-luxury font-bold text-2xl text-gold-gradient">Registered Users</h2>
          <p className="text-xs text-gray-500">View customer accounts and admin permissions</p>
        </div>
        <span className="text-xs bg-amber-50 text-amber-900 px-3 py-1 rounded-full border border-gold/40 font-bold">
          Total Users: {totalUsersCount}
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-amber-50/70 text-amber-900 font-luxury border-b border-gray-200">
              <tr>
                <th className="p-3">User Name</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Role</th>
                <th className="p-3">Total Orders</th>
                <th className="p-3">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dummyUsersList.map(u => (
                <tr key={u.id} className="hover:bg-amber-50/40 transition-colors">
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gold/20 text-slate-900 font-bold flex items-center justify-center text-xs">
                      {u.name.charAt(0)}
                    </div>
                    {u.name}
                  </td>
                  <td className="p-3 text-gray-600 font-mono">{u.email}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      u.role === 'Admin' ? 'bg-gold-gradient text-slate-900' : 'bg-gray-100 text-slate-700 border border-gray-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-gold">{u.ordersCount} orders</td>
                  <td className="p-3 text-gray-500">{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
