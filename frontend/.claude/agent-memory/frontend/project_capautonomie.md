---
name: project-capautonomie
description: Contexte du projet CapAutonomie — app Next.js d'aide aux démarches administratives pour jeunes en voie d'autonomie
metadata:
  type: project
---

CapAutonomie est une application Next.js (frontend seul) qui guide les jeunes dans leurs démarches administratives (CAF, Sécu, logement, etc.).

Stack : Next.js "use client", Tailwind, CSS custom via globals.css avec variables CSS (`--color-primary`, `--color-p1`, etc.).

**Structure principale :**
- `app/resultats/page.tsx` — page résultats personnalisés après questionnaire
- `app/globals.css` — design system complet (variables, composants .btn-primary, .card-demarche, .badge, etc.)
- `lib/matching.ts` — logique de recommandation des démarches
- `lib/explanation.ts` — textes d'explication statiques par démarche
- `lib/types.ts` — types TypeScript (Demarche, QuestionnaireReponses)

**Composant CapyChatSection ajouté** sur `app/resultats/page.tsx` : bloc conversationnel statique (4 boutons rapides, réponses prédéfinies, zéro LLM). Placé après les sections P1/P2 et avant le bas de page.

**Why:** Hackathon — impact démo maximal, ajout isolé sans toucher au reste.
**How to apply:** Toujours garder les composants inline dans page.tsx pour ce projet (structure légère hackathon), styles dans globals.css.
