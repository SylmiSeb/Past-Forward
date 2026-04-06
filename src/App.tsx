import React, { useState, useRef, useMemo } from 'react';
import html2canvas from 'html2canvas';
import {
  Download, ShieldAlert, MailWarning, Fingerprint,
  Lock, MailCheck, UserCheck, Laptop, Shield,
  Activity, TrendingUp, TrendingDown, AlertTriangle
} from 'lucide-react';

// Score Gauge SVG
const ScoreGauge = ({ score }: { score: number }) => {
  const clamped = Math.max(0, Math.min(100, score));
  const angle = (clamped / 100) * 180;
  const rad = (angle - 180) * (Math.PI / 180);
  const x = 120 + 90 * Math.cos(rad);
  const y = 120 + 90 * Math.sin(rad);
  const large = angle > 180 ? 1 : 0;
  const color = clamped >= 80 ? '#10b981' : clamped >= 50 ? '#F0AF00' : '#ef4444';
  const label = clamped >= 80 ? 'Excellent' : clamped >= 50 ? 'Correct' : 'Critique';

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 240 140" className="w-full max-w-[280px]">
        <defs>
          <linearGradient id="gaugeG" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="40%" stopColor="#F0AF00" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <path d="M 30 120 A 90 90 0 0 1 210 120" fill="none" stroke="#2a2520" strokeWidth="14" strokeLinecap="round" />
        <path d={`M 30 120 A 90 90 0 ${large} 1 ${x} ${y}`} fill="none" stroke="url(#gaugeG)" strokeWidth="14" strokeLinecap="round" />
        <text x="120" y="95" textAnchor="middle" fill="#9ca3af" style={{ fontSize: '11px', fontWeight: 600 }}>SCORE</text>
        <text x="120" y="125" textAnchor="middle" fill="white" style={{ fontSize: '36px', fontWeight: 900 }}>{clamped}%</text>
      </svg>
      <span className="text-sm font-bold mt-1" style={{ color }}>{label}</span>
    </div>
  );
};

