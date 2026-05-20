---
name: project-capautonomie
description: Architecture et état du projet CapAutonomie - app Next.js hackathon pour démarches administratives jeunes adultes
metadata:
  type: project
---

Application Next.js 16 (App Router) deployée dans `/home/lucca/TEK2/HACKATON/hackatton_arke/frontend/`.

**Pourquoi :** Hackathon, deadline 13h45. App simple et stable avant tout.

**Structure :**
- `app/page.tsx` — Landing F1 (static)
- `app/questionnaire/page.tsx` — Questionnaire F2 (client, 5 questions, useRouter)
- `app/resultats/page.tsx` — Resultats F3 (client, useSearchParams, Suspense)
- `app/sources/page.tsx` — Sources F4 (static, données issues de page_sources du JSON)
- `lib/types.ts` — Types TypeScript pour Demarche, Source, QuestionnaireReponses
- `lib/matching.ts` — Logique de filtrage statique (statut + logement + besoin)
- `data/demarches.json` — Copie du fichier data team (ne pas modifier)

**Navigation :** questionnaire passe les reponses en query params vers /resultats (`?statut=&logement=&ville=&besoin=&demarches_commencees=`)

**How to apply :** Toujours démarrer le dev server depuis le dossier `frontend/`, pas depuis la racine.
