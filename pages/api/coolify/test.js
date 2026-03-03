/**
 * API Route: Test Coolify Connection
 * 
 * GET /api/coolify/test
 * 
 * Teste la connexion à l'API Coolify et retourne :
 * - Version de Coolify
 * - Liste des applications avec leur statut
 * - Informations de connexion
 * 
 * Cette route combine plusieurs appels API Coolify en un seul endpoint
 * pour simplifier le frontend et optimiser les performances.
 */

import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

const COOLIFY_API_URL = process.env.COOLIFY_API_URL;
const COOLIFY_TOKEN = process.env.COOLIFY_API_TOKEN;

/**
 * Helper pour faire des requêtes à l'API Coolify
 */
async function coolifyFetch(endpoint) {
  if (!COOLIFY_API_URL || !COOLIFY_TOKEN) {
    throw new Error('Coolify API not configured. Check your .env.local');
  }

  const url = `${COOLIFY_API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${COOLIFY_TOKEN}`,
      'Accept': 'application/json',
    },
    // Timeout après 15 secondes
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Coolify API Error (${response.status}): ${errorText}`);
  }

  return response.json();
}

export default async function handler(req, res) {
  // Vérifier l'authentification
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ 
      connected: false,
      error: 'Unauthorized. Please sign in first.' 
    });
  }

  // Seule méthode autorisée : GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔌 Testing Coolify connection...');

    // Appel 1 : Récupérer la version Coolify
    let version = null;
    try {
      const versionData = await coolifyFetch('/version');
      version = versionData.version || versionData;
      console.log('✅ Coolify version:', version);
    } catch (error) {
      console.warn('⚠️ Could not fetch version:', error.message);
      // Continuer même si version échoue
    }

    // Appel 2 : Récupérer toutes les applications
    const applicationsData = await coolifyFetch('/applications');
    console.log(`✅ Found ${applicationsData.length || 0} applications`);
    
    // Debug: Log première app pour voir la structure exacte
    if (applicationsData.length > 0) {
      console.log('📊 First app structure:', JSON.stringify(applicationsData[0], null, 2));
    }

    // Formater les données pour le frontend
    const applications = (applicationsData || []).map(app => {
      // Parse le status : Coolify retourne "running:unhealthy" ou "exited:healthy"
      // On garde seulement la première partie (running, exited, stopped, etc.)
      let status = 'unknown';
      if (app.status) {
        status = app.status.split(':')[0]; // Prendre seulement la partie avant ":"
      }
      
      console.log(`🔍 App "${app.name}" - raw status: "${app.status}" → parsed: "${status}"`);
      
      return {
        uuid: app.uuid,
        name: app.name,
        description: app.description || null,
        status: status,
        health: app.status ? app.status.split(':')[1] : null, // healthy/unhealthy
        fqdn: app.fqdn || null,
        git_repository: app.git_repository || null,
        git_branch: app.git_branch || null,
        build_pack: app.build_pack || 'unknown',
        updated_at: app.updated_at || null,
      };
    });

    // Réponse réussie
    return res.status(200).json({
      connected: true,
      version: version,
      timestamp: new Date().toISOString(),
      applications: applications,
      count: applications.length,
    });

  } catch (error) {
    console.error('❌ Coolify API Error:', error);

    // Déterminer le type d'erreur
    let errorType = 'unknown';
    let statusCode = 500;

    if (error.name === 'AbortError' || error.message.includes('timeout')) {
      errorType = 'timeout';
      statusCode = 408;
    } else if (error.message.includes('not configured')) {
      errorType = 'configuration';
      statusCode = 500;
    } else if (error.message.includes('401') || error.message.includes('403')) {
      errorType = 'authentication';
      statusCode = 401;
    } else if (error.message.includes('fetch') || error.message.includes('ECONNREFUSED')) {
      errorType = 'network';
      statusCode = 503;
    }

    // Réponse d'erreur
    return res.status(statusCode).json({
      connected: false,
      error: error.message,
      errorType: errorType,
      timestamp: new Date().toISOString(),
      details: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
    });
  }
}
