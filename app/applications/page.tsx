/**
 * Applications Page (App Router)
 * 
 * Main dashboard for managing Coolify applications.
 * Features:
 * - Real-time application list with SWR
 * - Deploy/Stop/Restart actions
 * - Status badges and visual indicators
 * - Responsive grid layout
 * 
 * This replaces the Pages Router /test-coolify page with enhanced functionality.
 */

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { FiLoader, FiCheck, FiX, FiChevronDown, FiChevronUp, FiPackage, FiAlertCircle } from 'react-icons/fi';
import { Toaster } from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ApplicationCard from '../components/coolify/ApplicationCard';
import { useCoolifyApplications } from '../hooks/useCoolifyApplications';

export default function ApplicationsPage() {
  const { data: session, status } = useSession();
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  // Redirect to sign in if not authenticated
  if (status === 'unauthenticated') {
    redirect('/api/auth/signin');
  }

  // Fetch applications with custom hook
  const { data, error, isLoading, mutate } = useCoolifyApplications();

  /**
   * Handle action completion
   * Revalidates the applications list after an action (deploy/stop/restart)
   */
  const handleActionComplete = () => {
    mutate();
  };

  return (
    <div className="min-h-screen bg-grain-background bg-cover text-slate-300 flex flex-col">
      <Header />
      <Toaster position="top-right" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-100 mb-2">
              Coolify Applications
            </h1>
            <p className="text-slate-400">
              Manage your applications with enhanced controls
            </p>
          </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <FiLoader className="animate-spin text-4xl text-emerald-500 mx-auto mb-4" />
              <p className="text-slate-400">Connecting to Coolify...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <FiX className="text-2xl text-red-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-400 mb-2">
                  Connection Failed
                </h3>
                <p className="text-red-300 mb-4">
                  {error.message || 'An error occurred while connecting to Coolify.'}
                </p>

                <div className="mt-4 text-sm text-slate-400">
                  <div className="flex items-center gap-2 mb-2">
                    <FiAlertCircle className="text-yellow-500" />
                    <p className="font-medium">Suggestions:</p>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs ml-6">
                    <li>Verify that COOLIFY_API_URL is correct in .env.local</li>
                    <li>Verify that COOLIFY_API_TOKEN is valid</li>
                    <li>Verify that your Coolify instance is accessible</li>
                    <li>Test with: curl https://your-instance.com/api/v1/version</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {data && data.connected && (
          <>
            {/* Connection Status Card */}
            <div className="bg-emerald-900/20 backdrop-blur-sm border border-emerald-500/30 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <FiCheck className="text-2xl text-emerald-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-1">
                    Connected to Coolify
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                    {data.version && (
                      <span>
                        Version: <span className="font-mono text-emerald-400">{data.version}</span>
                      </span>
                    )}
                    <span className="text-slate-500">•</span>
                    <span>
                      Applications: <span className="font-semibold text-emerald-400">{data.count}</span>
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-xs text-slate-500">
                      Last update: {new Date(data.timestamp).toLocaleTimeString('en-US')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Applications List */}
            <div>
              <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                <FiPackage className="text-emerald-400" />
                Applications
                <span className="text-sm font-normal text-slate-500">({data.count})</span>
              </h2>

              {data.count === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8 text-center">
                  <p className="text-slate-400">No applications found in Coolify.</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Create your first application from the Coolify dashboard.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.applications.map((app) => (
                    <ApplicationCard
                      key={app.uuid}
                      app={app}
                      onActionComplete={handleActionComplete}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Error State (API returned connected: false) */}
        {data && !data.connected && !error && (
          <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <FiX className="text-2xl text-red-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-400 mb-2">
                  Connection Failed
                </h3>
                <p className="text-red-300 mb-4">
                  {data.error || 'An error occurred while connecting to Coolify.'}
                </p>

                <button
                  onClick={() => setShowErrorDetails(!showErrorDetails)}
                  className="inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  {showErrorDetails ? <FiChevronUp /> : <FiChevronDown />}
                  {showErrorDetails ? 'Hide' : 'Show'} technical details
                </button>

                {showErrorDetails && data.details && (
                  <div className="mt-4 p-4 bg-slate-900/50 rounded border border-red-500/20">
                    <pre className="text-xs text-slate-400 overflow-x-auto">
                      {JSON.stringify(data.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
