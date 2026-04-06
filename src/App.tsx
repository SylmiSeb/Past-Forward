import React, { useState, useRef, useMemo } from 'react';
import html2canvas from 'html2canvas';
import {
  Download, ShieldAlert, MailWarning, Fingerprint,
  Lock, MailCheck, UserCheck, Laptop, Shield,
  Activity, TrendingUp, TrendingDown, AlertTriangle,
  Info, CircleAlert
} from 'lucide-react';

// Score Gauge
const ScoreGauge = ({ score }: { score: number }) => {
  const c = Math.max(0, Math.min(100, score));
  const a = (c / 100) * 180;
  const r = (a - 180) * (Math.PI / 180);
  const x = 120 + 85 * Math.cos(r);
  const y = 120 + 85 * Math.sin(r);
  const l = a > 180 ? 1 : 0;
  const col = c >= 80 ? '#06b6d4' : c >= 50 ? '#F0AF00' : '#ef4444';
  const lab = c >= 80 ? 'Excellent' : c >= 50 ? 'Correct' : 'Critique';
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 240 135" className="w-full max-w-[260px]">
        <defs>
          <linearGradient id="gg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="40%" stopColor="#F0AF00" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <path d="M 35 120 A 85 85 0 0 1 205 120" fill="none" stroke="#1f1f23" strokeWidth="12" strokeLinecap="round" />
        <path d={`M 35 120 A 85 85 0 ${l} 1 ${x} ${y}`} fill="none" stroke="url(#gg)" strokeWidth="12" strokeLinecap="round" />
        <text x="120" y="90" textAnchor="middle" fill="#71717a" style={{ fontSize: '10px', fontWeight: 600 }}>SCORE GLOBAL</text>
        <text x="120" y="122" textAnchor="middle" fill="white" style={{ fontSize: '34px', fontWeight: 900 }}>{c}%</text>
      </svg>
      <span className="text-xs font-bold mt-1 px-3 py-1 rounded-full" style={{ color: col, background: `${col}15` }}>{lab}</span>
    </div>
  );
};

// Sparkline Area
const Spark = ({ color = '#F0AF00' }: { color?: string }) => (
  <svg viewBox="0 0 100 28" preserveAspectRatio="none" className="w-full h-full">
    <defs>
      <linearGradient id={`s${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d="M0,26 Q12,18 22,22 T44,12 T66,18 T88,6 T100,10" fill="none" stroke={color} strokeWidth="1.8" />
    <path d="M0,26 Q12,18 22,22 T44,12 T66,18 T88,6 T100,10 L100,28 L0,28 Z" fill={`url(#s${color.slice(1)})`} />
  </svg>
);

// Bar chart mini
const Bars = ({ color = '#f97316' }: { color?: string }) => (
  <div className="flex items-end h-full gap-[2px]">
    {[35, 55, 40, 70, 50, 80, 45, 65, 75, 50].map((h, i) => (
      <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: color, opacity: 0.7 }} />
    ))}
  </div>
);

// Tooltip / description
const Desc = ({ text }: { text: string }) => (
  <p className="text-[10px] text-[#52525b] leading-relaxed mt-2">{text}</p>
);

