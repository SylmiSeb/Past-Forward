import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import html2canvas from 'html2canvas';
import {
  Download, ShieldAlert, MailWarning, Activity,
  Fingerprint, Lock, MailCheck, UserCheck, Laptop,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  Shield, Search, Bell, Settings, BarChart3, LayoutDashboard,
  Radar, Bug, Server, ClipboardCheck, LogOut
} from 'lucide-react';

// Donut Chart Component
const DonutChart = ({ data: items }: { data: { label: string; value: number; color: string }[] }) => {
  const total = items.reduce((s, i) => s + i.value, 0);
  let cumulative = 0;
  const size = 140;
  const stroke = 28;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center gap-6">
      <div className="relative shrink-0">
        <svg width={size} height={size} className="-rotate-90">
          {items.map((item, i) => {
            const pct = item.value / total;
            const offset = cumulative * circumference;
            cumulative += pct;
            return (
              <circle key={i} cx={size/2} cy={size/2} r={radius} fill="none"
                stroke={item.color} strokeWidth={stroke}
                strokeDasharray={`${pct * circumference} ${circumference}`}
                strokeDashoffset={-offset} strokeLinecap="round" />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-gray-500">Total</span>
          <span className="text-2xl font-black text-white">{total.toLocaleString()}</span>
        </div>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
            <span className="text-sm text-gray-400">{item.label}</span>
            <span className="text-sm font-bold text-white ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Timeline Chart
const TimelineChart = () => {
  const points = [200, 350, 280, 450, 380, 620, 550, 480, 720, 680, 580, 850];
  const months = ['Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Fev', 'Mar'];
  const max = Math.max(...points);
  const h = 160;
  const w = 100;
  const path = points.map((p, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - (p / max) * (h - 20);
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');
  const areaPath = `${path} L${w},${h} L0,${h} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h + 20}`} preserveAspectRatio="none" className="w-full h-40">
        <defs>
          <linearGradient id="timelineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F0AF00" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#F0AF00" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line key={i} x1="0" y1={i * (h/4)} x2={w} y2={i * (h/4)} stroke="#2a2520" strokeWidth="0.3" />
        ))}
        <path d={areaPath} fill="url(#timelineGrad)" />
        <path d={path} fill="none" stroke="#F0AF00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => {
          const x = (i / (points.length - 1)) * w;
          const y = h - (p / max) * (h - 20);
          return <circle key={i} cx={x} cy={y} r="1.2" fill="#F0AF00" />;
        })}
      </svg>
      <div className="flex justify-between mt-1 px-1">
        {months.map((m, i) => (
          <span key={i} className="text-[9px] text-gray-600">{m}</span>
        ))}
      </div>
    </div>
  );
};

// Score Gauge
const ScoreGauge = ({ value }: { value: string }) => {
  const num = parseInt(value) || 0;
  const angle = (num / 100) * 180;
  const rad = (angle - 180) * (Math.PI / 180);
  const x = 100 + 75 * Math.cos(rad);
  const y = 100 + 75 * Math.sin(rad);
  const large = angle > 180 ? 1 : 0;
  return (
    <svg viewBox="0 0 200 115" className="w-full max-w-[200px]">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#F0AF00" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <path d="M 25 100 A 75 75 0 0 1 175 100" fill="none" stroke="#2a2520" strokeWidth="10" strokeLinecap="round" />
      <path d={`M 25 100 A 75 75 0 ${large} 1 ${x} ${y}`} fill="none" stroke="url(#g)" strokeWidth="10" strokeLinecap="round" />
      <text x="100" y="78" textAnchor="middle" className="fill-gray-500" style={{ fontSize: '10px' }}>Score</text>
      <text x="100" y="102" textAnchor="middle" className="fill-white font-black" style={{ fontSize: '26px' }}>{value}</text>
    </svg>
  );
};

