// pages/auth/signin.js
import { getCsrfToken } from "next-auth/react";

export default function SignIn({ csrfToken }) {
  return (
    <form method="post" action="/api/auth/callback/credentials" className="mt-8 grid grid-cols-6 gap-6 justify-self-center">
      <input name='csrfToken' type='hidden' defaultValue={csrfToken}/>
      <div className="col-span-6">
        <label htmlFor="username" className="block text-lg font-medium text-gray-700">Username</label>
        <input name="username" type="text" className="mt-1 w-1/4 rounded-md border border-gray-400 bg-white text-lg text-gray-700 shadow-sm p-1" />
      </div>
      <div className="col-span-6">
        <label htmlFor="Password" className="block text-lg font-medium text-gray-700">Password</label>
        <input name="password" type="password" className="mt-1 w-1/4 rounded-md border border-gray-400 bg-white text-lg text-gray-700 shadow-sm p-1" />
      </div>
      <button type="submit" className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-lg font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500">Sign in</button>
    </form>
  );
}

// Cette fonction récupère le token CSRF pour la protection contre les attaques CSRF
export async function getServerSideProps(context) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
