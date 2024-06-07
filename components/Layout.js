// components/Layout.js
import Head from 'next/head';
import Link from 'next/link';
import styles from './Layout.module.css'; // Assurez-vous de créer ce fichier CSS
import { signIn, useSession } from 'next-auth/react';

const Layout = ({ children, title = 'Default Title' }) => {

    const { data: session, status } = useSession();
    let isAuthenticated = false;
    if (status === "authenticated") {
        isAuthenticated = true;
    }

    return (
        <div className={styles.layout}>
            <Head>
                <title>{title}</title>
                <meta name="description" content="Une application Next.js bien structurée" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header className="flex flex-row p-3 bg-blue-500 justify-between">
                <nav className="flex items-center gap-6 text-sm">
                    <Link href="/">Home</Link>
                    {isAuthenticated && <Link href="/liste">Projects</Link>}
                </nav>
                <nav className='flex items-center gap-6 text-sm'>
                    {!isAuthenticated && <button onClick={() => signIn()}>Sign In</button>}
                    {isAuthenticated && <button onClick={() => signOut()}>Sign Out</button>}
                </nav>
            </header>
            <main className="flex flex-col items-center justify-center gap-3 px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
                {children}
            </main>
            <footer className={styles.footer}>
                &copy; {new Date().getFullYear()} Ma liste avec Next.js
            </footer>
        </div>
    );
};

export default Layout;
