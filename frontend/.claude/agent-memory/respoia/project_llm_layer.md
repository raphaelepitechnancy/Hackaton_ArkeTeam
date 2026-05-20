---
name: project-llm-layer
description: Couche LLM optionnelle ajoutée dans lib/llm.ts — reformulation OpenAI avec fallback statique garanti
metadata:
  type: project
---

Fichier `lib/llm.ts` créé avec `simplifyWithLLM()` et `isLLMAvailable()`.

Intégré dans `app/resultats/page.tsx` :
- `CarteDemarche` : bouton "Explique-moi simplement" appelle le LLM, affiche le statique en attendant
- `CapyChatSection` : chaque question Capy tente le LLM, fallback immédiat sur le texte statique

**Why:** IA responsable — l'API est un plus, pas une dépendance. Zéro crash si clé absente ou OpenAI down. Attribution transparente ("Reformulé par IA" vs "Explication contrôlée").

**How to apply:** Si on ajoute d'autres composants avec du texte reformulable, importer `simplifyWithLLM` depuis `lib/llm.ts` et toujours passer le texte statique en `fallback`.
