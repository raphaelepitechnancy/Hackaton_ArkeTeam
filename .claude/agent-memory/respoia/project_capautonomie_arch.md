---
name: project-capautonomie-arch
description: Architecture data du projet CapAutonomie — couche db.ts créée, seul point d'entrée vers demarches.json
metadata:
  type: project
---

Couche data `frontend/lib/db.ts` créée le 2026-05-20.

Expose 4 fonctions publiques :
- `getProcedures()` — toutes les démarches (anciennement lu directement depuis le JSON)
- `getSources()` — sources officielles avec démarches couvertes
- `getSourcesMeta()` — description, date_verification, note de la page sources
- `getMeta()` — métadonnées du dataset (version, auteur, sources_autorisees)

**Why:** Abstraction propre pour le jury hackathon : montrer qu'on pourrait brancher PostgreSQL/Supabase en production sans toucher à la logique métier.

**How to apply:** Tout import de `data/demarches.json` doit passer par `lib/db.ts`. Les composants et `lib/matching.ts` utilisent uniquement les fonctions de `lib/db.ts`.

Fichiers modifiés :
- `lib/db.ts` — créé (seul fichier qui importe le JSON)
- `lib/matching.ts` — remplacé import JSON par `getProcedures()` depuis db.ts
- `app/sources/page.tsx` — remplacé import JSON par `getSources()` et `getSourcesMeta()` depuis db.ts
- `app/resultats/page.tsx` — inchangé (passait déjà par `lib/matching.ts`)

Stratégie reformulation : statique (`explication_jeune` du JSON), zéro hallucination possible. Voir `lib/explanation.ts`.