export default function App() {
  const [d, setD] = useState({
    period: "1ER TRIMESTRE 2026",
    totalThreats: "30400", identityTheft: "424", phishing: "8200", ransomware: "9",
    virusDetected: "198", emailsReceived: "475", accountsAction: "87",
    trendThreats: "+12%", trendIdentity: "+8%", trendPhishing: "+15%",
    trendRansomware: "+3", trendDevices: "-5%",
  });
  const ref = useRef<HTMLDivElement>(null);

  const score = useMemo(() => {
    const t = parseInt(d.totalThreats.replace(/\s/g, '')) || 0;
    const p = parseInt(d.phishing.replace(/\s/g, '')) || 0;
    const r = parseInt(d.ransomware) || 0;
    const id = parseInt(d.identityTheft) || 0;
    const dv = parseInt(d.virusDetected) || 0;
    const ac = parseInt(d.accountsAction) || 0;
    const em = parseInt(d.emailsReceived) || 0;
    let s = 100;
    s -= Math.min(20, r / 2);
    s -= Math.min(15, t / 5000);
    s -= Math.min(15, p / 1000);
    s -= Math.min(10, id / 100);
    if (dv > 150) s += 3;
    if (ac > 50) s += 2;
    if (em > 300) s += 2;
    return Math.round(Math.max(0, Math.min(100, s)));
  }, [d]);

  const exp = async (fmt: 'png' | 'jpeg') => {
    if (!ref.current) return;
    try {
      const canvas = await html2canvas(ref.current, {
        scale: 3, useCORS: true, backgroundColor: '#09090b', logging: false,
        removeContainer: true,
      });
      const img = canvas.toDataURL(`image/${fmt}`, fmt === 'jpeg' ? 0.95 : undefined);
      const a = document.createElement('a');
      a.href = img;
      a.download = `cybersecurite-${d.period.replace(/\s+/g, '-').toLowerCase()}.${fmt}`;
      a.click();
    } catch (e) { console.error('Export error:', e); }
  };

  const ch = (e: React.ChangeEvent<HTMLInputElement>) => setD({ ...d, [e.target.name]: e.target.value });

  const TrendBadge = ({ name, value }: { name: string; value: string }) => {
    const up = value.startsWith('+');
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${up ? 'bg-[#ef4444]/10 text-[#f87171]' : 'bg-[#06b6d4]/10 text-[#22d3ee]'}`}>
        {up ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
        <input type="text" name={name} value={value} onChange={ch}
          className="bg-transparent outline-none w-10 text-inherit font-inherit" />
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Export bar - NOT in print area */}
      <div className="sticky top-0 z-50 bg-[#09090b] border-b border-[#1f1f23] px-6 py-3 flex items-center justify-between"
        data-html2canvas-ignore="true">
        <div className="flex items-center gap-3">
          <Info size={14} className="text-[#F0AF00]" />
          <span className="text-xs text-[#52525b]">Cliquez sur les chiffres pour les modifier, puis exportez.</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exp('png')}
            className="flex items-center gap-2 bg-[#F0AF00] text-black py-2 px-5 rounded-lg font-bold text-xs hover:bg-[#d99e00] active:scale-95 transition-all">
            <Download size={13} /> PNG
          </button>
          <button onClick={() => exp('jpeg')}
            className="flex items-center gap-2 bg-[#111113] border border-[#1f1f23] text-[#71717a] py-2 px-5 rounded-lg font-bold text-xs hover:border-[#F0AF00] hover:text-[#F0AF00] active:scale-95 transition-all">
            <Download size={13} /> JPEG
          </button>
        </div>
      </div>

      {/* ===== PRINTABLE AREA ===== */}
      <div ref={ref} className="max-w-5xl mx-auto px-8 py-10 bg-[#09090b]">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F0AF00] to-[#795700] flex items-center justify-center"
              style={{ boxShadow: '0 0 30px rgba(240,175,0,0.15)' }}>
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-wider">SPIE</span>
                <span className="text-xl font-black text-[#F0AF00] tracking-wider">BATIGNOLLES</span>
              </div>
              <p className="text-sm text-[#52525b] font-medium">Rapport Cybersecurite</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-[#52525b] uppercase tracking-widest block mb-1.5">Periode</span>
            <input type="text" name="period" value={d.period} onChange={ch}
              className="bg-[#111113] border border-[#1f1f23] rounded-lg px-4 py-2 text-xs font-bold text-[#F0AF00] outline-none text-center w-52 focus:border-[#F0AF00]/50" />
          </div>
        </div>

        {/* Score Banner */}
        <div className="mb-8 rounded-2xl p-7 bg-[#111113] border border-[#F0AF00]/10"
          style={{ boxShadow: '0 0 60px rgba(240,175,0,0.04)' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <ScoreGauge score={score} />
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { icon: Laptop, name: 'virusDetected', val: d.virusDetected, label: 'Postes Proteges', desc: 'Ordinateurs avec antivirus actif' },
                { icon: UserCheck, name: 'accountsAction', val: d.accountsAction, label: 'Comptes Securises', desc: 'Comptes avec MFA active' },
                { icon: MailCheck, name: 'emailsReceived', val: d.emailsReceived, label: 'Emails Analyses', desc: 'Emails scannes par le filtre' },
              ].map((s, i) => (
                <div key={i} className="text-center px-5 py-4 bg-[#09090b] rounded-xl border border-[#1f1f23] min-w-[130px]">
                  <s.icon size={14} className="text-[#06b6d4] mx-auto mb-2" />
                  <input type="text" name={s.name} value={s.val} onChange={ch}
                    className="bg-transparent text-2xl font-black text-white outline-none text-center w-16 focus:text-[#F0AF00]" />
                  <p className="text-[9px] font-bold uppercase tracking-wider mt-1 text-[#52525b]">{s.label}</p>
                  <p className="text-[8px] text-[#3f3f46] mt-0.5">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section: Menaces - BENTO GRID */}
        <div className="mb-3">
          <h2 className="text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <AlertTriangle size={12} className="text-[#F0AF00]" />
            Menaces & Incidents
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Grande carte - Menaces Detectees */}
          <div className="md:col-span-2 bg-[#111113] rounded-2xl border border-[#1f1f23] p-6 hover:border-[#F0AF00]/20 transition-all">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#F0AF00]/10 flex items-center justify-center">
                  <ShieldAlert size={15} className="text-[#F0AF00]" />
                </div>
                <span className="text-[10px] text-[#52525b] uppercase tracking-wider font-bold">Menaces Detectees</span>
              </div>
              <TrendBadge name="trendThreats" value={d.trendThreats} />
            </div>
            <input type="text" name="totalThreats" value={d.totalThreats} onChange={ch}
              className="bg-transparent text-5xl font-black text-white outline-none focus:text-[#F0AF00] w-full mt-2" />
            <Desc text="Nombre total de menaces informatiques detectees par nos systemes de surveillance (malwares, intrusions, scans de ports, tentatives d'acces non autorises)." />
            <div className="h-10 mt-3"><Spark color="#F0AF00" /></div>
          </div>

          {/* Ransomware - carte accent */}
          <div className="bg-[#111113] rounded-2xl border border-[#ef4444]/15 p-6 hover:border-[#ef4444]/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ef4444]/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center justify-between mb-1 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#ef4444]/10 flex items-center justify-center">
                  <Lock size={15} className="text-[#ef4444]" />
                </div>
                <span className="text-[10px] text-[#52525b] uppercase tracking-wider font-bold">Ransomware</span>
              </div>
              <TrendBadge name="trendRansomware" value={d.trendRansomware} />
            </div>
            <input type="text" name="ransomware" value={d.ransomware} onChange={ch}
              className="bg-transparent text-5xl font-black text-white outline-none focus:text-[#ef4444] w-full mt-2 relative z-10" />
            <Desc text="Logiciels malveillants qui chiffrent vos fichiers et exigent une rancon. Chaque tentative bloquee evite une paralysie potentielle du SI." />
            {parseInt(d.ransomware) > 5 && (
              <div className="flex items-center gap-1.5 mt-3 text-[10px] font-bold text-[#ef4444] bg-[#ef4444]/10 rounded-lg px-3 py-1.5 w-fit relative z-10">
                <CircleAlert size={11} /> VIGILANCE RENFORCEE
              </div>
            )}
          </div>

          {/* Usurpation */}
          <div className="bg-[#111113] rounded-2xl border border-[#1f1f23] p-6 hover:border-[#8b5cf6]/20 transition-all">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
                  <Fingerprint size={15} className="text-[#8b5cf6]" />
                </div>
                <span className="text-[10px] text-[#52525b] uppercase tracking-wider font-bold">Usurpation Identite</span>
              </div>
              <TrendBadge name="trendIdentity" value={d.trendIdentity} />
            </div>
            <input type="text" name="identityTheft" value={d.identityTheft} onChange={ch}
              className="bg-transparent text-3xl font-black text-white outline-none focus:text-[#8b5cf6] w-full mt-2" />
            <Desc text="Tentatives d'usurper l'identite d'un collaborateur pour acceder a des ressources sensibles (vol de login, faux emails de direction)." />
            <div className="h-8 mt-2"><Spark color="#8b5cf6" /></div>
          </div>

          {/* Phishing */}
          <div className="md:col-span-2 bg-[#111113] rounded-2xl border border-[#1f1f23] p-6 hover:border-[#f97316]/20 transition-all">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#f97316]/10 flex items-center justify-center">
                  <MailWarning size={15} className="text-[#f97316]" />
                </div>
                <span className="text-[10px] text-[#52525b] uppercase tracking-wider font-bold">Phishing Bloques</span>
              </div>
              <TrendBadge name="trendPhishing" value={d.trendPhishing} />
            </div>
            <div className="flex items-end gap-6">
              <div className="flex-1">
                <input type="text" name="phishing" value={d.phishing} onChange={ch}
                  className="bg-transparent text-3xl font-black text-white outline-none focus:text-[#f97316] w-full mt-2" />
                <Desc text="Emails frauduleux imitant des organismes de confiance pour voler des identifiants ou installer des logiciels malveillants. Chaque email bloque protege un collaborateur." />
              </div>
              <div className="h-16 w-40 shrink-0"><Bars color="#f97316" /></div>
            </div>
          </div>
        </div>

        {/* Section: Protection */}
        <div className="mb-3">
          <h2 className="text-[10px] font-bold text-[#52525b] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
            <Shield size={12} className="text-[#06b6d4]" />
            Protection & Couverture
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: MailCheck, name: 'emailsReceived', val: d.emailsReceived, label: 'Emails Analyses', color: '#06b6d4',
              desc: "Nombre d'emails passes par notre filtre anti-spam et anti-phishing avant livraison aux collaborateurs." },
            { icon: UserCheck, name: 'accountsAction', val: d.accountsAction, label: 'Comptes Securises', color: '#06b6d4',
              desc: "Comptes utilisateurs proteges par l'authentification multi-facteurs (MFA) et les politiques de mots de passe." },
            { icon: Laptop, name: 'virusDetected', val: d.virusDetected, label: 'Postes Proteges', color: '#06b6d4', trend: d.trendDevices,
              desc: 'Postes de travail avec antivirus a jour, chiffrement actif et agent de surveillance deploye.' },
          ].map((item, i) => (
            <div key={i} className="bg-[#111113] rounded-2xl border border-[#1f1f23] p-5 hover:border-[#06b6d4]/20 transition-all border-l-[3px] border-l-[#06b6d4]/40">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-[#06b6d4]/10 flex items-center justify-center">
                  <item.icon size={13} className="text-[#06b6d4]" />
                </div>
                <span className="text-[10px] text-[#52525b] uppercase tracking-wider font-bold flex-1">{item.label}</span>
                {item.trend && <TrendBadge name="trendDevices" value={item.trend} />}
              </div>
              <input type="text" name={item.name} value={item.val} onChange={ch}
                className="bg-transparent text-2xl font-black text-white outline-none focus:text-[#06b6d4] w-full" />
              <Desc text={item.desc} />
            </div>
          ))}
        </div>

        {/* Score explanation */}
        <div className="bg-[#111113] rounded-2xl border border-[#1f1f23] p-5 mb-10">
          <div className="flex items-start gap-3">
            <Activity size={14} className="text-[#F0AF00] mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#71717a] mb-1">Score de securite calcule automatiquement</p>
              <p className="text-[10px] text-[#52525b] leading-relaxed">
                Le score part de 100% et diminue selon la gravite des menaces : ransomwares (-{Math.min(20, Math.round(parseInt(d.ransomware || '0') / 2))}pts),
                menaces totales (-{Math.min(15, Math.round((parseInt(d.totalThreats.replace(/\s/g, '') || '0')) / 5000))}pts),
                phishing (-{Math.min(15, Math.round(parseInt(d.phishing.replace(/\s/g, '') || '0') / 1000))}pts),
                usurpations (-{Math.min(10, Math.round(parseInt(d.identityTheft || '0') / 100))}pts).
                Bonus de couverture appliques.
                <span className="text-[#F0AF00] font-bold ml-1">Score actuel : {score}%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-[#1f1f23]">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#F0AF00] to-[#795700] flex items-center justify-center">
              <Shield size={12} className="text-white" />
            </div>
            <span className="text-xs font-black tracking-wider">SPIE<span className="text-[#F0AF00]">BATIGNOLLES</span></span>
          </div>
          <p className="text-[9px] text-[#3f3f46] uppercase tracking-widest">Document Confidentiel - Direction Securite IT - {d.period}</p>
        </div>
      </div>
    </div>
  );
}
