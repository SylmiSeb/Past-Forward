import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import html2canvas from 'html2canvas';
import {
  Download, ShieldAlert, MailWarning, Activity,
  Fingerprint, Lock, MailCheck, UserCheck, Laptop,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  Shield, Search, Bell, Settings, Clock, BarChart3
} from 'lucide-react';

// Score Gauge Component
const ScoreGauge = ({ value, name, onChange }: any) => {
  const numVal = parseInt(value) || 0;
  const angle = (numVal / 100) * 180;
  const rad = (angle - 180) * (Math.PI / 180);
  const x = 100 + 80 * Math.cos(rad);
  const y = 100 + 80 * Math.sin(rad);
  const largeArc = angle > 180 ? 1 : 0;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-full max-w-[220px]">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="50%" stopColor="#F0AF00" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        {/* Background arc */}
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#2a2520" strokeWidth="12" strokeLinecap="round" />
        {/* Value arc */}
        <path d={`M 20 100 A 80 80 0 ${largeArc} 1 ${x} ${y}`} fill="none" stroke="url(#gaugeGrad)" strokeWidth="12" strokeLinecap="round" />
        {/* Center text */}
        <text x="100" y="80" textAnchor="middle" className="fill-gray-500 text-[10px] font-semibold">Score</text>
        <text x="100" y="105" textAnchor="middle" className="fill-white text-[28px] font-black">{value}</text>
      </svg>
      <div className="flex justify-between w-full max-w-[200px] -mt-1 px-2">
        <span className="text-xs text-gray-600">0</span>
        <span className="text-xs text-gray-600">100</span>
      </div>
    </div>
  );
};

