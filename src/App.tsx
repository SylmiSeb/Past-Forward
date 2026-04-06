import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import html2canvas from 'html2canvas';
import {
  Download, UserCog, ShieldAlert, MailWarning,
  Terminal, Settings, Activity,
  Search, Bell, MessageSquare, LayoutDashboard,
  Layers, LogOut, Fingerprint, Lock, MailCheck, UserCheck, Laptop,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Clock,
  ChevronLeft, ChevronRight
} from 'lucide-react';

// Severity config
const severity: Record<string, { bg: string; border: string; icon: string; badge: string; badgeText: string }> = {
  critical: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-500', badge: 'bg-red-100', badgeText: 'text-red-700' },
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-[#F0AF00]', badge: 'bg-amber-100', badgeText: 'text-amber-700' },
  success: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'text-emerald-500', badge: 'bg-emerald-100', badgeText: 'text-emerald-700' },
  neutral: { bg: 'bg-gray-50', border: 'border-gray-200', icon: 'text-[#795700]', badge: 'bg-gray-100', badgeText: 'text-gray-700' },
};

const MetricCard = ({ title, value, name, onChange, icon: Icon, type = 'line', level = 'neutral', trend = '', span = false }: any) => {
  const s = severity[level];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`${s.bg} border ${s.border} rounded-2xl p-6 relative overflow-hidden group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${span ? 'md:col-span-2' : ''}`}
    >
      <div className="flex justify-between items-start mb-1 relative z-10">
        <div>
          <h3 className="text-[#795700] text-[11px] font-bold tracking-widest uppercase">{title}</h3>
          {trend && (
            <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${trend.startsWith('+') ? 'text-red-500' : 'text-emerald-500'}`}>
              {trend.startsWith('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{trend} vs Q4 2025</span>
            </div>
          )}
        </div>
        <div className={`p-2.5 rounded-xl ${s.badge} ${s.icon} shadow-sm`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="relative z-10 mt-3">
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className={`bg-transparent text-4xl font-black text-[#795700] w-full outline-none focus:text-[#F0AF00] transition-colors ${span ? 'text-5xl' : ''}`}
        />
      </div>

      {/* Charts */}
      <div className="mt-4 h-12 relative z-10">
        {type === 'line' && (
          <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={`w-full h-full fill-none ${level === 'critical' ? 'stroke-red-300' : level === 'success' ? 'stroke-emerald-300' : 'stroke-[#F0AF00]'}`} strokeWidth="2">
            <path d="M0,25 Q10,15 20,20 T40,10 T60,22 T80,8 T100,18" />
            <path d={`M0,25 Q10,15 20,20 T40,10 T60,22 T80,8 T100,18 L100,30 L0,30 Z`} className={`${level === 'critical' ? 'fill-red-100' : level === 'success' ? 'fill-emerald-100' : 'fill-amber-100'}`} style={{ opacity: 0.5 }} />
          </svg>
        )}
        {type === 'bar' && (
          <div className="flex items-end h-full gap-1">
            {[40, 70, 45, 90, 65, 85, 30, 60, 50, 75, 55, 80].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-sm transition-all duration-300 group-hover:opacity-100 opacity-70 ${
                  level === 'critical' ? 'bg-red-300' : level === 'success' ? 'bg-emerald-300' : level === 'warning' ? 'bg-amber-300' : 'bg-gray-300'
                }`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        )}
        {type === 'wave' && (
          <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={`w-full h-full ${level === 'critical' ? 'fill-red-200' : level === 'success' ? 'fill-emerald-200' : 'fill-amber-200'}`} style={{ opacity: 0.5 }}>
            <path d="M0,30 C15,10 30,25 50,10 C70,-5 85,20 100,15 L100,30 L0,30 Z" />
          </svg>
        )}
      </div>
    </motion.div>
  );
};

// Alert item
const AlertItem = ({ severity: sev, message, time }: { severity: string; message: string; time: string }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className={`flex items-center gap-4 p-4 rounded-xl border ${
      sev === 'critical' ? 'bg-red-50 border-red-200' : sev === 'warning' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'
    }`}
  >
    {sev === 'critical' ? <AlertTriangle className="text-red-500 shrink-0" size={18} /> :
     sev === 'warning' ? <AlertTriangle className="text-amber-500 shrink-0" size={18} /> :
     <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />}
    <p className="text-sm text-[#795700] font-medium flex-1">{message}</p>
    <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
      <Clock size={12} />
      <span>{time}</span>
    </div>
  </motion.div>
);

export default function App() {
  const [data, setData] = useState({
    period: "1ER TRIMESTRE 2026",
    totalThreats: "30 400",
    identityTheft: "424",
    phishing: "8200",
    ransomware: "9",
    virusDetected: "198",
    emailsReceived: "475",
    accountsAction: "87",
    securityScore: "98%"
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownload = async (format: 'png' | 'jpeg') => {
    if (!printRef.current) return;
    const originalTransform = printRef.current.parentElement?.style.transform;
    if (printRef.current.parentElement) {
      printRef.current.parentElement.style.transform = 'none';
    }
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FFFFFF',
        logging: false
      });
      const image = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.9 : undefined);
      const link = document.createElement("a");
      link.href = image;
      link.download = `cybersecurite-${data.period.replace(/\s+/g, '-').toLowerCase()}.${format}`;
      link.click();
    } finally {
      if (printRef.current.parentElement && originalTransform !== undefined) {
        printRef.current.parentElement.style.transform = originalTransform;
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white flex font-sans text-[#795700]">

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 flex flex-col shrink-0 hidden md:flex z-20 transition-all duration-300 relative`}>
        {/* Collapse button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-24 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:shadow-md transition-shadow z-30"
        >
          {sidebarOpen ? <ChevronLeft size={14} className="text-[#795700]" /> : <ChevronRight size={14} className="text-[#795700]" />}
        </button>

        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <div className="w-9 h-9 bg-gradient-to-br from-[#F0AF00] to-[#795700] rounded-xl flex items-center justify-center shadow-md">
            <Terminal className="text-white" size={18} />
          </div>
          {sidebarOpen && (
            <h1 className="text-lg font-black tracking-wider text-[#795700] ml-3">CYBER<span className="text-[#F0AF00]">DASH</span></h1>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {sidebarOpen && <p className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Menu Principal</p>}

          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#F0AF00]/10 text-[#795700] rounded-xl border-l-4 border-[#F0AF00] font-semibold">
            <LayoutDashboard size={18} className="text-[#F0AF00]" />
            {sidebarOpen && <span className="text-sm">Overview</span>}
          </a>

          {[
            { icon: Bell, label: 'Alertes', badge: 3 },
            { icon: ShieldAlert, label: 'Menaces' },
            { icon: UserCog, label: 'Utilisateurs' },
            { icon: Layers, label: 'Rapports' },
            { icon: Settings, label: 'Parametres' },
          ].map(({ icon: NavIcon, label, badge }) => (
            <a key={label} href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-50 hover:text-[#795700] rounded-xl transition-colors">
              <NavIcon size={18} />
              {sidebarOpen && <span className="font-medium text-sm">{label}</span>}
              {badge && sidebarOpen && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>
              )}
            </a>
          ))}
        </nav>

        {/* Status */}
        {sidebarOpen && (
          <div className="px-4 py-3 mx-3 mb-3 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-emerald-600">Systeme operationnel</span>
            </div>
          </div>
        )}

        <div className="p-3 border-t border-gray-100">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 rounded-xl transition-colors">
            <LogOut size={18} />
            {sidebarOpen && <span className="font-medium text-sm">Deconnexion</span>}
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">

        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-80 hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#795700] focus:outline-none focus:border-[#F0AF00] focus:ring-2 focus:ring-[#F0AF00]/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-xs text-gray-400 font-medium hidden sm:block">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <button className="relative hover:text-[#795700] transition-colors p-2 hover:bg-gray-50 rounded-xl">
                <MessageSquare size={18} />
              </button>
              <button className="relative hover:text-[#795700] transition-colors p-2 hover:bg-gray-50 rounded-xl">
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
              </button>
            </div>

            <div className="h-8 w-px bg-gray-200" />

            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#795700] group-hover:text-[#F0AF00] transition-colors">Admin Spie</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Securite IT</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F0AF00] to-[#795700] flex items-center justify-center shadow-md">
                <UserCog size={18} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50">
          <div ref={printRef} className="p-6 lg:p-8 min-h-full bg-white lg:bg-transparent">

            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-4">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-3xl font-black tracking-wide text-[#795700]">
                  CYBERSECURITY <span className="text-[#F0AF00]">REPORT</span>
                </h2>
                <p className="text-sm text-gray-400 mt-1">Centre de controle - Indicateurs de securite entreprise</p>
              </motion.div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-white border border-gray-200 rounded-xl p-2 flex items-center gap-3 shadow-sm">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-2">Periode:</span>
                  <input
                    type="text"
                    name="period"
                    value={data.period}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold text-[#795700] outline-none focus:border-[#F0AF00] w-48 text-center"
                  />
                </div>

                <div data-html2canvas-ignore="true" className="flex gap-2">
                  <button onClick={() => handleDownload('png')} className="flex items-center gap-2 bg-[#F0AF00] hover:bg-[#d99e00] text-white py-2.5 px-5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg">
                    <Download size={16} /> PNG
                  </button>
                  <button onClick={() => handleDownload('jpeg')} className="flex items-center gap-2 bg-white border-2 border-[#F0AF00] hover:bg-[#F0AF00]/5 text-[#795700] py-2.5 px-5 rounded-xl font-bold transition-all">
                    <Download size={16} /> JPEG
                  </button>
                </div>
              </div>
            </div>

            {/* Main Metrics - Large cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <MetricCard title="Menaces Detectees" value={data.totalThreats} name="totalThreats" onChange={handleChange} icon={ShieldAlert} type="wave" level="critical" trend="+12%" span />
              <MetricCard title="Score de Securite" value={data.securityScore} name="securityScore" onChange={handleChange} icon={Activity} type="line" level="success" trend="-2%" span />
            </div>

            {/* Secondary Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8"
            >
              <MetricCard title="Usurpation d'Identite" value={data.identityTheft} name="identityTheft" onChange={handleChange} icon={Fingerprint} type="line" level="warning" trend="+8%" />
              <MetricCard title="Phishing Bloques" value={data.phishing} name="phishing" onChange={handleChange} icon={MailWarning} type="bar" level="warning" trend="+15%" />
              <MetricCard title="Ransomware Stoppes" value={data.ransomware} name="ransomware" onChange={handleChange} icon={Lock} type="line" level="critical" trend="+3" />
              <MetricCard title="Emails Analyses" value={data.emailsReceived} name="emailsReceived" onChange={handleChange} icon={MailCheck} type="bar" level="neutral" />
              <MetricCard title="Comptes Securises" value={data.accountsAction} name="accountsAction" onChange={handleChange} icon={UserCheck} type="wave" level="success" />
              <MetricCard title="Postes Proteges" value={data.virusDetected} name="virusDetected" onChange={handleChange} icon={Laptop} type="bar" level="success" />
            </motion.div>

            {/* Recent Alerts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h3 className="text-lg font-black text-[#795700] mb-4">ALERTES <span className="text-[#F0AF00]">RECENTES</span></h3>
              <div className="space-y-3">
                <AlertItem severity="critical" message="Tentative de ransomware detectee sur le poste PC-COMPTA-07 - mise en quarantaine automatique" time="il y a 2h" />
                <AlertItem severity="warning" message="Campagne de phishing ciblent le domaine @spiebatignolles.com - 47 emails bloques" time="il y a 5h" />
                <AlertItem severity="success" message="Mise a jour des signatures antivirus deployee sur 198 postes avec succes" time="il y a 8h" />
              </div>
            </motion.div>

            {/* Footer */}
            <div className="pt-6 border-t border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#F0AF00] to-[#795700] rounded-lg flex items-center justify-center">
                  <Terminal className="text-white" size={16} />
                </div>
                <span className="text-lg font-black tracking-wider text-[#795700]">SPIE<span className="text-[#F0AF00]">BATIGNOLLES</span></span>
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-widest">Document Confidentiel - Securite IT</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
