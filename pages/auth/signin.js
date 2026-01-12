// pages/auth/signin.js
import { getCsrfToken } from "next-auth/react";
import Layout from "../../components/Layout";
import { HiOutlineUser, HiOutlineLockClosed } from "react-icons/hi2";
import { FiLogIn } from "react-icons/fi";

export default function SignIn({ csrfToken }) {
  return (
    <Layout title="Connexion">
      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-900/30 border border-emerald-800/50 mb-4">
            <FiLogIn className="text-3xl text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-2">Please enter your details to sign in</p>
        </div>

        <form method="post" action="/api/auth/callback/credentials" className="space-y-6">
          <input name='csrfToken' type='hidden' defaultValue={csrfToken || null}/>

          <div className="space-y-2">
            <label htmlFor="username" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
              Username
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                <HiOutlineUser className="text-xl" />
              </span>
              <input
                name="username"
                type="text"
                placeholder="admin"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-950/50 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
              Password
            </label>
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                <HiOutlineLockClosed className="text-xl" />
              </span>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700 bg-slate-950/50 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-sm font-bold text-slate-100 transition-all hover:bg-emerald-600 hover:shadow-[0_0_20px_rgba(5,150,105,0.4)] active:scale-[0.98]"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-500 italic">
          Authorized personnel only
        </p>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { error } = context.query;
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      csrfToken: csrfToken || null,
      error: error || null,
    },
  };
}