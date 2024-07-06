// pages/index.js
import { useSession, signIn, signOut } from "next-auth/react";
import Layout from '../components/Layout';
import Link from "next/link";
import si from 'systeminformation';

export default function Home() {
  const { data: session, status } = useSession();

  const loading = status === 'loading';

  if (loading) return <p>Loading...</p>;

  const [diskSpace, setDiskSpace] = useState(null);
  const [ramUsage, setRamUsage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const diskSpaceData = await si.fsSize();
      const ramUsageData = await si.mem();

      setDiskSpace(diskSpaceData);
      setRamUsage(ramUsageData);
    };

    fetchData();
  }, []);

  if (!session) {
    return (
      <Layout>
        <h1 className="text-slate-200">Welcome to the App</h1>
        <button onClick={() => signIn()} className="inline-block shrink-0 rounded-md bg-emerald-800 px-4 py-1.5 text-sm font-semibold text-slate-300 transition-all esae-in duration-300 hover:bg-slate-300 hover:text-emerald-800 hover:font-bold focus:outline-none active:outline-none">Sign In</button>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>Welcome, {session.user.name}</h1>
      <button className="inline-block shrink-0 rounded-md bg-emerald-800 px-4 py-1.5 text-sm font-semibold text-slate-300 transition-all esae-in duration-300 hover:bg-slate-300 hover:text-emerald-800 hover:font-bold focus:outline-none active:outline-none" onClick={() => signOut()}>Sign Out</button>
      <p>You are now signed in. Go to <Link href="/liste" className="inline-block shrink-0 rounded-md bg-emerald-800 px-4 py-1.5 text-sm font-semibold text-slate-300 transition-all esae-in duration-300 hover:bg-slate-300 hover:text-emerald-800 hover:font-bold focus:outline-none active:outline-none">Projects</Link></p>
      {diskSpace && (
        <div>
          <p>Espace disque utilisé: {diskSpace[0].used}</p>
          <p>Espace disque disponible: {diskSpace[0].size - diskSpace[0].used}</p>
        </div>
      )}
      {ramUsage && (
        <p>Utilisation de la RAM: {ramUsage.used / 1024 / 1024} MB</p>
      )}
    </Layout>
  );
}
