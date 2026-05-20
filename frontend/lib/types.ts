export interface Demarche {
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

export interface Source {
  nom: string;
  url: string;
  description: string;
  demarches_couvertes: string[];
}

export interface DemarchesData {
  meta: {
    version: string;
    date_creation: string;
    auteur: string;
    description: string;
    sources_autorisees: string[];
  };
  demarches: Demarche[];
  page_sources: {
    titre: string;
    description: string;
    sources: Source[];
    date_verification: string;
    note: string;
  };
}

export interface QuestionnaireReponses {
  statut: string;
  logement: string;
  ville: string;
  besoin: string;
  demarches_commencees: string;
}