// Sparkline mini charts
const Sparkline = ({ type = 'line', color = '#F0AF00' }: { type?: string; color?: string }) => {
  if (type === 'bar') {
    return (
      <div className="flex items-end h-full gap-[3px]">
        {[35, 55, 40, 70, 50, 80, 45, 65, 75, 50, 60, 85].map((h, i) => (
          <div key={i} className="flex-1 rounded-t-sm opacity-80" style={{ height: `${h}%`, background: color }} />
        ))}
      </div>
    );
  }
  if (type === 'area') {
    return (
      <svg viewBox="0 0 120 40" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id={`area-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0,35 Q10,28 20,30 T40,20 T60,25 T80,12 T100,18 T120,8" fill="none" stroke={color} strokeWidth="2" />
        <path d="M0,35 Q10,28 20,30 T40,20 T60,25 T80,12 T100,18 T120,8 L120,40 L0,40 Z" fill={`url(#area-${color.replace('#','')})`} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 40" preserveAspectRatio="none" className="w-full h-full">
      <path d="M0,30 Q15,35 25,20 T50,25 T75,10 T100,20 T120,5" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {[{x:0,y:30},{x:25,y:20},{x:50,y:25},{x:75,y:10},{x:100,y:20},{x:120,y:5}].map((p,i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={color} />
      ))}
    </svg>
  );
};

// Metric Card
const MetricCard = ({ title, value, name, onChange, icon: Icon, trend = '', color = '#F0AF00', chartType = 'line' }: any) => {
  const isUp = trend.startsWith('+');
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1e1b18] rounded-2xl border border-[#2a2520] p-5 hover:border-[#3a3530] transition-all duration-300 group"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <input
              type="text"
              name={name}
              value={value}
              onChange={onChange}
              className="bg-transparent text-2xl font-black text-white w-full outline-none focus:text-[#F0AF00] transition-colors"
            />
            {trend && (
              <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${isUp ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {trend}
              </div>
            )}
          </div>
          <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">{title}</p>
        </div>
      </div>
      <div className="h-10">
        <Sparkline type={chartType} color={color} />
      </div>
    </motion.div>
  );
};

export default function App() {
  const [data, setData] = useState({
    period: "1ER TRIMESTRE 2026",
    totalThreats: "30 400",
    identityTheft: "424",
    phishing: "8 200",
    ransomware: "9",
    virusDetected: "198",
    emailsReceived: "475",
    accountsAction: "87",
    securityScore: "98%"
  });

  const printRef = useRef<HTMLDivElement>(null);

  const handleDownload = async (format: 'png' | 'jpeg') => {
    if (!printRef.current) return;
    const el = printRef.current;
    const parent = el.parentElement;
    const orig = parent?.style.transform;
    if (parent) parent.style.transform = 'none';
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#141210', logging: false });
      const image = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.95 : undefined);
      const link = document.createElement("a");
      link.href = image;
      link.download = `rapport-cybersecurite-${data.period.replace(/\s+/g, '-').toLowerCase()}.${format}`;
      link.click();
    } finally {
      if (parent && orig !== undefined) parent.style.transform = orig;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#141210] text-white font-sans">

      {/* Aurora glow effect */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none z-0" style={{
        background: 'radial-gradient(ellipse at center, rgba(240,175,0,0.12) 0%, rgba(121,87,0,0.05) 40%, transparent 70%)',
        filter: 'blur(60px)'
      }} />

      <div ref={printRef} className="relative z-10 max-w-7xl mx-auto px-6 py-6 bg-[#141210]">

        {/* Top Bar */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8"
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F0AF00] to-[#795700] flex items-center justify-center shadow-lg shadow-[#F0AF00]/10">
              <Shield size={20} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-wider">SPIE<span className="text-[#F0AF00]">BATIGNOLLES</span></span>
          </div>

          {/* Center Nav */}
          <div className="bg-[#1e1b18] rounded-full border border-[#2a2520] p-1.5 flex items-center gap-1">
            <button className="px-5 py-2 rounded-full bg-[#F0AF00]/10 text-[#F0AF00] text-sm font-bold flex items-center gap-2">
              <BarChart3 size={14} /> Dashboard
            </button>
            <button className="px-5 py-2 rounded-full text-gray-500 hover:text-gray-300 text-sm font-medium flex items-center gap-2 transition-colors">
              <AlertTriangle size={14} /> Alertes
            </button>
            <button className="px-5 py-2 rounded-full text-gray-500 hover:text-gray-300 text-sm font-medium flex items-center gap-2 transition-colors">
              <ShieldAlert size={14} /> Menaces
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <div data-html2canvas-ignore="true" className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-xl bg-[#1e1b18] border border-[#2a2520] flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                <Search size={16} />
              </button>
              <button className="w-10 h-10 rounded-xl bg-[#1e1b18] border border-[#2a2520] flex items-center justify-center text-gray-500 hover:text-white transition-colors relative">
                <Bell size={16} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-[#1e1b18] border border-[#2a2520] flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                <Settings size={16} />
              </button>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F0AF00] to-[#795700] flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-[#F0AF00]/10">
              SB
            </div>
          </div>
        </motion.header>

        {/* Top Section: Attack Surface + Risk Score */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">

          {/* Metric Cards - 3 cols */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 bg-[#1e1b18] rounded-2xl border border-[#2a2520] p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Menaces Detectees</h2>
              <div className="bg-[#141210] rounded-lg border border-[#2a2520] px-3 py-1.5 flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Periode</span>
                <input
                  type="text"
                  name="period"
                  value={data.period}
                  onChange={handleChange}
                  className="bg-transparent border-none text-sm font-bold text-[#F0AF00] outline-none w-48 text-center"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Individual threat mini cards */}
              {[
                { icon: ShieldAlert, val: data.totalThreats, name: 'totalThreats', label: 'Total Menaces', color: '#F0AF00', chart: 'area', trend: '+12%' },
                { icon: Fingerprint, val: data.identityTheft, name: 'identityTheft', label: 'Usurpation', color: '#8b5cf6', chart: 'line', trend: '+8%' },
                { icon: MailWarning, val: data.phishing, name: 'phishing', label: 'Phishing', color: '#f97316', chart: 'bar', trend: '+15%' },
                { icon: Lock, val: data.ransomware, name: 'ransomware', label: 'Ransomware', color: '#ef4444', chart: 'area', trend: '+3' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="bg-[#141210] rounded-xl p-4 border border-[#2a2520] hover:border-[#3a3530] transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${item.color}18` }}>
                      <item.icon size={14} style={{ color: item.color }} />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        name={item.name}
                        value={item.val}
                        onChange={handleChange}
                        className="bg-transparent text-xl font-black text-white w-full outline-none focus:text-[#F0AF00] transition-colors"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-3">{item.label}</p>
                  <div className="h-8">
                    <Sparkline type={item.chart} color={item.color} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Risk Score Gauge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1e1b18] rounded-2xl border border-[#2a2520] p-6 flex flex-col items-center justify-center"
          >
            <h2 className="text-lg font-bold text-white mb-4">Risk Score</h2>
            <ScoreGauge value={data.securityScore} name="securityScore" onChange={handleChange} />
            <input
              type="text"
              name="securityScore"
              value={data.securityScore}
              onChange={handleChange}
              className="bg-transparent text-center text-sm font-bold text-gray-400 outline-none focus:text-[#F0AF00] mt-2 w-20"
            />
          </motion.div>
        </div>

        {/* Protection Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1e1b18] rounded-2xl border border-[#2a2520] p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Protection & Couverture</h2>
            <div data-html2canvas-ignore="true" className="flex items-center gap-3">
              <div className="bg-[#141210] rounded-lg border border-[#2a2520] px-3 py-2 flex items-center gap-2">
                <Search size={14} className="text-gray-500" />
                <input type="text" placeholder="Search" className="bg-transparent text-sm text-gray-400 outline-none w-32" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[11px] text-gray-500 uppercase tracking-wider border-b border-[#2a2520]">
                  <th className="pb-4 font-semibold">Indicateur</th>
                  <th className="pb-4 font-semibold">Categorie</th>
                  <th className="pb-4 font-semibold">Valeur</th>
                  <th className="pb-4 font-semibold">Score</th>
                  <th className="pb-4 font-semibold">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2520]">
                {[
                  { icon: MailCheck, name: 'emailsReceived', label: 'Emails Analyses', cat: 'Communication', val: data.emailsReceived, score: 92, color: '#10b981' },
                  { icon: UserCheck, name: 'accountsAction', label: 'Comptes Securises', cat: 'Identite', val: data.accountsAction, score: 87, color: '#F0AF00' },
                  { icon: Laptop, name: 'virusDetected', label: 'Postes Proteges', cat: 'Endpoints', val: data.virusDetected, score: 95, color: '#8b5cf6' },
                  { icon: ShieldAlert, name: 'totalThreats', label: 'Menaces Traitees', cat: 'Securite', val: data.totalThreats, score: 78, color: '#f97316' },
                  { icon: Lock, name: 'ransomware', label: 'Ransomware Bloques', cat: 'Malware', val: data.ransomware, score: 99, color: '#ef4444' },
                  { icon: MailWarning, name: 'phishing', label: 'Phishing Interceptes', cat: 'Email Security', val: data.phishing, score: 85, color: '#F0AF00' },
                ].map((row, i) => (
                  <tr key={i} className="group hover:bg-[#141210] transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${row.color}15` }}>
                          <row.icon size={14} style={{ color: row.color }} />
                        </div>
                        <span className="text-sm font-semibold text-white">{row.label}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-gray-500">{row.cat}</span>
                    </td>
                    <td className="py-4">
                      <input
                        type="text"
                        name={row.name}
                        value={row.val}
                        onChange={handleChange}
                        className="bg-transparent text-sm font-bold text-white outline-none focus:text-[#F0AF00] w-24 transition-colors"
                      />
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-[#2a2520] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${row.score}%`, background: `linear-gradient(90deg, ${row.color}80, ${row.color})` }} />
                        </div>
                        <span className="text-xs font-bold text-gray-400">{row.score}%</span>
                      </div>
                    </td>
                    <td className="py-4">
                      {row.score >= 90 ? (
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400">Excellent</span>
                      ) : row.score >= 80 ? (
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F0AF00]/10 text-[#F0AF00]">Bon</span>
                      ) : (
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-500/10 text-orange-400">A surveiller</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Export bar */}
        <motion.div
          data-html2canvas-ignore="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <button
            onClick={() => handleDownload('png')}
            className="flex items-center gap-2 bg-[#F0AF00] hover:bg-[#d99e00] text-[#141210] py-3 px-8 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#F0AF00]/20 hover:shadow-[#F0AF00]/30 active:scale-95"
          >
            <Download size={16} /> Exporter en PNG
          </button>
          <button
            onClick={() => handleDownload('jpeg')}
            className="flex items-center gap-2 bg-[#1e1b18] border border-[#2a2520] hover:border-[#F0AF00] text-gray-400 hover:text-[#F0AF00] py-3 px-8 rounded-xl font-bold text-sm transition-all active:scale-95"
          >
            <Download size={16} /> Exporter en JPEG
          </button>
        </motion.div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-[#2a2520]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F0AF00] to-[#795700] flex items-center justify-center">
              <Shield size={14} className="text-white" />
            </div>
            <span className="font-black text-white tracking-wide">SPIE<span className="text-[#F0AF00]">BATIGNOLLES</span></span>
          </div>
          <p className="text-[11px] text-gray-600 uppercase tracking-widest">Document Confidentiel - Securite IT - {data.period}</p>
        </div>
      </div>
    </div>
  );
}
