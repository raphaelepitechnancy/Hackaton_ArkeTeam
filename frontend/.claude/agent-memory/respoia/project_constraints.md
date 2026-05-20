---
name: project-constraints
description: Contraintes IA responsable strictes pour CapAutonomie — ce que le LLM peut et ne peut pas faire
metadata:
  type: project
---

Le LLM ne peut QUE reformuler des textes existants issus du JSON officiel.

Interdit absolu :
- Ajouter une démarche absente du JSON
- Décider d'une éligibilité ("tu as droit à...")
- Inventer une condition
- Remplacer la logique de matching (`lib/matching.ts`)
- Parler au-delà des données fournies

Toujours rappeler : les sources officielles font foi. L'utilisateur doit vérifier sur le lien officiel.

**Why:** Projet hackathon CapAutonomie pour jeunes adultes (18-25 ans) — le risque d'hallucination sur des droits sociaux est élevé et potentiellement dommageable.

**How to apply:** Tout nouveau usage du LLM doit respecter ces contraintes. Le system prompt de `lib/llm.ts` les encode déjà — ne pas le modifier sans validation.
