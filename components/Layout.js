// components/Layout.js
import Head from 'next/head';
import Link from 'next/link';
import styles from './Layout.module.css'; // Assurez-vous de créer ce fichier CSS

const Layout = ({ children, title = 'Default Title' }) => {
    return (
        <div className={styles.layout}>
            <Head>
                <title>{title}</title>
                <meta name="description" content="Une application Next.js bien structurée" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header className={styles.header}>
                <nav className="flex items-center gap-6 text-sm">
                    <Link href="/">Home</Link>
                    <Link href="/liste">Projects</Link>
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
