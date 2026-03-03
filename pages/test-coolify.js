/**
 * Page: Test Coolify Connection
 * 
 * Page de test pour valider la connexion à l'API Coolify
 * et afficher la liste des applications avec leur statut.
 * 
 * Cette page sert de validation avant de construire l'interface complète.
 */

import { useState } from 'react';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import useSWR from 'swr';
import Layout from '@/components/Layout';
import StatusBadge from '@/components/coolify/StatusBadge';
import { FiRefreshCw, FiCheck, FiX, FiChevronDown, FiChevronUp, FiExternalLink, FiGithub } from 'react-icons/fi';

// Fetcher pour SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function TestCoolify() {
  const router = useRouter();
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  // Fetch data avec SWR (auto-refresh, cache, etc.)
  const { data, error, isLoading, mutate } = useSWR('/api/coolify/test', fetcher, {
    refreshInterval: 0, // Pas d'auto-refresh (refresh manuel seulement)
    revalidateOnFocus: false,
  });

  // Handler pour refresh manuel
  const handleRefresh = () => {
    mutate();
  };

  return (
    <Layout title="Test Connexion Coolify">
      <div className="w-full max-w-6xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-100 mb-2">
              🔌 Test Connexion Coolify
            </h1>
            <p className="text-slate-400 text-sm">
              Validation de la connexion à l&apos;API Coolify et affichage des applications
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
            Rafraîchir
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <FiRefreshCw className="text-4xl text-emerald-500 animate-spin" />
              <p className="text-slate-300">Connexion à Coolify en cours...</p>
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
                  Erreur de connexion
                </h3>
                <p className="text-red-300 mb-4">
                  Impossible de se connecter à l&apos;API Coolify. Vérifiez votre configuration.
                </p>
                
                {/* Bouton pour afficher les détails */}
                <button
                  onClick={() => setShowErrorDetails(!showErrorDetails)}
                  className="inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  {showErrorDetails ? <FiChevronUp /> : <FiChevronDown />}
                  {showErrorDetails ? 'Masquer' : 'Voir'} les détails techniques
                </button>

                {/* Détails de l'erreur (collapsible) */}
                {showErrorDetails && (
                  <div className="mt-4 p-4 bg-slate-900/50 rounded border border-red-500/20">
                    <p className="text-xs text-slate-400 font-mono">
                      {error.message || 'Erreur inconnue'}
                    </p>
                    {data?.details && (
                      <pre className="mt-2 text-xs text-slate-500 overflow-x-auto">
                        {JSON.stringify(data.details, null, 2)}
                      </pre>
                    )}
                  </div>
                )}

                {/* Suggestions */}
                <div className="mt-4 text-sm text-slate-400">
                  <p className="font-medium mb-2">💡 Suggestions :</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Vérifiez que COOLIFY_API_URL est correct dans .env.local</li>
                    <li>Vérifiez que COOLIFY_API_TOKEN est valide</li>
                    <li>Vérifiez que votre instance Coolify est accessible</li>
                    <li>Testez avec : curl https://your-instance.com/api/v1/version</li>
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
            <div className="bg-emerald-900/20 backdrop-blur-sm border border-emerald-500/30 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <FiCheck className="text-2xl text-emerald-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-1">
                    Connecté à Coolify
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                    {data.version && (
                      <span>Version : <span className="font-mono text-emerald-400">{data.version}</span></span>
                    )}
                    <span className="text-slate-500">•</span>
                    <span>Applications : <span className="font-semibold text-emerald-400">{data.count}</span></span>
                    <span className="text-slate-500">•</span>
                    <span className="text-xs text-slate-500">
                      Dernière màj : {new Date(data.timestamp).toLocaleTimeString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Applications List */}
            <div>
              <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
                📦 Applications
                <span className="text-sm font-normal text-slate-500">({data.count})</span>
              </h2>

              {data.count === 0 ? (
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8 text-center">
                  <p className="text-slate-400">Aucune application trouvée dans Coolify.</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Créez votre première application depuis le dashboard Coolify.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.applications.map((app) => {
                    // Déterminer la couleur de bordure selon le status
                    const statusColors = {
                      running: 'border-l-emerald-500 hover:border-emerald-500/50',
                      stopped: 'border-l-red-500 hover:border-red-500/50',
                      degraded: 'border-l-yellow-500 hover:border-yellow-500/50',
                      restarting: 'border-l-blue-500 hover:border-blue-500/50',
                      exited: 'border-l-slate-500 hover:border-slate-500/50',
                      unknown: 'border-l-slate-500 hover:border-slate-500/50',
                    };
                    
                    const borderColor = statusColors[app.status] || statusColors.unknown;
                    
                    return (
                      <div
                        key={app.uuid}
                        className={`
                          group relative
                          bg-gradient-to-br from-slate-800/50 to-slate-900/50 
                          backdrop-blur-sm 
                          border-l-4 border-t border-r border-b
                          border-slate-700/50
                          ${borderColor}
                          rounded-lg p-6
                          hover:shadow-xl hover:shadow-emerald-500/5
                          transition-all duration-300
                          hover:-translate-y-1
                        `}
                      >
                        {/* Header: Nom + Status */}
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-slate-100 truncate mb-1 group-hover:text-emerald-400 transition-colors">
                              {app.name}
                            </h3>
                            {app.description && (
                              <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                                {app.description}
                              </p>
                            )}
                          </div>
                          <StatusBadge status={app.status} size="md" />
                        </div>

                        {/* Infos avec icônes */}
                        <div className="space-y-3 text-sm mb-4">
                          {/* FQDN */}
                          {app.fqdn && (
                            <div className="flex items-center gap-2.5 text-slate-400 group/link">
                              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded bg-emerald-500/10 text-emerald-400">
                                <FiExternalLink className="text-xs" />
                              </div>
                              <a
                                href={app.fqdn}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate hover:text-emerald-400 transition-colors font-medium"
                              >
                                {app.fqdn.replace(/^https?:\/\//, '')}
                              </a>
                            </div>
                          )}

                          {/* Git Repository */}
                          {app.git_repository && (
                            <div className="flex items-center gap-2.5 text-slate-400">
                              <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded bg-slate-500/10 text-slate-400">
                                <FiGithub className="text-xs" />
                              </div>
                              <span className="truncate text-xs font-mono">
                                {app.git_repository.split('/').slice(-2).join('/')}
                                {app.git_branch && (
                                  <span className="ml-1 text-emerald-400">
                                    @ {app.git_branch}
                                  </span>
                                )}
                              </span>
                            </div>
                          )}

                          {/* Build Pack Badge */}
                          {app.build_pack && app.build_pack !== 'unknown' && (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-slate-700/50 text-slate-300 font-mono border border-slate-600/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                {app.build_pack}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Footer: Last Update */}
                        {app.updated_at && (
                          <div className="pt-3 mt-3 border-t border-slate-700/30 flex items-center justify-between text-xs text-slate-500">
                            <span>Màj {new Date(app.updated_at).toLocaleDateString('fr-FR')}</span>
                            <span className="text-slate-600">#{app.uuid.slice(0, 8)}</span>
                          </div>
                        )}

                        {/* Hover Glow Effect */}
                        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
                        </div>
                      </div>
                    );
                  })}
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
                  Connexion échouée
                </h3>
                <p className="text-red-300 mb-4">
                  {data.error || 'Une erreur est survenue lors de la connexion à Coolify.'}
                </p>
                
                <button
                  onClick={() => setShowErrorDetails(!showErrorDetails)}
                  className="inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  {showErrorDetails ? <FiChevronUp /> : <FiChevronDown />}
                  {showErrorDetails ? 'Masquer' : 'Voir'} les détails techniques
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

        {/* Back Button */}
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/')}
            className="text-slate-400 hover:text-slate-300 text-sm transition-colors"
          >
            ← Retour au dashboard
          </button>
        </div>
      </div>
    </Layout>
  );
}

/**
 * Server-Side Props
 * Vérifier l'authentification avant de charger la page
 */
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // Rediriger vers sign in si non authentifié
  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
