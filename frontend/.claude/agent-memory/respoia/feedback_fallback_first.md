---
name: feedback-fallback-first
description: Toujours afficher le texte statique immédiatement, LLM enrichit en arrière-plan
metadata:
  type: feedback
---

Quand le LLM est intégré dans un composant React, afficher le texte statique dès le clic, puis remplacer par le texte LLM quand il arrive (pattern "optimistic static").

Ne jamais bloquer l'UI en attendant le LLM. Ne jamais afficher un spinner vide.

**Why:** WiFi hackathon instable. Expérience dégradée inacceptable si l'API est lente. Le texte statique est déjà de bonne qualité.

**How to apply:** Pattern utilisé dans CarteDemarche et CapyChatSection : setState(staticText) → simplifyWithLLM().then(setState(llmText)).
