# Agent Memory — CapAutonomie / respoia

- [Couche LLM optionnelle](project_llm_layer.md) — lib/llm.ts créé, intégré dans CarteDemarche et CapyChatSection avec fallback statique garanti
- [Contraintes IA responsable](project_constraints.md) — ce que le LLM peut et ne peut pas faire (zéro hallucination sur droits sociaux)
- [Fallback-first pattern](feedback_fallback_first.md) — toujours afficher le statique immédiatement, LLM enrichit en arrière-plan
