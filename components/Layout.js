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
        <div className="bg-grain-background bg-cover h-full text-slate-300">
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
                    {!isAuthenticated && <button onClick={() => signIn()}>Sign In</button>}
                    {isAuthenticated && <button onClick={() => signOut()}>Sign Out</button>}
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
