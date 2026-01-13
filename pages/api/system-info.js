export default async function handler(req, res) {
  try {
    const response = await fetch('https://monitor-agent.jocelynmarcilloux.com/api/stats');
    const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Agent de monitoring injoignable sur le réseau interne" });
    }
}