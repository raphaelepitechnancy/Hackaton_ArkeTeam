import type { Demarche, QuestionnaireReponses } from "./types";
import { getProcedures } from "./db";

// Toutes les démarches chargées via la couche data (lib/db.ts).
// En production : remplacer getProcedures() par un appel base de données
// sans toucher au code de matching ci-dessous.
const toutes = getProcedures() as Demarche[];

// Config des filtres par besoin : quelles démarches afficher pour quel besoin
function filterByNeed(
  procedures: Demarche[],
  besoin: string
): Demarche[] {
  const categorieMap: Record<string, string> = {
    logement: "logement",
    aides_financieres: "aides",
    sante: "sante",
    impots: "impots",
    transport: "transport",
  };

  // Pas de filtrage par besoin si "je ne sais pas"
  if (!besoin || besoin === "je_ne_sais_pas") {
    return procedures;
  }

  const catCible = categorieMap[besoin];
  if (!catCible) return procedures;

  // Règles strictes par besoin
  const besoinConfig: Record<string, { primary: string[]; secondary: string[] }> =
    {
      logement: {
        primary: ["caf-apl", "assurance-habitation", "checklist-premier-appartement"],
        secondary: ["aide-transport-etudiant", "secu-ameli"],
      },
      sante: {
        primary: ["secu-ameli", "mutuelle-complementaire-sante"],
        secondary: ["bourse-crous"],
      },
      impots: {
        primary: ["impots-premier-emploi"],
        secondary: ["secu-ameli"],
      },
      transport: {
        primary: ["aide-transport-etudiant"],
        secondary: ["bourse-crous"],
      },
      aides: {
        primary: ["caf-apl", "bourse-crous"],
        secondary: ["mutuelle-complementaire-sante"],
      },
    };

  const config = besoinConfig[catCible];
  if (!config) return procedures;

  // Filtrer uniquement les démarches pertinentes au besoin
  // (primary ET secondary, quelque soit la priorité)
  return procedures.filter(
    (d) => config.primary.includes(d.id) || config.secondary.includes(d.id)
  );
}

/**
 * Retourne les démarches recommandées filtrées et triées par priorité puis par id.
 * Logique : filtrage par statut + logement + besoin (optionnel) + limite résultats.
 */
export function getRecommendedProcedures(
  reponses: QuestionnaireReponses
): Demarche[] {
  const { statut, logement, besoin } = reponses;

  // Normalisation des valeurs du formulaire vers les clés JSON
  const statutMap: Record<string, string> = {
    etudiant: "etudiant",
    alternant: "alternant",
    premier_emploi: "premier_emploi",
    etudiant_etranger: "etudiant_etranger",
  };

  const statutKey = statutMap[statut] ?? statut;

  // Filtrage de base : pour_qui contient le statut ou "tous"
  let filtrées = toutes.filter(
    (d) => d.pour_qui.includes(statutKey) || d.pour_qui.includes("tous")
  );

  // Règles spécifiques logement
  if (logement === "chez_parents") {
    // Pas en appartement : on retire les démarches de premier appartement
    filtrées = filtrées.filter(
      (d) =>
        d.id !== "caf-apl" &&
        d.id !== "assurance-habitation" &&
        d.id !== "checklist-premier-appartement"
    );
  }

  if (logement === "premier_appartement" || logement === "colocation") {
    // S'assurer que les démarches logement critiques sont incluses
    const ids_logement = [
      "caf-apl",
      "assurance-habitation",
      "checklist-premier-appartement",
    ];
    ids_logement.forEach((id) => {
      const already = filtrées.find((d) => d.id === id);
      if (!already) {
        const demarche = toutes.find((d) => d.id === id);
        if (demarche) filtrées.push(demarche);
      }
    });
  }

  // Filtrage stricte par besoin si précisé
  if (besoin && besoin !== "je_ne_sais_pas") {
    filtrées = filterByNeed(filtrées, besoin);
  }

  // Déduplique par id
  const seen = new Set<string>();
  const unique = filtrées.filter((d) => {
    if (seen.has(d.id)) return false;
    seen.add(d.id);
    return true;
  });

  // Trie : priorité croissante (1 avant 2), puis id alphabétique
  unique.sort((a, b) => {
    if (a.priorite !== b.priorite) return a.priorite - b.priorite;
    return a.id.localeCompare(b.id);
  });

  // LIMITE : max 4 P1 + 2 P2 pour éviter l'overload
  const p1 = unique.filter((d) => d.priorite === 1).slice(0, 4);
  const p2 = unique.filter((d) => d.priorite > 1).slice(0, 2);

  return [...p1, ...p2];
}

/**
 * Retourne un label persona basé sur le statut et le logement.
 */
export function getPersonaLabel(reponses: QuestionnaireReponses): string {
  const { statut, logement } = reponses;

  const statutLabel: Record<string, string> = {
    etudiant: "etudiant",
    alternant: "alternant",
    premier_emploi: "jeune actif",
    etudiant_etranger: "etudiant étranger",
  };

  const logementLabel: Record<string, string> = {
    chez_parents: "chez tes parents",
    premier_appartement: "dans ton premier appartement",
    colocation: "en colocation",
  };

  const sl = statutLabel[statut] ?? statut;
  const ll = logementLabel[logement] ?? logement;

  return `${sl} ${ll}`;
}
