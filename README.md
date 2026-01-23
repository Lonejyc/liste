# 🎛️ Liste - Personal Server Dashboard

Un dashboard centralisé pour monitorer, gérer et accéder rapidement à l'ensemble des projets et services hébergés sur mon serveur personnel (Coolify).

Ce projet sert de "Homepage" administrative, offrant une vue d'ensemble sur l'état des déploiements (Web & Mobile).

## ⚡ Stack Technique

* **Framework :** [Next.js 14](https://nextjs.org/) (React)
* **Styling :** Tailwind CSS
* **Authentification :** NextAuth.js (Sécurisation de l'accès au dashboard)
* **Monitoring Système :** `systeminformation` & API interne
* **Icons :** React Icons (Feather/FontAwesome)

## 🚀 Fonctionnalités

### Actuelles
* **Project Matrix :** Liste visuelle des projets sous forme de cartes.
* **Status Indicators :** Badges d'état manuel (ONLINE, DEV, OFFLINE) définis dans `data/projects.json`.
* **Tech Stack Badges :** Visualisation rapide des technologies utilisées par projet (Symfony, Next, etc.).
* **Quick Launch :** Liens directs vers les environnements de production ou les repos GitHub.
* **Agent Connection :** Tentative de connexion à un agent de monitoring local via `pages/api/system-info.js`.

### 🚧 Roadmap & Monitoring (WIP)
L'objectif est d'étendre ce dashboard pour en faire un véritable outil de **Health Check** en temps réel pour l'infrastructure Coolify :

- [ ] **Ping & Latency :** Affichage en temps réel du ping (ms) pour chaque service.
- [ ] **Uptime Automatisé :** Vérification périodique du code HTTP (200 OK) pour remplacer les status manuels.
- [ ] **Server Stats :** Visualisation CPU/RAM/Disk du serveur hôte.
- [ ] **Docker Integration :** État des conteneurs via l'API Docker/Coolify.

## 🛠️ Installation & Développement

### Pré-requis
* Node.js 18+
* Un serveur (VPS/Dedicated) ou un environnement local.

### Setup

1.  **Cloner le repo :**
    ```bash
    git clone <votre-repo-url>
    cd liste
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```

3.  **Configuration d'environnement (.env.local) :**
    Créez un fichier `.env.local` à la racine :
    ```env
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=votre_secret_super_securise
    # URL de l'agent de monitoring (optionnel, voir api/system-info.js)
    MONITOR_AGENT_URL=[http://10.0.1.11:5000/api/stats](http://10.0.1.11:5000/api/stats)
    ```

4.  **Lancer en dev :**
    ```bash
    npm run dev
    ```

## 📂 Structure des Données

Les projets affichés sont gérés via le fichier `data/projects.json`.
Format actuel :

```json
{
  "id": "nom-projet",
  "title": "Titre Affiché",
  "description": "Courte description...",
  "tech": ["Next", "Tailwind"],
  "status": "ONLINE", // ONLINE | DEV | OFFLINE
  "link": "[https://url-du-projet.com](https://url-du-projet.com)"
}