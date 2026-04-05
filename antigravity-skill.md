# Antigravity - Guide des Fonctions et Configuration Optimale

## Qu'est-ce qu'Antigravity ?

Antigravity est l'IDE AI de Google integre avec Gemini. Ce fichier explique chaque
fonction et recommande les meilleurs reglages selon ton usage.

---

## 1. Security - Strict Mode

**Ce que ca fait :** Empeche l'agent d'executer des exploits automatiquement et
force une revue humaine pour chaque action.

**Recommandation :** **ACTIVER** pour les projets sensibles (prod, donnees privees).
Desactiver uniquement pour le prototypage rapide en local.

---

## 2. Artifact Review Policy

**Options :**
| Option | Comportement | Risque |
|--------|-------------|--------|
| Always Proceeds | L'agent ne demande jamais de validation | Eleve |
| Agent Decides | L'agent choisit selon la complexite | Moyen |
| Asks for Review | Toujours demander validation | Faible |

**Recommandation :** **Agent Decides** - bon equilibre entre autonomie et securite.
Utilise "Asks for Review" si tu debutes.

---

## 3. Terminal Command Auto Execution

**Options :**
- **Always Proceed** : Execute tout sans demander (sauf deny list)
- **Request Review** : Demande confirmation a chaque commande

**Recommandation :** **Request Review** + configurer les listes Allow/Deny :

### Allow List (commandes sures a auto-executer)
```
git status
git diff
git log
npm test
npm run lint
npm run build
python -m pytest
ls
cat
```

### Deny List (toujours demander confirmation)
```
rm -rf
git push --force
git reset --hard
docker rm
DROP TABLE
sudo
chmod 777
```

---

## 4. Shell Integration

**Ce que ca fait :** Permet a l'agent d'utiliser le terminal integre de l'IDE
pour detecter les resultats des commandes.

**Recommandation :** **ACTIVER** - ameliore la precision de l'agent. Redemarrer
l'application apres activation.

---

## 5. File Access

### Agent Gitignore Access
**Ce que ca fait :** Permet a l'agent de lire/modifier les fichiers listes dans .gitignore.

**Recommandation :** **DESACTIVER** - les fichiers .gitignore contiennent souvent
des secrets (.env, credentials, cles API).

### Agent Non-Workspace File Access
**Ce que ca fait :** Acces aux fichiers hors du workspace courant.

**Recommandation :** **DESACTIVER** - reduit la surface d'attaque. Activer
ponctuellement si necessaire.

### Auto-Open Edited Files
**Ce que ca fait :** Ouvre automatiquement les fichiers crees/modifies par l'agent.

**Recommandation :** **ACTIVER** - permet de voir en temps reel ce que l'agent fait.

---

## 6. Automation - Agent Auto-Fix Lints

**Ce que ca fait :** L'agent corrige automatiquement les erreurs de lint
qu'il a introduites.

**Recommandation :** **ACTIVER** - l'agent nettoie ses propres erreurs,
ca fait gagner du temps.

---

## 7. History - Conversation History

**Ce que ca fait :** L'agent accede aux conversations precedentes pour
mieux contextualiser ses reponses.

**Recommandation :** **ACTIVER** - ameliore la coherence sur un projet long.

---

## 8. Knowledge Base

**Ce que ca fait :** L'agent genere et consulte des items de connaissance
pour informer ses reponses.

**Recommandation :** **ACTIVER** - l'agent apprend les patterns de ton projet
et devient plus pertinent avec le temps.

---

## 9. General

### Explain and Fix in Current Conversation
**Recommandation :** **ACTIVER** - evite de perdre le contexte en ouvrant
une nouvelle conversation.

### Open Agent on Reload
**Recommandation :** **ACTIVER** si tu utilises l'agent frequemment.

### Enable Sounds
**Recommandation :** **ACTIVER** - utile pour les taches longues, tu sais
quand l'agent a fini.

### Auto-Expand Changes Overview
**Recommandation :** **ACTIVER** - voir immediatement ce qui a change.

---

## Configuration Recommandee Rapide

```
Strict Mode .............. OFF (ON pour la prod)
Artifact Review .......... Agent Decides
Terminal Execution ....... Request Review
Shell Integration ........ ON
Gitignore Access ......... OFF
Non-Workspace Access ..... OFF
Auto-Open Files .......... ON
Auto-Fix Lints ........... ON
Conversation History ..... ON
Knowledge Base ........... ON
Explain and Fix .......... ON
Open on Reload ........... ON
Sounds ................... ON
Auto-Expand Changes ...... ON
```

---

## Fonctions Cles a Utiliser

1. **Terminal Allow/Deny List** - La fonction la plus importante pour la securite.
   Configure-la en premier.

2. **Knowledge Base** - Laisse-la activee pour que l'agent apprenne ton code.

3. **Auto-Fix Lints** - Reduit le bruit et les allers-retours.

4. **Conversation History** - Essentiel pour les projets qui durent.

5. **Agent Decides (Artifacts)** - Le meilleur compromis autonomie/controle.
