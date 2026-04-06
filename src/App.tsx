import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { 
  Download, Mail, UserCog, ShieldAlert, MailWarning, UserX, 
  ArrowDown, MonitorX, Terminal, Settings, Shield, Activity,
  Search, Bell, MessageSquare, LayoutDashboard, BarChart2, 
  Layers, LogOut, ChevronDown, Fingerprint, Lock, MailCheck, UserCheck, Laptop
} from 'lucide-react';

// Reusable Dashboard Metric Card Component
const MetricCard = ({ title, value, name, onChange, icon: Icon, type = 'line' }: any) => (
  <div className="bg-[#002B5C] border border-[#004080] rounded-xl p-5 relative overflow-hidden group hover:border-[#F5A800] transition-all duration-300 shadow-lg">
    <div className="flex justify-between items-start mb-4 relative z-10">
      <h3 className="text-[#9ca3af] text-[11px] font-bold tracking-widest uppercase">{title}</h3>
      <div className="p-2 bg-[#001B3D] rounded-lg text-[#F5A800] shadow-[0_0_15px_rgba(245,168,0,0.15)] group-hover:shadow-[0_0_20px_rgba(245,168,0,0.3)] transition-shadow">
        <Icon size={18} />
      </div>
    </div>
    <div className="relative z-10">
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="bg-transparent text-4xl font-black text-white w-full outline-none focus:text-[#F5A800] transition-colors"
        style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.1)' }}
      />
    </div>
    
    {/* Decorative Charts */}
    <div className="absolute bottom-0 left-0 w-full h-16 opacity-20 pointer-events-none">
      {type === 'line' && (
        <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full stroke-[#F5A800] fill-none" strokeWidth="1.5">
          <path d="M0,30 Q15,10 25,20 T45,10 T65,25 T85,5 T100,20" />
          <path d="M0,30 Q15,10 25,20 T45,10 T65,25 T85,5 T100,20" className="stroke-[#F5A800] opacity-50" strokeWidth="4" filter="blur(4px)" />
        </svg>
      )}
      {type === 'bar' && (
        <div className="flex items-end h-full gap-1.5 px-3 opacity-60 pb-2">
          {[40, 70, 45, 90, 65, 85, 30, 60, 50, 75].map((h, i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-[#F5A800] to-[#F5A800]/20 rounded-t-sm" style={{ height: `${h}%` }}></div>
          ))}
        </div>
      )}
      {type === 'wave' && (
        <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full fill-[#F5A800] opacity-20">
          <path d="M0,30 C20,10 40,30 60,10 C80,-10 100,20 100,20 L100,30 L0,30 Z" />
        </svg>
      )}
    </div>
  </div>
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
        backgroundColor: '#00152E',
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
    <div className="min-h-screen bg-[#00152E] flex font-sans text-white overflow-hidden relative">
      {/* Global Technical Grid Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#002B5C] border-r border-[#004080] flex flex-col shrink-0 hidden md:flex z-20 shadow-[4px_0_24px_rgba(0,0,0,0.3)] relative">
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-[#004080]">
          <Terminal className="text-[#F5A800] mr-3" size={28} />
          <h1 className="text-xl font-black tracking-wider text-white">CYBER<span className="text-[#F5A800]">DASH</span></h1>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <p className="px-2 text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mb-4">Menu Principal</p>
          
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-[#001B3D] text-white rounded-lg border-l-4 border-[#F5A800] shadow-md">
            <LayoutDashboard size={18} className="text-[#F5A800]" />
            <span className="font-semibold text-sm">Overview</span>
          </a>
          
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#9ca3af] hover:bg-[#001B3D] hover:text-white rounded-lg transition-colors">
            <Bell size={18} />
            <span className="font-semibold text-sm">Alerts</span>
            <span className="ml-auto bg-[#ef4444] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">3</span>
          </a>
          
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#9ca3af] hover:bg-[#001B3D] hover:text-white rounded-lg transition-colors">
            <ShieldAlert size={18} />
            <span className="font-semibold text-sm">Threats</span>
          </a>

          <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#9ca3af] hover:bg-[#001B3D] hover:text-white rounded-lg transition-colors">
            <UserCog size={18} />
            <span className="font-semibold text-sm">Users</span>
          </a>
          
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#9ca3af] hover:bg-[#001B3D] hover:text-white rounded-lg transition-colors">
            <Layers size={18} />
            <span className="font-semibold text-sm">Reports</span>
          </a>
          
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#9ca3af] hover:bg-[#001B3D] hover:text-white rounded-lg transition-colors">
            <Settings size={18} />
            <span className="font-semibold text-sm">Settings</span>
          </a>
        </nav>

        {/* Bottom User Area */}
        <div className="p-4 border-t border-[#004080]">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-[#9ca3af] hover:text-red-400 transition-colors">
            <LogOut size={18} />
            <span className="font-semibold text-sm">Déconnexion</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        
        {/* Top Navbar */}
        <header className="h-20 bg-[#002B5C] border-b border-[#004080] flex items-center justify-between px-8 shrink-0 z-10 shadow-md">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96 hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" size={18} />
              <input 
                type="text" 
                placeholder="Search metrics, alerts, or reports..." 
                className="w-full bg-[#00152E] border border-[#004080] rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#F5A800] transition-colors"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-[#9ca3af]">
              <button className="relative hover:text-white transition-colors">
                <MessageSquare size={20} />
              </button>
              <button className="relative hover:text-white transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#F5A800] rounded-full"></span>
              </button>
            </div>
            
            <div className="h-8 w-px bg-[#004080]"></div>
            
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white group-hover:text-[#F5A800] transition-colors">Admin Spie</p>
                <p className="text-[10px] text-[#9ca3af] uppercase tracking-wider">Sécurité IT</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F5A800] to-[#ff8c00] p-0.5">
                <div className="w-full h-full rounded-full bg-[#002B5C] flex items-center justify-center">
                  <UserCog size={20} className="text-[#F5A800]" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Scrollable Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {/* Global Technical Grid Background */}
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          
          <div ref={printRef} className="p-6 lg:p-8 min-h-full relative z-10 bg-[#00152E]">
            {/* Background Grid for Export */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-4 relative z-10">
              <div>
                <h2 className="text-3xl font-black tracking-wide mb-1 text-white">CYBERSECURITY <span className="text-[#F5A800]">REPORT</span></h2>
                <p className="text-sm text-[#9ca3af]">Enterprise cybersecurity control center metrics.</p>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                {/* Period Input */}
                <div className="bg-[#002B5C] border border-[#004080] rounded-lg p-2 flex items-center gap-3 shadow-lg">
                  <span className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider pl-2">Période:</span>
                  <input 
                    type="text" 
                    name="period" 
                    value={data.period} 
                    onChange={handleChange} 
                    className="bg-[#00152E] border border-[#004080] rounded px-3 py-1.5 text-sm font-bold text-[#F5A800] outline-none focus:border-[#F5A800] w-48 text-center"
                  />
                </div>

                {/* Export Actions (Ignored in export) */}
                <div data-html2canvas-ignore="true" className="flex gap-2">
                  <button onClick={() => handleDownload('png')} className="flex items-center justify-center gap-2 bg-[#F5A800] hover:bg-[#D99500] text-[#00152E] py-2 px-4 rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(245,168,0,0.2)] hover:shadow-[0_0_25px_rgba(245,168,0,0.4)]">
                    <Download size={16} /> PNG
                  </button>
                  <button onClick={() => handleDownload('jpeg')} className="flex items-center justify-center gap-2 bg-[#002B5C] border border-[#F5A800] hover:bg-[#F5A800]/10 text-[#F5A800] py-2 px-4 rounded-lg font-bold transition-all">
                    <Download size={16} /> JPEG
                  </button>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">
              <MetricCard title="Threats Detected" value={data.totalThreats} name="totalThreats" onChange={handleChange} icon={ShieldAlert} type="wave" />
              <MetricCard title="Identity Theft Attempts" value={data.identityTheft} name="identityTheft" onChange={handleChange} icon={Fingerprint} type="line" />
              <MetricCard title="Phishing Blocked" value={data.phishing} name="phishing" onChange={handleChange} icon={MailWarning} type="bar" />
              <MetricCard title="Ransomware Prevented" value={data.ransomware} name="ransomware" onChange={handleChange} icon={Lock} type="line" />
              
              <MetricCard title="Emails Scanned" value={data.emailsReceived} name="emailsReceived" onChange={handleChange} icon={MailCheck} type="bar" />
              <MetricCard title="Accounts Secured" value={data.accountsAction} name="accountsAction" onChange={handleChange} icon={UserCheck} type="wave" />
              <MetricCard title="Devices Protected" value={data.virusDetected} name="virusDetected" onChange={handleChange} icon={Laptop} type="line" />
              <MetricCard title="Security Score" value={data.securityScore} name="securityScore" onChange={handleChange} icon={Activity} type="bar" />
            </div>
            
            {/* Footer for Export */}
            <div className="mt-12 pt-6 border-t border-[#004080] flex justify-between items-center relative z-10">
              <div className="flex items-center gap-3">
                <Terminal className="text-[#F5A800]" size={24} />
                <span className="text-lg font-black tracking-wider text-white">SPIE<span className="text-[#F5A800]">BATIGNOLLES</span></span>
              </div>
              <p className="text-xs text-[#9ca3af] uppercase tracking-widest">Document Confidentiel - Sécurité IT</p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #00152E; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #004080; 
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #005099; 
        }
      `}} />
    </div>
  );
}


