# Antigravity - Configuration Rapide

## Comment configurer ?

Ces reglages se font dans **Antigravity > Settings** (icone engrenage en bas a gauche).
Il n'y a pas de fichier settings.json - tout se fait dans l'interface.

Le seul fichier de config est `C:\Users\<ton-user>\.gemini\antigravity\mcp_config.json`
qui gere les serveurs MCP (outils externes).

---

## Checklist - Coche chaque reglage dans l'UI

### Security
- [ ] Strict Mode → **OFF** (mettre ON pour un projet en production)

### Artifact
- [ ] Review Policy → **Agent Decides**

### Terminal
- [ ] Auto Execution → **Request Review**
- [ ] Shell Integration → **ON** (redemarrer apres)
- [ ] Allow List → copier-coller ces commandes une par une :
  ```
  git status
  git diff
  git log
  git branch
  git checkout
  git add
  git commit
  npm test
  npm run lint
  npm run build
  npm install
  npx
  ls
  cat
  pwd
  ```
- [ ] Deny List → copier-coller ces commandes une par une :
  ```
  rm -rf
  git push --force
  git reset --hard
  docker rm
  sudo
  chmod 777
  ```

### File Access
- [ ] Gitignore Access → **OFF** (protege tes .env et secrets)
- [ ] Non-Workspace Access → **OFF**
- [ ] Auto-Open Edited Files → **ON**

### Automation
- [ ] Auto-Fix Lints → **ON**

### History
- [ ] Conversation History → **ON**

### Knowledge
- [ ] Knowledge Base → **ON**

### General
- [ ] Explain and Fix in Current Conversation → **ON**
- [ ] Open Agent on Reload → **ON**
- [ ] Enable Sounds → **ON**
- [ ] Auto-Expand Changes Overview → **ON**

---

## Pourquoi ces choix ?

| Reglage | Pourquoi |
|---------|----------|
| Request Review (terminal) | Tu vois chaque commande avant execution |
| Allow List | Les commandes sures passent sans confirmation |
| Deny List | Les commandes dangereuses sont toujours bloquees |
| Gitignore OFF | Empeche l'agent de lire tes fichiers secrets |
| Auto-Fix Lints ON | L'agent corrige ses propres erreurs de code |
| Knowledge ON | L'agent apprend ton projet au fil du temps |
| Conversation History ON | Garde le contexte entre les sessions |

---

## Le fichier mcp_config.json

Le seul fichier de config que tu peux modifier est :
`C:\Users\sylmi\.gemini\antigravity\mcp_config.json`

Il sert a connecter des outils externes (GitHub, bases de donnees, APIs).
Ne touche pas a ce fichier sauf si tu ajoutes un nouveau serveur MCP.
