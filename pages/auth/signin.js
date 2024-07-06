// pages/auth/signin.js
import { getCsrfToken } from "next-auth/react";
import Layout from "../../components/Layout";

export default function SignIn({ csrfToken }) {
  return (
    <Layout>
      <h2 className="text-2xl font-bold text-slate-200 pb-8">Sign in to your account</h2>
      <form method="post" action="/api/auth/callback/credentials" className="mt-8 flex flex-col gap-7 justify-center w-1/3">
        <input name='csrfToken' type='hidden' defaultValue={csrfToken || null}/>
        <div className="">
          <label htmlFor="username" className="block text-sm font-medium text-slate-300">Username</label>
          <input name="username" type="text" className="mt-1 rounded-md border border-slate-700 bg-slate-900 text-lg text-slate-300 shadow-sm p-1 w-full" />
        </div>
        <div className="">
          <label htmlFor="Password" className="block text-sm font-medium text-slate-300">Password</label>
          <input name="password" type="password" className="mt-1 rounded-md border border-slate-700 bg-slate-900 text-lg text-slate-300 shadow-sm p-1 w-full" />
        </div>
        <button type="submit" className="inline-block shrink-0 rounded-md bg-emerald-800 py-1.5 text-sm font-semibold text-slate-300 transition-all esae-in duration-300 hover:bg-slate-300 hover:text-emerald-800 hover:font-bold focus:outline-none focus:ring active:outline-none">Sign in</button>
      </form>
    </Layout>
  );
}

// Cette fonction récupère le token CSRF pour la protection contre les attaques CSRF
export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      csrfToken: csrfToken || null,
    },
  };
}
