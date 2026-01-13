export default async function handler(req, res) {
  const agentUrl = process.env.MONITOR_AGENT_URL || 'http://monitor-agent:5000/api/stats';

  console.log(`[API System-Info] Tentative de connexion à l'agent: ${agentUrl}`);

  try {
    const response = await fetch(agentUrl, { signal: AbortSignal.timeout(5000) }); // Timeout après 5s

    if (!response.ok) {
      console.error(`[API System-Info] L'agent a répondu avec un statut: ${response.status}`);
      throw new Error(`Statut agent: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[API System-Info] Données reçues avec succès de l'agent.`);
    res.status(200).json(data);
  } catch (error) {
    console.error(`[API System-Info] ERREUR de connexion:`, error.message);
    res.status(500).json({
      error: "Agent de monitoring injoignable",
      details: error.message,
      attemptedUrl: agentUrl
    });
  }
}