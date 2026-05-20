---
name: project-capautonomie
description: Contexte produit, design system et décisions visuelles pour CapAutonomie (hackathon)
metadata:
  type: project
---

Projet CapAutonomie — hackathon, deadline polish UI à 13h00.

**Cible** : jeunes adultes 18-25 ans perdus face aux démarches administratives.
**Stack** : Next.js 16 (Turbopack) + Tailwind CSS v4 — attention, APIs Tailwind v4 diffèrent des versions précédentes.

**Palette choisie — Option A : Bleu + Vert**
- Primaire   : #2563EB (bleu confiant)
- P1 Urgent  : #10B981 (vert tendre) — badges verts, border vert sur cartes P1
- P2 Important : #F59E0B (ambre)
- Fond       : #F9FAFB, Surface : #FFFFFF
- Texte fort : #111827, Texte soft : #6B7280

**Fonte** : Inter (Google Fonts, importée en premier dans globals.css avant @import tailwindcss)

**Design system** : toutes les variables CSS sont dans `globals.css` sous forme de `--color-*`.
Les classes utilitaires custom (`.btn-primary`, `.btn-outline`, `.card-demarche`, `.badge`, `.badge-p1`, `.badge-p2`, `.badge-p3`, `.option-card`, `.input-text`, `.encart-explication`, `.encart-limite`, `.numero-section`, `.progress-bar-track`, `.progress-bar-fill`) sont définies dans `globals.css`.

**Pages** : 4 pages dans `frontend/app/` — `page.tsx` (landing), `questionnaire/page.tsx`, `resultats/page.tsx`, `sources/page.tsx`.

**Why:** hackathon court, on privilégie cohérence et lisibilité sur originalité.
**How to apply:** toujours utiliser les variables CSS `--color-*` pour rester cohérent. Ne pas ajouter de nouvelles couleurs sans modifier aussi `globals.css`.
