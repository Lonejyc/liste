// pages/api/auth.js
export default function handler(req, res) {
    const allowedIPs = ["82.66.241.186"];
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const password = 'admin'; // Utilisez des variables d'environnement pour les vrais projets

    if (!allowedIPs.includes(clientIP)) {
        return res.status(403).json({ message: "Access denied" });
    }

    if (req.method === 'POST') {
        const userPassword = req.body.password;
        if (userPassword === password) {
            req.session.isLogged = true;
            res.status(200).json({ message: "Authenticated" });
        } else {
            res.status(401).json({ message: "Unauthorized" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}