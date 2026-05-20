/**
 * explanation.ts — CapAutonomie
 *
 * Stratégie retenue : Stratégie 1 (statique).
 *
 * Pourquoi ce choix :
 * - Zéro dépendance réseau : fiable même si le WiFi du hackathon lâche.
 * - Zéro hallucination possible : le texte est issu directement du JSON
 *   dont toutes les entrées ont été rédigées à partir de sources officielles.
 * - Réponse instantanée (< 1 ms), pas de spinner, pas d'état d'erreur.
 * - Les champs `explication_jeune` respectent déjà les critères IA responsable :
 *   langage simple, verbe d'action, lien source cité.
 *
 * En production, on pourrait enrichir avec getExplanationLLM() en fallback
 * vers getExplanation() si l'API est indisponible ou dépasse 2 s.
 *
 * IMPORTANT : les sources officielles font toujours foi.
 * L'explication affichée est indicative — l'utilisateur doit vérifier
 * sur le lien officiel de l'organisme.
 */

import type { Demarche } from "./types";

/**
 * Retourne l'explication en langage simple pour une démarche.
 *
 * Cascade de fallback :
 *   1. explication_jeune   (texte court, action concrète, sans jargon)
 *   2. description_simple  (phrase courte déjà présente sur la carte)
 *   3. Texte générique neutre (ne doit jamais être affiché en pratique)
 */
export function getExplanation(demarche: Demarche): string {
  if (demarche.explication_jeune && demarche.explication_jeune.trim().length > 0) {
    return demarche.explication_jeune;
  }
  if (demarche.description_simple && demarche.description_simple.trim().length > 0) {
    return demarche.description_simple;
  }
  // Cas de garde — ne devrait pas survenir avec le JSON actuel
  return "Pour plus d'informations, consulte directement le site officiel.";
}

/**
 * Construit le texte complet affiché dans l'encart "Explique-moi simplement".
 * Sépare le corps de l'explication de la mention source pour que le composant
 * puisse rendre le lien comme un vrai <a> cliquable.
 */
export interface ExplicationBloc {
  texte: string;
  source: string;
  lien_officiel: string;
}

export function getExplicationBloc(demarche: Demarche): ExplicationBloc {
  return {
    texte: getExplanation(demarche),
    source: demarche.source,
    lien_officiel: demarche.lien_officiel,
  };
}
