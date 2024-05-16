// pages/liste/index.js
import { getSession } from "next-auth/react";

export default function Liste({ session }) {
  if (!session) return <p>Access Denied</p>;

  return (
    <div>
      <h1>Project List</h1>
      <ul>
        {/* Liste des projets ici */}
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

  return {
    props: { session }
  };
}