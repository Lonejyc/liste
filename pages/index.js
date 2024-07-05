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
        <button onClick={() => signIn()} className="text-white px-4 py-2 border rounded-lg transition-all ease-in duration-300 hover:bg-slate-300 hover:text-black">Sign In</button>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>Welcome, {session.user.name}</h1>
      <button onClick={() => signOut()}>Sign Out</button>
      <p>You are now signed in. Go to <Link href="/liste">Projects</Link></p>
    </Layout>
  );
}
