// components/Layout.js
import Head from 'next/head';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';

const Layout = ({ children, title = 'Projets' }) => {

    const { data: session, status } = useSession();
    let isAuthenticated = false;
    if (status === "authenticated") {
        isAuthenticated = true;
    }

    return (
        <div className="bg-grain-background bg-cover min-h-screen text-slate-300 flex flex-col justify-between">
            <Head>
                <title>{title}</title>
                <meta name="description" content="Une application Next.js bien structurée" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header className="flex flex-row p-3 justify-between">
                <nav className="flex items-center gap-6">
                    <Link href="/">Home</Link>
                    {isAuthenticated && <Link href="/liste">Projects</Link>}
                </nav>
                <nav className='flex items-center gap-6 text-sm'>
                    {!isAuthenticated && <button className='inline-block shrink-0 rounded-md bg-emerald-800 px-4 py-1.5 text-sm font-semibold text-slate-300 transition-all esae-in duration-300 hover:bg-slate-300 hover:text-emerald-800 hover:font-bold focus:outline-none focus:ring active:outline-none' onClick={() => signIn()}>Sign In</button>}
                    {isAuthenticated && <button className='inline-block shrink-0 rounded-md bg-emerald-800 px-4 py-1.5 text-sm font-semibold text-slate-300 transition-all esae-in duration-300 hover:bg-slate-300 hover:text-emerald-800 hover:font-bold focus:outline-none focus:ring active:outline-none' onClick={() => signOut()}>Sign Out</button>}
                </nav>
            </header>
            <main className="flex flex-col items-center justify-center gap-3 px-8 py-8 h-auto sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
                {children}
            </main>
            <footer className="flex flex-row p-3 justify-center">
                &copy; {new Date().getFullYear()} Ma liste avec Next.js
            </footer>
        </div>
    );
};

export default Layout;
