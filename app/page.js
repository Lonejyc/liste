// pages/index.js
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
}