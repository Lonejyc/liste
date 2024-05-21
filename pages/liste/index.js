// pages/liste/index.js
import { getSession } from "next-auth/react";
import fs from 'fs';
import path from 'path';
import Link from "next/link";
import Layout from '../../components/Layout';

export default function Liste({ session, folders }) {
  if (!session) return <p>Access Denied</p>;

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mb-4">Project List</h1>
        <ul className="list-disc pl-4">
          {folders.map((folder) => (
            <li key={folder} className="mb-2">
              <Link href={`localhost:3000/${folder}`} className="text-blue-500 hover:underline">{folder}</Link>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
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

  const currentDirectory = path.resolve(process.cwd(), '');
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