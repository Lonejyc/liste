// pages/index.js
import { useSession, signIn, signOut } from "next-auth/react";
import Layout from '../components/Layout';
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  const loading = status === 'loading';

  if (loading) return <p>Loading...</p>;

  if (!session) {
    return (
      <Layout>
        <h1 className="text-slate-200">Welcome to the App</h1>
        <button onClick={() => signIn()} className="inline-block shrink-0 rounded-md bg-emerald-800 px-4 py-1.5 text-sm font-semibold text-slate-300 transition-all esae-in duration-300 hover:bg-slate-300 hover:text-emerald-800 hover:font-bold focus:outline-none focus:ring active:outline-none">Sign In</button>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>Welcome, {session.user.name}</h1>
      <button className="inline-block shrink-0 rounded-md bg-emerald-800 px-4 py-1.5 text-sm font-semibold text-slate-300 transition-all esae-in duration-300 hover:bg-slate-300 hover:text-emerald-800 hover:font-bold focus:outline-none focus:ring active:outline-none" onClick={() => signOut()}>Sign Out</button>
      <p>You are now signed in. Go to <Link href="/liste" className="inline-block shrink-0 rounded-md bg-emerald-800 px-4 py-1.5 text-sm font-semibold text-slate-300 transition-all esae-in duration-300 hover:bg-slate-300 hover:text-emerald-800 hover:font-bold focus:outline-none focus:ring active:outline-none">Projects</Link></p>
    </Layout>
  );
}
