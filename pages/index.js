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

  useEffect(() => {
    let isMounted = true;
    const fetchSystemInfo = async () => {
      try {
        const res = await fetch('/api/system-info');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setSystemInfo(data);
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

  return (
    <Layout>
      {/* En-tête Utilisateur */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl mb-8 gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Welcome back, <span className="text-emerald-500">{session.user.name}</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Server Dashboard active.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/liste" className="flex items-center gap-2 rounded-lg bg-emerald-800/80 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-emerald-700 transition-all">
            <FiFolder /> Projects
          </Link>
          <button onClick={() => signOut()} className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-red-900/40 hover:text-red-400 transition-all">
            <FiLogOut /> Sign Out
          </button>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        <div className="flex items-center gap-2 mb-6 text-emerald-500">
          <HiOutlineServer className="text-2xl" />
          <h2 className="text-lg font-bold uppercase tracking-widest">Live Server Status</h2>
        </div>

        {!systemInfo ? (
          <div className="p-8 border border-dashed border-slate-700 rounded-xl text-center text-slate-500">
            System information is currently unavailable.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           
            {/* CPU & Temp */}
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-4 rounded-xl hover:border-emerald-600 transition-colors">
              <div className="flex justify-between items-start">
                <p className="text-xs text-slate-500 uppercase font-bold mb-1">CPU Usage</p>
                {systemInfo.cpu.temperature?.current && (
                  <span className="text-xs font-mono text-orange-400">{systemInfo.cpu.temperature.current}°C</span>
                )}
              </div>
              <p className="text-2xl font-mono text-slate-200">{systemInfo.cpu.usage_percent}%</p>
              <p className="text-[10px] text-slate-500 mt-1">{systemInfo.cpu.cores_logical} Cores @ {systemInfo.cpu.frequency_mhz} MHz</p>
            </div>

            {/* RAM Progress */}
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-4 rounded-xl hover:border-emerald-600 transition-colors">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Memory (RAM)</p>
              <div className="flex justify-between items-end mb-1">
                <p className="text-lg font-mono text-slate-200">{systemInfo.memory.percent}%</p>
                <p className="text-[10px] text-slate-400">{systemInfo.memory.used} / {systemInfo.memory.total}</p>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${systemInfo.memory.percent}%` }}></div>
              </div>
            </div>

            {/* Disk Usage */}
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-4 rounded-xl hover:border-emerald-600 transition-colors">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Disk Space</p>
              <div className="flex justify-between items-end mb-1">
                <p className="text-lg font-mono text-slate-200">{systemInfo.disk.percent}%</p>
                <p className="text-[10px] text-slate-400">{systemInfo.disk.free} free</p>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-blue-500 h-full transition-all" style={{ width: `${systemInfo.disk.percent}%` }}></div>
              </div>
            </div>

            {/* Network Stats */}
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-4 rounded-xl hover:border-emerald-600 transition-colors">
              <p className="text-xs text-slate-500 uppercase font-bold mb-2">Network Traffic</p>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-slate-300">
                  <FiArrowUp className="text-emerald-500" /> <span className="text-sm font-mono">{systemInfo.network.sent}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <FiArrowDown className="text-blue-500" /> <span className="text-sm font-mono">{systemInfo.network.recv}</span>
                </div>
              </div>
            </div>

            {/* Uptime */}
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-4 rounded-xl hover:border-emerald-600 transition-colors">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Uptime</p>
              <div className="flex items-center gap-2 mt-2 text-slate-200">
                <FiClock className="text-emerald-500" />
                <p className="text-lg font-mono">{formatUptime(systemInfo.uptime.seconds)}</p>
              </div>
            </div>

            {/* OS Info */}
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-4 rounded-xl hover:border-emerald-600 transition-colors">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">System Architecture</p>
              <p className="text-sm text-slate-200 mt-1">{systemInfo.os.platform} {systemInfo.os.release}</p>
              <p className="text-[10px] text-emerald-500 font-mono mt-1">{systemInfo.os.architecture}</p>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}