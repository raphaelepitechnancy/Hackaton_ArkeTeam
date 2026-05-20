---
name: feedback-design-approche
description: Règles de design validées pour CapAutonomie — ce qu'on fait et ce qu'on évite
metadata:
  type: feedback
---

Ne pas utiliser de classes Tailwind couleur pour les couleurs du design system — utiliser les variables CSS `--color-*` en style inline ou via les classes custom de globals.css.

**Why:** Tailwind v4 gère les couleurs différemment de v3. Les variables CSS garantissent la cohérence sur toutes les pages sans risque de purge.
**How to apply:** Dès qu'on touche une couleur, passer par `style={{ color: "var(--color-primary)" }}` ou ajouter une classe dans globals.css.

---

Garder les icônes inline SVG minimalistes (stroke, pas fill) plutôt que d'importer une lib d'icônes.

**Why:** pas de dépendance supplémentaire, build plus rapide, hackathon = contrainte temps.
**How to apply:** copier les petits SVG directement dans le JSX comme composants fonctionnels locaux.

---

L'ordre dans globals.css doit être : @import Google Fonts EN PREMIER, puis @import tailwindcss.

**Why:** le compilateur CSS exige que les @import de polices précèdent @import tailwindcss, sinon warning de build.
**How to apply:** vérifier cet ordre à chaque modification de globals.css.
