/**
 * Header Component (App Router)
 * 
 * Shared header with navigation and authentication controls.
 * Client Component to use NextAuth session hooks.
 */

'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <header className="sticky top-0 z-50 flex flex-row p-4 justify-between items-center bg-black/10 backdrop-blur-sm border-b border-white/5">
      <nav className="flex items-center gap-6">
        <Link 
          href="/dashboard"
          className="hover:text-emerald-400 transition-colors"
        >
          Dashboard
        </Link>
        {isAuthenticated && (
          <>
            <Link 
              href="/liste"
              className="hover:text-emerald-400 transition-colors"
            >
              Projects
            </Link>
            <Link 
              href="/applications"
              className="text-emerald-400 font-medium"
            >
              Applications
            </Link>
          </>
        )}
      </nav>
      <nav className="flex items-center gap-6 text-sm">
        {!isAuthenticated ? (
          <button
            onClick={() => signIn()}
            className="inline-block shrink-0 rounded-md bg-emerald-800 px-4 py-1.5 text-sm font-semibold text-slate-300 transition-all ease-in duration-300 hover:bg-slate-300 hover:text-emerald-800 hover:font-bold focus:outline-none active:outline-none"
          >
            Sign In
          </button>
        ) : (
          <button
            onClick={() => signOut()}
            className="inline-block shrink-0 rounded-md bg-emerald-800 px-4 py-1.5 text-sm font-semibold text-slate-300 transition-all ease-in duration-300 hover:bg-slate-300 hover:text-emerald-800 hover:font-bold focus:outline-none active:outline-none"
          >
            Sign Out
          </button>
        )}
      </nav>
    </header>
  );
}
