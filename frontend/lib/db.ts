/**
 * lib/db.ts — CapAutonomie
 *
 * Couche data isolée. Actuellement sourcée depuis un JSON local
 * (data/demarches.json) validé sur les sources officielles.
 *
 * Pourquoi cette abstraction :
 * - La logique métier (matching, affichage) ne connaît plus la forme
 *   de stockage des données. Elle appelle getProcedures() ou getSources().
 * - En production, remplacer le contenu des fonctions par des appels
 *   PostgreSQL / Supabase ne changerait rien aux composants ni au matching.
 * - Zéro hallucination : les données sont statiques et validées
 *   manuellement sur les sources officielles listées dans meta.sources_autorisees.
 *
 * IMPORTANT : les sources officielles font toujours foi.
 * Ces données sont indicatives. L'utilisateur doit vérifier sur le
 * site officiel de l'organisme avant d'engager une démarche.
 */

import rawData from "../data/demarches.json";

// ---------------------------------------------------------------------------
// Types publics
// ---------------------------------------------------------------------------

export interface Procedure {
  id: string;
  titre: string;
  categorie: string;
  description_simple: string;
  pour_qui: string[];
  conditions: string[];
  documents: string[];
  priorite: 1 | 2 | 3;
  lien_officiel: string;
  source: string;
  explication_jeune: string;
  checklist_actions?: string[];
}

export interface SourceEntry {
  nom: string;
  url: string;
  description: string;
  demarches_couvertes: string[];
}

export interface DataMeta {
  version: string;
  date_creation: string;
  auteur: string;
  description: string;
  sources_autorisees: string[];
}

// ---------------------------------------------------------------------------
// 1. getProcedures() — retourne toutes les démarches
// ---------------------------------------------------------------------------

/**
 * Retourne la liste complète des démarches.
 *
 * Contrat : les objets retournés sont conformes à l'interface Procedure.
 * En production, ce serait un SELECT * FROM procedures.
 */
export function getProcedures(): Procedure[] {
  return rawData.demarches as Procedure[];
}

// ---------------------------------------------------------------------------
// 2. getSources() — retourne les sources officielles avec leurs démarches
// ---------------------------------------------------------------------------

/**
 * Retourne la liste des sources officielles telle que définie dans le
 * fichier de données, avec les démarches couvertes par chaque source.
 *
 * Ces sources proviennent du champ page_sources.sources du JSON,
 * curé manuellement. Elles ne sont pas générées dynamiquement pour
 * éviter toute dérive de contenu non validé.
 */
export function getSources(): SourceEntry[] {
  return rawData.page_sources.sources as SourceEntry[];
}

// ---------------------------------------------------------------------------
// 3. getSourcesMeta() — métadonnées de la page sources
// ---------------------------------------------------------------------------

/**
 * Retourne les métadonnées de la page sources (description, date de
 * vérification, note de transparence).
 */
export function getSourcesMeta(): {
  titre: string;
  description: string;
  date_verification: string;
  note: string;
} {
  const { titre, description, date_verification, note } = rawData.page_sources;
  return { titre, description, date_verification, note };
}

// ---------------------------------------------------------------------------
// 4. getMeta() — métadonnées du jeu de données
// ---------------------------------------------------------------------------

/**
 * Retourne les métadonnées du jeu de données (version, auteur, sources
 * autorisées). Utile pour afficher la provenance dans une interface admin
 * ou pour valider que les données chargées sont bien la version attendue.
 */
export function getMeta(): DataMeta {
  return rawData.meta as DataMeta;
}
