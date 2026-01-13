import { useState, useEffect } from 'react';
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import Layout from '../components/Layout';
import Link from "next/link";
import { HiOutlineServer, HiOutlineCpuChip } from "react-icons/hi2";
import { FiLogOut, FiFolder, FiHardDrive, FiActivity, FiArrowUp, FiArrowDown, FiClock } from "react-icons/fi";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: { systemInfo: null } };

  try {
    const agentUrl = process.env.MONITOR_AGENT_URL || 'http://10.0.1.11:5000/api/stats';
    const response = await fetch(agentUrl);
   
    if (!response.ok) throw new Error('Erreur Agent');

    const systemInfo = await response.json();
    return { props: { systemInfo } };
  } catch (error) {
    console.error("Erreur serveur direct fetch Python:", error.message);
    return { props: { systemInfo: null } };
  }
}

export default function Home({ systemInfo: initialData }) {
  const { data: session, status } = useSession();
  const [systemInfo, setSystemInfo] = useState(initialData);
  const [history, setHistory] = useState({ cpu: [], mem: [] });

  useEffect(() => {
    let isMounted = true;
    const fetchSystemInfo = async () => {
      try {
        const res = await fetch('/api/system-info');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setSystemInfo(data);
            setHistory(prev => {
              const newCpu = [...prev.cpu, data.cpu.usage_percent].slice(-30);
              const newMem = [...prev.mem, data.memory.percent].slice(-30);
              return { cpu: newCpu, mem: newMem };
            });
          }
        }
      } catch (error) {
        console.error("Auto-refresh error:", error);
      }
    };

    const interval = setInterval(fetchSystemInfo, 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center text-slate-300">Loading...</div>;

  if (!session) {
    return (
      <Layout>
        <h1 className="text-4xl font-bold text-slate-200 mb-8">Welcome to the App</h1>
        <button onClick={() => signIn()} className="rounded-md bg-emerald-800 px-6 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-300 hover:text-emerald-800 transition-all duration-300">
          Sign In
        </button>
      </Layout>
    );
  }

  // Fonction pour convertir les secondes en format lisible (Jours, Heures, Min)
  const formatUptime = (seconds) => {
    const d = Math.floor(seconds / (3600*24));
    const h = Math.floor(seconds % (3600*24) / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    return `${d}d ${h}h ${m}m`;
  };

  const Sparkline = ({ data, color }) => {
    if (data.length < 2) return null;
    const max = 100;
    const min = 0;
    const width = 100;
    const height = 30;
    const step = width / (data.length - 1);
    
    const path = data.map((val, i) => {
        const x = i * step;
        const y = height - ((val - min) / (max - min)) * height;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-8 opacity-50" preserveAspectRatio="none">
            <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
    );
  };

  return (
    <Layout>
      {/* En-tête Utilisateur Stealth */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between bg-black/20 backdrop-blur-md border border-white/5 p-8 rounded-3xl mb-10 gap-6 shadow-2xl">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
            Welcome back, <span className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">{session.user.name}</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-mono flex items-center gap-2">
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
             SYSTEM_DASHBOARD_ACTIVE
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/liste" className="flex items-center gap-2 rounded-lg bg-emerald-900/30 border border-emerald-500/20 px-5 py-2.5 text-sm font-medium text-emerald-100 hover:bg-emerald-900/50 hover:border-emerald-500/40 transition-all">
            <FiFolder /> Projects
          </Link>
          <button onClick={() => signOut()} className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/5 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all">
            <FiLogOut /> Sign Out
          </button>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        <div className="flex items-center gap-3 mb-6 text-emerald-500/80 pl-2">
          <HiOutlineServer className="text-xl" />
          <h2 className="text-xs font-bold font-mono tracking-[0.2em] uppercase">Live Telemetry</h2>
        </div>

        {!systemInfo ? (
          <div className="p-8 border border-dashed border-slate-700/50 rounded-xl text-center text-slate-500 font-mono text-sm">
            [WAITING FOR TELEMETRY DATA...]
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           
            {/* CPU & Temp */}
            <div className="bg-black/20 backdrop-blur-md border border-white/5 p-6 rounded-2xl hover:border-emerald-500/20 transition-all group overflow-hidden relative">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">CPU Load</p>
                {systemInfo.cpu.temperature?.current && (
                  <span className="text-[10px] font-mono text-orange-400 bg-orange-950/30 px-2 py-0.5 rounded border border-orange-500/20">{systemInfo.cpu.temperature.current}°C</span>
                )}
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                 <p className="text-4xl font-mono font-light text-slate-100">{systemInfo.cpu.usage_percent}<span className="text-lg text-slate-500">%</span></p>
              </div>
              
              <div className="h-8 mb-4">
                  <Sparkline data={history.cpu} color="#10b981" />
              </div>

              <p className="text-[10px] text-slate-600 font-mono border-t border-white/5 pt-3 mt-auto">
                 ARCH: {systemInfo.cpu.cores_logical} CORES @ {systemInfo.cpu.frequency_mhz} MHz
              </p>
            </div>

            {/* RAM Progress */}
            <div className="bg-black/20 backdrop-blur-md border border-white/5 p-6 rounded-2xl hover:border-emerald-500/20 transition-all group">
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-4">Memory Allocation</p>
              <div className="flex justify-between items-end mb-2">
                <p className="text-3xl font-mono font-light text-slate-100">{systemInfo.memory.percent}<span className="text-lg text-slate-500">%</span></p>
                <p className="text-[10px] font-mono text-slate-400">{systemInfo.memory.used} / {systemInfo.memory.total}</p>
              </div>
              
              <div className="w-full bg-slate-800/50 rounded-full h-1 my-4 overflow-hidden">
                <div className="bg-emerald-500 h-full shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000" style={{ width: `${systemInfo.memory.percent}%` }}></div>
              </div>

               <div className="h-8 mb-1">
                  <Sparkline data={history.mem} color="#3b82f6" />
              </div>
            </div>

            {/* Disk Usage */}
            <div className="bg-black/20 backdrop-blur-md border border-white/5 p-6 rounded-2xl hover:border-emerald-500/20 transition-all group">
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-4">Storage Matrix</p>
              <div className="flex justify-between items-end mb-2">
                <p className="text-3xl font-mono font-light text-slate-100">{systemInfo.disk.percent}<span className="text-lg text-slate-500">%</span></p>
                <p className="text-[10px] font-mono text-slate-400">{systemInfo.disk.free} free</p>
              </div>
              <div className="w-full bg-slate-800/50 rounded-full h-1 mt-4 overflow-hidden">
                <div className="bg-blue-500 h-full shadow-[0_0_10px_rgba(59,130,246,0.3)] transition-all" style={{ width: `${systemInfo.disk.percent}%` }}></div>
              </div>
               <div className="mt-6 flex flex-col gap-1">
                   <div className="flex justify-between text-[10px] font-mono text-slate-500">
                       <span>READ</span>
                       <span>IDLE</span>
                   </div>
               </div>
            </div>

            {/* Network Stats */}
            <div className="bg-black/20 backdrop-blur-md border border-white/5 p-6 rounded-2xl hover:border-emerald-500/20 transition-all group">
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-4">Net I/O</p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
                   <div className="flex items-center gap-2">
                      <FiArrowUp className="text-emerald-400" /> 
                      <span className="text-xs text-slate-400">UPLOAD</span>
                   </div>
                   <span className="text-sm font-mono text-slate-200">{systemInfo.network.sent}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
                   <div className="flex items-center gap-2">
                      <FiArrowDown className="text-blue-400" /> 
                      <span className="text-xs text-slate-400">DOWNLOAD</span>
                   </div>
                   <span className="text-sm font-mono text-slate-200">{systemInfo.network.recv}</span>
                </div>
              </div>
            </div>

            {/* Uptime */}
            <div className="bg-black/20 backdrop-blur-md border border-white/5 p-6 rounded-2xl hover:border-emerald-500/20 transition-all group">
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-2">System Uptime</p>
              <div className="flex items-center gap-3 mt-4 text-slate-200">
                <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-400">
                    <FiClock className="text-xl" />
                </div>
                <p className="text-xl font-mono">{formatUptime(systemInfo.uptime.seconds)}</p>
              </div>
            </div>

            {/* OS Info */}
            <div className="bg-black/20 backdrop-blur-md border border-white/5 p-6 rounded-2xl hover:border-emerald-500/20 transition-all group">
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-1">Platform</p>
              <p className="text-lg text-slate-200 mt-2 font-mono">{systemInfo.os.platform}</p>
              <p className="text-xs text-slate-500 font-mono">{systemInfo.os.release}</p>
              <div className="mt-4 inline-block px-2 py-1 rounded border border-emerald-500/30 bg-emerald-500/5 text-[10px] text-emerald-400 font-mono uppercase">
                {systemInfo.os.architecture}
              </div>
            </div>

          </div>
        )}
      </div>

       <div className="w-full max-w-5xl mt-8 flex justify-between text-[10px] text-slate-600 font-mono uppercase tracking-widest border-t border-white/5 pt-4">
           <span>SysCheck: OK</span>
           <span>Protocol: SECURE_V2</span>
           <span>Latency: 12ms</span>
       </div>
    </Layout>
  );
}