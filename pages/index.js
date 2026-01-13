// pages/index.js
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import Layout from '../components/Layout';
import Link from "next/link";
import { useEffect } from "react";
import { HiOutlineServer, HiOutlineCpuChip, HiOutlineGlobeAlt } from "react-icons/hi2";
import { FiLogOut, FiFolder, FiHardDrive, FiCpu } from "react-icons/fi";
import { LuMemoryStick } from "react-icons/lu";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { props: { systemInfo: null } };

  try {
    const response = await fetch('http://monitor-agent:5000/api/stats', {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) throw new Error(`Agent répond avec status: ${response.status}`);

    const systemInfo = await response.json();
    return { props: { systemInfo } };
  } catch (error) {
    console.error("DEBUG - Erreur fetch agent:", error.message);
    return { props: { systemInfo: null } };
  }
}

export default function Home({ systemInfo }) {
  const { data: session, status } = useSession();

  const loading = status === 'loading';
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-300">Loading...</div>;

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

  return (
    <Layout>
      {/* Section Bienvenue améliorée */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between bg-slate-900/40 backdrop-blur-md border border-slate-800 p-6 rounded-2xl mb-8 gap-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Welcome back, <span className="text-emerald-500">{session.user.name}</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">You are securely signed in.</p>
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

      {/* Section Informations Système avec protection contre le 'null' */}
      <div className="w-full max-w-4xl">
        <div className="flex items-center gap-2 mb-6 text-emerald-500">
          <HiOutlineServer className="text-2xl" />
          <h2 className="text-lg font-bold uppercase tracking-widest">System Status</h2>
        </div>

        {!systemInfo ? (
          <div className="p-8 border border-dashed border-slate-700 rounded-xl text-center text-slate-500">
            System information is currently unavailable.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Carte Hostname */}
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-4 rounded-xl hover:border-emerald-600 transition-colors">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Hostname</p>
              <p className="text-lg font-mono text-slate-200 truncate">{systemInfo.hostname}</p>
            </div>

            {/* Carte OS / Plateforme */}
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-4 rounded-xl hover:border-emerald-600 transition-colors">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Plateforme</p>
              <div className="flex items-center gap-2">
                <span className="capitalize text-lg text-slate-200">{systemInfo.platform}</span>
                <span className="bg-emerald-900/50 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-800">
                  {systemInfo.architecture}
                </span>
              </div>
            </div>

            {/* Carte CPU */}
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-4 rounded-xl hover:border-emerald-600 transition-colors">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Processeurs</p>
              <p className="text-lg text-slate-200">{systemInfo.cpus.length} Cœurs logiques</p>
            </div>

            {/* Carte Mémoire (avec jauge visuelle) */}
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-4 rounded-xl lg:col-span-2 hover:border-emerald-600 transition-colors">
              <div className="flex justify-between items-end mb-2">
                <p className="text-xs text-slate-500 uppercase font-bold">Utilisation Mémoire</p>
                <p className="text-xs text-slate-400">{systemInfo.freeMemory} Go libres / {systemInfo.totalMemory} Go</p>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(1 - systemInfo.freeMemory / systemInfo.totalMemory) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Carte Disk Space */}
            <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800 p-4 rounded-xl hover:border-emerald-600 transition-colors">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Répertoire Home</p>
              <p className="text-sm font-mono text-emerald-500 truncate">{systemInfo.diskSpace}</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
