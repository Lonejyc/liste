// pages/index.js

/* use client;

import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/explore')
      .then(response => response.json())
      .then(data => {
        if (data.files) {
          setFiles(data.files);
        } else {
          setError(data.message);
        }
      })
      .catch(() => {
        setError('Failed to fetch files');
      });
  }, []);

  return (
    <div className={styles.container}>
      <h1>Explorateur de fichiers</h1>
      {error && <p>Error: {error}</p>}
      <ul>
        {files.map(file => (
          <li key={file}>{file}</li>
        ))}
      </ul>
    </div>
  );
} */

// pages/index.js
import { useSession, signIn, signOut } from "next-auth/react";
import Layout from '../components/Layout';

export default function Home() {
  const { data: session, status } = useSession();

  const loading = status === 'loading';

  if (loading) return <p>Loading...</p>;

  if (!session) {
    return (
      <Layout>
        <h1>Welcome to the App</h1>
        <button onClick={() => signIn()}>Sign In</button>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1>Welcome, {session.user.name}</h1>
      <button onClick={() => signOut()}>Sign Out</button>
      <p>You are now signed in. Go to <a href="/liste">Projects</a></p>
    </Layout>
  );
}
