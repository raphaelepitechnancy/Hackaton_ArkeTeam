---
name: project-capautonomie
description: Contexte du projet CapAutonomie — hackathon IA, démarches administratives pour jeunes adultes 18-25 ans
metadata:
  type: project
---

Projet CapAutonomie : guide des démarches administratives pour jeunes adultes 18-25 ans.
Stack : Next.js (frontend), TypeScript, Tailwind/CSS custom.

Fichiers clés :
- `frontend/lib/explanation.ts` : fonction `getExplanation()` et `getExplicationBloc()` — Stratégie 1 statique retenue
- `frontend/lib/matching.ts` : filtrage et tri des démarches selon le profil questionnaire
- `frontend/lib/types.ts` : interface `Demarche` (inclut `explication_jeune`, `lien_officiel`, `source`)
- `frontend/data/demarches.json` : 10 démarches, toutes avec `explication_jeune` rédigé
- `frontend/app/resultats/page.tsx` : composant `CarteDemarche` avec toggle "Explique-moi simplement"

**Why:** Hackathon, deadline BLOC 2 à 12h30. Stabilité prioritaire sur sophistication.

**How to apply:** Stratégie 1 statique validée et en prod. Ne pas introduire d'appel LLM sans gate strict (30 min de test max). Toujours citer la source officielle dans l'encart explication.
