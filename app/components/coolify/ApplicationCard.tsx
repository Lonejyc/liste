/**
 * ApplicationCard Component
 * 
 * Enhanced card component for displaying Coolify applications with action buttons.
 * Features: Deploy, Stop, Restart actions with loading states and error handling.
 */

'use client';

import { useState } from 'react';
import { FiExternalLink, FiGithub, FiPlay, FiSquare, FiRefreshCw, FiLoader } from 'react-icons/fi';
import StatusBadge from './StatusBadge';
import { CoolifyApplication } from '@/lib/types/coolify';
import toast from 'react-hot-toast';

interface ApplicationCardProps {
  app: CoolifyApplication;
  onActionComplete?: () => void;
}

const ApplicationCard = ({ app, onActionComplete }: ApplicationCardProps) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  // Parse status if it comes as "state:health" format
  const mainStatus = app.status?.split(':')[0] || 'unknown';

  /**
   * Trigger deployment for the application
   */
  const handleDeploy = async () => {
    setIsDeploying(true);
    
    try {
      const response = await fetch(`/api/coolify/applications/${app.uuid}/deploy`, {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Deployment failed');
      }

      toast.success(`Deployment started for ${app.name}`);
      
      // Refresh application list after action
      if (onActionComplete) {
        setTimeout(onActionComplete, 1000);
      }
    } catch (error: any) {
      toast.error(`Deploy failed: ${error.message}`);
      console.error('Deploy error:', error);
    } finally {
      setIsDeploying(false);
    }
  };

  /**
   * Stop the application
   */
  const handleStop = async () => {
    setIsStopping(true);
    
    try {
      const response = await fetch(`/api/coolify/applications/${app.uuid}/stop`, {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Stop failed');
      }

      toast.success(`${app.name} stopped`);
      
      if (onActionComplete) {
        setTimeout(onActionComplete, 1000);
      }
    } catch (error: any) {
      toast.error(`Stop failed: ${error.message}`);
      console.error('Stop error:', error);
    } finally {
      setIsStopping(false);
    }
  };

  /**
   * Restart the application
   */
  const handleRestart = async () => {
    setIsRestarting(true);
    
    try {
      const response = await fetch(`/api/coolify/applications/${app.uuid}/restart`, {
        method: 'POST',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Restart failed');
      }

      toast.success(`${app.name} restarting...`);
      
      if (onActionComplete) {
        setTimeout(onActionComplete, 1000);
      }
    } catch (error: any) {
      toast.error(`Restart failed: ${error.message}`);
      console.error('Restart error:', error);
    } finally {
      setIsRestarting(false);
    }
  };

  // Border color based on status
  const statusColors: Record<string, string> = {
    running: 'border-l-emerald-500 hover:border-emerald-500/50',
    stopped: 'border-l-red-500 hover:border-red-500/50',
    degraded: 'border-l-yellow-500 hover:border-yellow-500/50',
    restarting: 'border-l-blue-500 hover:border-blue-500/50',
    exited: 'border-l-slate-500 hover:border-slate-500/50',
    unknown: 'border-l-slate-500 hover:border-slate-500/50',
  };
  
  const borderColor = statusColors[mainStatus] || statusColors.unknown;

  return (
    <div
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
      {/* Header: Name + Status */}
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
        <StatusBadge status={mainStatus} size="md" />
      </div>

      {/* Info with icons */}
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
        {app.build_pack && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-slate-700/50 text-slate-300 font-mono border border-slate-600/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {app.build_pack}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleDeploy}
          disabled={isDeploying || isRestarting || isStopping}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 hover:border-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          title="Deploy application"
        >
          {isDeploying ? (
            <>
              <FiLoader className="animate-spin" />
              <span>Deploying...</span>
            </>
          ) : (
            <>
              <FiPlay />
              <span>Deploy</span>
            </>
          )}
        </button>

        <button
          onClick={handleRestart}
          disabled={isDeploying || isRestarting || isStopping || mainStatus === 'stopped'}
          className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 hover:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          title="Restart application"
        >
          {isRestarting ? (
            <FiLoader className="animate-spin" />
          ) : (
            <FiRefreshCw />
          )}
        </button>

        <button
          onClick={handleStop}
          disabled={isDeploying || isRestarting || isStopping || mainStatus === 'stopped'}
          className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          title="Stop application"
        >
          {isStopping ? (
            <FiLoader className="animate-spin" />
          ) : (
            <FiSquare />
          )}
        </button>
      </div>

      {/* Footer: Last Update */}
      {app.updated_at && (
        <div className="pt-3 mt-3 border-t border-slate-700/30 flex items-center justify-between text-xs text-slate-500">
          <span>Updated {new Date(app.updated_at).toLocaleDateString('en-US')}</span>
          <span className="text-slate-600">#{app.uuid.slice(0, 8)}</span>
        </div>
      )}

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
      </div>
    </div>
  );
};

export default ApplicationCard;