// Metric Card
const MetricCard = ({ icon: Icon, label, value, name, onChange, color, trend }: any) => (
  <div className="bg-[#1e1b18] rounded-2xl border border-[#2a2520] p-5 hover:border-[#3a3530] transition-all">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <span className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold flex-1">{label}</span>
      {trend && (
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
          trend.startsWith('+') ? 'bg-red-500/15 text-red-400' : 'bg-emerald-500/15 text-emerald-400'
        }`}>
          {trend.startsWith('+') ? <TrendingUp size={10} className="inline mr-1" /> : <TrendingDown size={10} className="inline mr-1" />}
          {trend}
        </span>
      )}
    </div>
    <input
      type="text" name={name} value={value} onChange={onChange}
      className="bg-transparent text-3xl font-black text-white w-full outline-none focus:text-[#F0AF00] transition-colors"
    />
  </div>
);

// Stat mini pill (for the banner)
const StatPill = ({ label, value, name, onChange }: any) => (
  <div className="text-center px-5 py-3 bg-white/10 backdrop-blur-sm rounded-xl">
    <input
      type="text" name={name} value={value} onChange={onChange}
      className="bg-transparent text-2xl font-black text-white outline-none text-center w-20 focus:text-[#F0AF00]"
    />
    <p className="text-[10px] font-bold uppercase tracking-wider mt-1 text-white/60">{label}</p>
  </div>
);

export default function App() {
  const [data, setData] = useState({
    period: "1ER TRIMESTRE 2026",
    totalThreats: "30400",
    identityTheft: "424",
    phishing: "8200",
    ransomware: "9",
    virusDetected: "198",
    emailsReceived: "475",
    accountsAction: "87",
    trendThreats: "+12%",
    trendIdentity: "+8%",
    trendPhishing: "+15%",
    trendRansomware: "+3",
    trendDevices: "-5%",
  });

  const printRef = useRef<HTMLDivElement>(null);

  // Auto-calculate security score
  const securityScore = useMemo(() => {
    const threats = parseInt(data.totalThreats.replace(/\s/g, '')) || 0;
    const phishing = parseInt(data.phishing.replace(/\s/g, '')) || 0;
    const ransomware = parseInt(data.ransomware.replace(/\s/g, '')) || 0;
    const devices = parseInt(data.virusDetected.replace(/\s/g, '')) || 0;
    const accounts = parseInt(data.accountsAction.replace(/\s/g, '')) || 0;
    const emails = parseInt(data.emailsReceived.replace(/\s/g, '')) || 0;

    // Score formula: starts at 100, reduced by threat severity
    let score = 100;
    score -= Math.min(20, (ransomware / 2));           // Ransomware impact (max -20)
    score -= Math.min(15, (threats / 5000));            // Threats impact (max -15)
    score -= Math.min(15, (phishing / 1000));           // Phishing impact (max -15)
    score -= Math.min(10, (parseInt(data.identityTheft) || 0) / 100); // Identity theft (max -10)

    // Bonus for protection coverage
    if (devices > 150) score += 3;
    if (accounts > 50) score += 2;
    if (emails > 300) score += 2;

    return Math.round(Math.max(0, Math.min(100, score)));
  }, [data]);

  const handleDownload = async (format: 'png' | 'jpeg') => {
    if (!printRef.current) return;
    const el = printRef.current;
    const parent = el.parentElement;
    const orig = parent?.style.transform;
    if (parent) parent.style.transform = 'none';
    try {
      const canvas = await html2canvas(el, { scale: 3, useCORS: true, backgroundColor: '#141210', logging: false });
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

      {/* Aurora glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] pointer-events-none z-0" style={{
        background: 'radial-gradient(ellipse at center top, rgba(240,175,0,0.1) 0%, rgba(121,87,0,0.04) 30%, transparent 60%)',
        filter: 'blur(80px)'
      }} />

      {/* Export bar (outside printRef = hidden in export) */}
      <div data-html2canvas-ignore="true" className="sticky top-0 z-50 bg-[#141210]/90 backdrop-blur border-b border-[#2a2520] px-6 py-3 flex items-center justify-between">
        <p className="text-sm text-gray-500">Modifiez les chiffres en cliquant dessus, puis exportez.</p>
        <div className="flex items-center gap-3">
          <button onClick={() => handleDownload('png')}
            className="flex items-center gap-2 bg-[#F0AF00] hover:bg-[#d99e00] text-[#141210] py-2.5 px-6 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#F0AF00]/20 active:scale-95">
            <Download size={15} /> Exporter PNG
          </button>
          <button onClick={() => handleDownload('jpeg')}
            className="flex items-center gap-2 bg-[#1e1b18] border border-[#2a2520] hover:border-[#F0AF00] text-gray-400 hover:text-[#F0AF00] py-2.5 px-6 rounded-xl font-bold text-sm transition-all active:scale-95">
            <Download size={15} /> Exporter JPEG
          </button>
        </div>
      </div>

      {/* === PRINTABLE AREA === */}
      <div ref={printRef} className="relative z-10 max-w-5xl mx-auto px-8 py-10 bg-[#141210]">

        {/* Header */}
        <header className="flex items-start justify-between mb-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F0AF00] to-[#795700] flex items-center justify-center shadow-lg shadow-[#F0AF00]/15">
              <Shield size={28} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-black tracking-wide">SPIE</span>
                <span className="text-2xl font-black text-[#F0AF00] tracking-wide">BATIGNOLLES</span>
              </div>
              <h1 className="text-lg font-bold text-gray-400">Rapport Cybersecurite</h1>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Periode</span>
            <input
              type="text" name="period" value={data.period} onChange={handleChange}
              className="bg-[#1e1b18] border border-[#2a2520] rounded-xl px-4 py-2 text-sm font-bold text-[#F0AF00] outline-none focus:border-[#F0AF00] text-center w-56"
            />
          </div>
        </header>

        {/* Score Banner */}
        <div className="mb-10 bg-gradient-to-r from-[#795700] to-[#F0AF00] rounded-2xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.07]" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }} />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <ScoreGauge score={securityScore} />
            <div className="flex flex-wrap gap-4 justify-center">
              <StatPill label="Postes Proteges" value={data.virusDetected} name="virusDetected" onChange={handleChange} />
              <StatPill label="Comptes Securises" value={data.accountsAction} name="accountsAction" onChange={handleChange} />
              <StatPill label="Emails Analyses" value={data.emailsReceived} name="emailsReceived" onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Section: Menaces */}
        <div className="mb-10">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-5 flex items-center gap-2">
            <AlertTriangle size={14} className="text-[#F0AF00]" />
            Menaces & Incidents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard icon={ShieldAlert} label="Menaces Detectees" value={data.totalThreats} name="totalThreats" onChange={handleChange} color="#F0AF00" trend={data.trendThreats} />
            <MetricCard icon={Fingerprint} label="Usurpation Identite" value={data.identityTheft} name="identityTheft" onChange={handleChange} color="#8b5cf6" trend={data.trendIdentity} />
            <MetricCard icon={MailWarning} label="Phishing Bloques" value={data.phishing} name="phishing" onChange={handleChange} color="#f97316" trend={data.trendPhishing} />
            <MetricCard icon={Lock} label="Ransomware Stoppes" value={data.ransomware} name="ransomware" onChange={handleChange} color="#ef4444" trend={data.trendRansomware} />
          </div>
        </div>

        {/* Section: Protection */}
        <div className="mb-10">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-5 flex items-center gap-2">
            <Shield size={14} className="text-emerald-400" />
            Protection & Couverture
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard icon={MailCheck} label="Emails Analyses" value={data.emailsReceived} name="emailsReceived" onChange={handleChange} color="#10b981" />
            <MetricCard icon={UserCheck} label="Comptes Securises" value={data.accountsAction} name="accountsAction" onChange={handleChange} color="#10b981" />
            <MetricCard icon={Laptop} label="Postes Proteges" value={data.virusDetected} name="virusDetected" onChange={handleChange} color="#10b981" trend={data.trendDevices} />
          </div>
        </div>

        {/* Info box */}
        <div className="bg-[#1e1b18] border border-[#2a2520] rounded-2xl p-6 mb-10">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Activity size={14} className="text-[#F0AF00]" />
            Calcul du Score de Securite
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Le score est calcule automatiquement a partir des donnees saisies. Il commence a 100% et est reduit
            en fonction du nombre de ransomwares ({data.ransomware}), de menaces ({data.totalThreats}), de phishing ({data.phishing})
            et d'usurpations ({data.identityTheft}). Des bonus sont appliques pour la couverture des postes, comptes et emails.
            <span className="text-[#F0AF00] font-bold ml-1">Score actuel : {securityScore}%</span>
          </p>
        </div>

        {/* Footer */}
        <footer className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-[#2a2520]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F0AF00] to-[#795700] flex items-center justify-center">
              <Shield size={14} className="text-white" />
            </div>
            <span className="text-sm font-black tracking-wide">SPIE<span className="text-[#F0AF00]">BATIGNOLLES</span></span>
          </div>
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">Document Confidentiel - Securite IT - {data.period}</p>
        </footer>
      </div>
    </div>
  );
}
