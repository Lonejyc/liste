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
                <nav>
                    <Link href="/">Home</Link>
                    <Link href="/liste">Projects</Link>
                </nav>
            </header>
            <main className={styles.main}>
                {children}
            </main>
            <footer className={styles.footer}>
                &copy; {new Date().getFullYear()} Mon Application Next.js
            </footer>
        </div>
    );
};

export default Layout;
