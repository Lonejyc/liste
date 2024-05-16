// pages/liste/index.js
import { getSession } from "next-auth/react";
import fs from 'fs';
import path from 'path';
import Link from "next/link";

export default function Liste({ session, folders }) {
  if (!session) return <p>Access Denied</p>;

  return (
    <div>
      <h1>Project List</h1>
      <ul>
        {folders.map((folder) => (
          <Link href={`/liste/${folder}`}>{folder}</Link>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    };
  }

  const currentDirectory = path.resolve(process.cwd(), 'pages/liste');
  const folderNames = fs.readdirSync(currentDirectory).filter((folder) => {
    const folderPath = path.join(currentDirectory, folder);
    const stats = fs.statSync(folderPath);
    return stats.isDirectory() && folder.startsWith('_');
  });

  return {
    props: {
      session,
      folders: folderNames
    }
  };
}