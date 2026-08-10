import React, { useState, useEffect } from 'react';
import { Crown, TrendingUp, ShieldCheck } from 'lucide-react';
import { settingService } from '../../services/api';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export default function GuestGoldRateChart({ settings }) {
  const [goldHistory, setGoldHistory] = useState([]);

  useEffect(() => {
    const fetchGoldHistory = async () => {
      try {
        const hist = await settingService.getGoldHistory();
        setGoldHistory(hist);
      } catch (err) {
        console.error("Error fetching gold rate history for guest chart:", err);
      }
    };
    fetchGoldHistory();
  }, []);

  const rate22K = settings?.goldRate22K || 6850;
  const rate24K = settings?.goldRate24K || 7470;
  const rate18K = settings?.goldRate18K || 5600;
  const lastUpdated = settings?.goldRateLastUpdated || new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-3xl border-2 border-gold/40 shadow-lg p-6 sm:p-8 space-y-6 text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div>
          <span className="text-[11px] text-amber-800 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Crown className="w-4 h-4 text-gold" /> Official Showroom Market Rates
          </span>
          <h3 className="font-luxury font-bold text-2xl text-slate-900 mt-1">
            Real 22K & 24K Gold Price History (30-Day Trend)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Live gold bullion rates per gram updated daily at SWARNIKA Honnali Showroom
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="bg-amber-50 border border-gold/40 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[10px] text-amber-800 font-bold uppercase block">22K Hallmarked</span>
            <strong className="font-luxury font-bold text-base text-gold-gradient">₹{rate22K} /g</strong>
          </div>

          <div className="bg-amber-50 border border-gold/40 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[10px] text-amber-800 font-bold uppercase block">24K Pure Gold</span>
            <strong className="font-luxury font-bold text-base text-amber-900">₹{rate24K} /g</strong>
          </div>

          <div className="bg-slate-900 text-gold border border-gold/40 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Last Updated</span>
            <span className="font-mono text-xs font-bold">{lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-72 w-full pt-2">
        {goldHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={goldHistory}>
              <defs>
                <linearGradient id="guestGold22kGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="guestGold24kGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#92400E" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#92400E" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#888" fontSize={11} />
              <YAxis stroke="#888" fontSize={11} domain={['dataMin - 100', 'dataMax + 100']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111', borderRadius: '12px', border: '1px solid #D4AF37', color: '#FFF' }}
                formatter={(val, name) => [`₹${val} /g`, name === 'rate22K' ? '22K (916) Gold' : '24K Pure Gold']}
              />
              <Legend />
              <Area type="monotone" dataKey="rate22K" name="22K (916) Gold" stroke="#D4AF37" fillOpacity={1} fill="url(#guestGold22kGrad)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="rate24K" name="24K Pure Gold" stroke="#92400E" fillOpacity={1} fill="url(#guestGold24kGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-gray-400 font-bold bg-amber-50/50 rounded-2xl border border-gold/20">
            Gold rate history chart will update as showroom rates are recorded daily.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-100">
        <span className="flex items-center gap-1 font-bold text-amber-900">
          <ShieldCheck className="w-3.5 h-3.5 text-gold" /> Certified BIS 916 Hallmark Standard
        </span>
        <span>Honnali Showroom Real Gold Pricing</span>
      </div>

    </div>
  );
}