// Sparkline
const Sparkline = ({ color = '#F0AF00', type = 'area' }: { color?: string; type?: string }) => {
  if (type === 'bar') {
    return (
      <div className="flex items-end h-full gap-[2px]">
        {[35, 55, 40, 70, 50, 80, 45, 65, 75, 50].map((h, i) => (
          <div key={i} className="flex-1 rounded-t-sm opacity-70" style={{ height: `${h}%`, background: color }} />
        ))}
      </div>
    );
  }
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
      <defs>
        <linearGradient id={`sp-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0,28 Q12,20 22,24 T44,14 T66,20 T88,8 T100,12" fill="none" stroke={color} strokeWidth="1.8" />
      <path d="M0,28 Q12,20 22,24 T44,14 T66,20 T88,8 T100,12 L100,30 L0,30 Z" fill={`url(#sp-${color.replace('#','')})`} />
    </svg>
  );
};

// Top Metric Card (Orca style)
const TopCard = ({ icon: Icon, label, value, name, onChange, trend, color }: any) => {
  const isUp = trend?.startsWith('+');
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1e1b18]/80 backdrop-blur border border-[#2a2520] rounded-2xl p-5 hover:border-[#3a3530] transition-all group"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</span>
      </div>
      <div className="flex items-end justify-between">
        <input
          type="text" name={name} value={value} onChange={onChange}
          className="bg-transparent text-3xl font-black text-white outline-none focus:text-[#F0AF00] transition-colors w-full"
        />
        {trend && (
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg shrink-0 ${isUp ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
            {trend}
          </span>
        )}
      </div>
      <div className="h-8 mt-3">
        <Sparkline color={color} type={label.includes('Phish') ? 'bar' : 'area'} />
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

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Search, label: 'Discovery' },
    { icon: Shield, label: 'API Security' },
    { icon: Server, label: 'Infrastructure' },
    { icon: Bug, label: 'Vulnerabilites' },
    { icon: Radar, label: 'Attack Paths' },
    { icon: ClipboardCheck, label: 'Compliance' },
  ];

  return (
    <div className="min-h-screen bg-[#141210] text-white font-sans flex">

      {/* Aurora glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none z-0" style={{
        background: 'radial-gradient(ellipse at center top, rgba(240,175,0,0.08) 0%, rgba(121,87,0,0.04) 30%, transparent 60%)',
        filter: 'blur(80px)'
      }} />

      {/* Sidebar (Orca style) */}
      <aside className="w-56 bg-[#1a1714] border-r border-[#2a2520] flex flex-col shrink-0 hidden lg:flex z-20">
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-[#2a2520]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F0AF00] to-[#795700] flex items-center justify-center">
            <Shield size={16} className="text-white" />
          </div>
          <span className="text-base font-black tracking-wider">SPIE<span className="text-[#F0AF00]">BAT</span></span>
        </div>

        {/* Profile */}
        <div className="px-5 py-4 border-b border-[#2a2520] flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F0AF00] to-[#795700] flex items-center justify-center text-xs font-bold">SB</div>
          <div>
            <p className="text-sm font-semibold text-white">Admin Spie</p>
            <p className="text-[10px] text-gray-500">Securite IT</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          {sidebarItems.map(({ icon: NavIcon, label, active }) => (
            <div key={label} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-default ${active ? 'bg-[#F0AF00]/10 text-[#F0AF00]' : 'text-gray-500'}`}>
              <NavIcon size={16} />
              <span>{label}</span>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-[#2a2520]">
          <div className="flex items-center gap-3 px-3 py-2.5 text-gray-500 text-sm cursor-default">
            <Settings size={16} />
            <span>Parametres</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div ref={printRef} className="p-6 lg:p-8 max-w-[1400px] mx-auto bg-[#141210]">

          {/* Top Bar */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-white">Dashboard</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">Periode:</span>
                <input
                  type="text" name="period" value={data.period} onChange={handleChange}
                  className="bg-transparent text-xs font-bold text-[#F0AF00] outline-none w-44"
                />
              </div>
            </div>
            <div data-html2canvas-ignore="true" className="flex items-center gap-3">
              <button onClick={() => handleDownload('png')} className="flex items-center gap-2 bg-[#F0AF00] hover:bg-[#d99e00] text-[#141210] py-2.5 px-5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#F0AF00]/20 active:scale-95">
                <Download size={14} /> PNG
              </button>
              <button onClick={() => handleDownload('jpeg')} className="flex items-center gap-2 bg-[#1e1b18] border border-[#2a2520] hover:border-[#F0AF00] text-gray-400 hover:text-[#F0AF00] py-2.5 px-5 rounded-xl font-bold text-sm transition-all active:scale-95">
                <Download size={14} /> JPEG
              </button>
            </div>
          </motion.div>

          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <TopCard icon={ShieldAlert} label="Menaces Detectees" value={data.totalThreats} name="totalThreats" onChange={handleChange} trend="+0.30%" color="#F0AF00" />
            <TopCard icon={Fingerprint} label="Usurpation Identite" value={data.identityTheft} name="identityTheft" onChange={handleChange} trend="-0.25%" color="#8b5cf6" />
            <TopCard icon={MailWarning} label="Phishing Bloques" value={data.phishing} name="phishing" onChange={handleChange} trend="+0.70%" color="#f97316" />
            <TopCard icon={Lock} label="Ransomware Stoppes" value={data.ransomware} name="ransomware" onChange={handleChange} trend="-0.45%" color="#ef4444" />
          </div>

          {/* Middle Row: Donut + Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            {/* Donut Chart */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-2 bg-[#1e1b18] rounded-2xl border border-[#2a2520] p-6"
            >
              <h3 className="text-base font-bold text-white mb-1">Alertes</h3>
              <p className="text-xs text-gray-500 mb-6">Par Severite</p>
              <DonutChart data={[
                { label: 'Critiques', value: 40, color: '#ef4444' },
                { label: 'En cours', value: 20, color: '#F0AF00' },
                { label: 'Resolues', value: 12, color: '#8b5cf6' },
              ]} />
            </motion.div>

            {/* Timeline Chart */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3 bg-[#1e1b18] rounded-2xl border border-[#2a2520] p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-white">Menaces sur 12 mois</h3>
                  <p className="text-xs text-gray-500">Evolution mensuelle</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F0AF00]" />
                    <span className="text-[10px] text-gray-500">Menaces</span>
                  </div>
                </div>
              </div>
              <TimelineChart />
            </motion.div>
          </div>

          {/* Bottom Row: Table + Score */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Table */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="lg:col-span-3 bg-[#1e1b18] rounded-2xl border border-[#2a2520] p-6"
            >
              <h3 className="text-base font-bold text-white mb-5">Protection & Couverture</h3>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[10px] text-gray-500 uppercase tracking-wider border-b border-[#2a2520]">
                    <th className="pb-3 font-semibold">Indicateur</th>
                    <th className="pb-3 font-semibold">Valeur</th>
                    <th className="pb-3 font-semibold">Score</th>
                    <th className="pb-3 font-semibold">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2a2520]">
                  {[
                    { icon: MailCheck, name: 'emailsReceived', label: 'Emails Analyses', val: data.emailsReceived, score: 92, color: '#10b981' },
                    { icon: UserCheck, name: 'accountsAction', label: 'Comptes Securises', val: data.accountsAction, score: 87, color: '#F0AF00' },
                    { icon: Laptop, name: 'virusDetected', label: 'Postes Proteges', val: data.virusDetected, score: 95, color: '#8b5cf6' },
                    { icon: ShieldAlert, name: 'totalThreats', label: 'Menaces Traitees', val: data.totalThreats, score: 78, color: '#f97316' },
                    { icon: Lock, name: 'ransomware', label: 'Ransomware Bloques', val: data.ransomware, score: 99, color: '#ef4444' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-[#141210] transition-colors">
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${row.color}12` }}>
                            <row.icon size={13} style={{ color: row.color }} />
                          </div>
                          <span className="text-sm font-medium text-white">{row.label}</span>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <input type="text" name={row.name} value={row.val} onChange={handleChange}
                          className="bg-transparent text-sm font-bold text-white outline-none focus:text-[#F0AF00] w-20" />
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-[#2a2520] rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${row.score}%`, background: row.color }} />
                          </div>
                          <span className="text-[11px] font-bold text-gray-500">{row.score}%</span>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                          row.score >= 90 ? 'bg-emerald-500/10 text-emerald-400' :
                          row.score >= 80 ? 'bg-[#F0AF00]/10 text-[#F0AF00]' :
                          'bg-orange-500/10 text-orange-400'
                        }`}>
                          {row.score >= 90 ? 'Excellent' : row.score >= 80 ? 'Bon' : 'A surveiller'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            {/* Risk Score */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#1e1b18] rounded-2xl border border-[#2a2520] p-6 flex flex-col items-center justify-center"
            >
              <h3 className="text-base font-bold text-white mb-2">Risk Score</h3>
              <p className="text-xs text-gray-500 mb-4">Score global de securite</p>
              <ScoreGauge value={data.securityScore} />
              <input
                type="text" name="securityScore" value={data.securityScore} onChange={handleChange}
                className="bg-transparent text-center text-sm font-bold text-gray-400 outline-none focus:text-[#F0AF00] mt-3 w-16"
              />
              <div className="flex justify-between w-full mt-4 px-4">
                <span className="text-[10px] text-gray-600">0</span>
                <span className="text-[10px] text-gray-600">100</span>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-[#2a2520]">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#F0AF00] to-[#795700] flex items-center justify-center">
                <Shield size={12} className="text-white" />
              </div>
              <span className="text-sm font-black tracking-wide">SPIE<span className="text-[#F0AF00]">BATIGNOLLES</span></span>
            </div>
            <p className="text-[10px] text-gray-600 uppercase tracking-widest">Document Confidentiel - Securite IT - {data.period}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
