import { getSession } from "next-auth/react";
import Link from "next/link";
import Layout from '../../components/Layout';
import { FiExternalLink, FiGithub, FiTerminal, FiGrid } from "react-icons/fi";

import PROJECTS from '../../data/projects.json';

export default function Liste({ session }) {
  if (!session) return <div className="text-center mt-20 text-slate-500">Access Denied</div>;

  return (
    <Layout title="Projects Command">
      <div className="w-full max-w-6xl">
        <div className="flex items-center gap-3 mb-10 pl-2 border-b border-white/5 pb-6">
           <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
             <FiGrid className="text-2xl text-emerald-400" />
           </div>
           <div>
             <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Project Matrix</h1>
             <p className="text-slate-500 font-mono text-xs mt-1">SELECT_MODULE_TO_LAUNCH</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project) => (
            <div key={project.id} className="group relative bg-black/20 backdrop-blur-md border border-white/5 p-6 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] flex flex-col">
              
              <div className="flex justify-between items-start mb-4">
                 <div className="flex gap-2">
                    {project.status === 'ONLINE' && <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">ONLINE</span>}
                    {project.status === 'DEV' && <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">DEV</span>}
                    {project.status === 'OFFLINE' && <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/20">OFFLINE</span>}
                 </div>
                 <FiTerminal className="text-slate-600 group-hover:text-emerald-500 transition-colors" />
              </div>

              <h2 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-emerald-300 transition-colors">{project.title}</h2>
              <p className="text-slate-400 text-sm mb-6 flex-grow leading-relaxed">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                 {project.tech.map(t => (
                   <span key={t} className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-1 rounded">{t}</span>
                 ))}
              </div>

              <a href={project.link} target={project.link.startsWith('http') ? '_blank' : '_self'} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/5 border border-white/5 text-slate-300 font-medium text-sm hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-all group-hover:shadow-lg">
                 <span>Launch Module</span>
                 <FiExternalLink />
              </a>

            </div>
          ))}
          
          {/* Add New Placeholder */}
          <div className="group border border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-slate-600 hover:border-emerald-500/30 hover:text-emerald-500/50 transition-all cursor-pointer min-h-[300px]">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m6-6H6" />
               </svg>
             </div>
             <p className="font-mono text-xs tracking-widest uppercase">Deploy New Unit</p>
          </div>

        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    };
  }

  return {
    props: { session }
  };
}