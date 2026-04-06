# find-skills

Skill installé depuis [vercel-labs/skills](https://github.com/vercel-labs/skills) via le Skills CLI.

**Emplacement :** `~/.agents/skills/find-skills/` (symlinké vers Claude Code)

## Rôle

Aide à découvrir et installer des skills depuis l'écosystème open agent skills quand l'utilisateur demande :

- « comment faire X »
- « y a-t-il un skill pour X »
- « peux-tu faire X » (capacité spécialisée)
- ou exprime le besoin d'étendre les capacités de l'agent

## Skills CLI — commandes clés

```bash
npx skills find [query]     # chercher un skill
npx skills add <package>    # installer un skill
npx skills check            # vérifier les mises à jour
npx skills update           # mettre à jour tous les skills
```

Catalogue : <https://skills.sh/>

## Workflow recommandé

1. **Identifier** le domaine et la tâche précise.
2. **Consulter le leaderboard** sur skills.sh (skills populaires & éprouvés).
3. **Rechercher** via `npx skills find <query>` si besoin.
4. **Vérifier la qualité** : nb d'installs (préférer 1K+), source officielle (`vercel-labs`, `anthropics`, `microsoft`), étoiles GitHub.
5. **Présenter** les options (nom, description, installs, commande d'install, lien).
6. **Installer** avec confirmation :

   ```bash
   npx skills add <owner/repo@skill> -g -y
   ```

   - `-g` : installation globale (user-level)
   - `-y` : saute les prompts

## Catégories courantes

| Catégorie       | Exemples de requêtes                     |
| --------------- | ---------------------------------------- |
| Web Development | react, nextjs, typescript, css, tailwind |
| Testing         | testing, jest, playwright, e2e           |
| DevOps          | deploy, docker, kubernetes, ci-cd        |
| Documentation   | docs, readme, changelog, api-docs        |
| Code Quality    | review, lint, refactor, best-practices   |
| Design          | ui, ux, design-system, accessibility     |
| Productivity    | workflow, automation, git                |

## Installation de ce skill

```bash
npx skills add https://github.com/vercel-labs/skills --skill find-skills -g -y
```

## Si aucun skill n'existe

- Proposer de faire la tâche directement.
- Suggérer de créer son propre skill : `npx skills init <nom>`.
