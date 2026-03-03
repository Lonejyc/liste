/**
 * App Router - Home Page
 * 
 * Page d'accueil du dashboard Coolify Control Plane.
 * Temporairement, redirige vers /test-coolify (Pages Router)
 * En attendant la migration complète.
 */

import { redirect } from 'next/navigation';

export default function HomePage() {
  // Temporairement, rediriger vers la page test en Pages Router
  redirect('/test-coolify');
}
