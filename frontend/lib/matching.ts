import type { Demarche, QuestionnaireReponses } from "./types";
import { getProcedures } from "./db";

// Toutes les démarches chargées via la couche data (lib/db.ts).
// En production : remplacer getProcedures() par un appel base de données
// sans toucher au code de matching ci-dessous.
const toutes = getProcedures() as Demarche[];

// Strict filtering by need - each besoin has clear allowlist and exclusions
function filterByNeed(
  procedures: Demarche[],
  besoin: string,
  statut: string,
  logement: string
): Demarche[] {
  // Build the SET of allowed IDs based on besoin
  const allowedIds = new Set<string>();

  // "je ne sais pas" - return general recommendations per profile
  if (!besoin || besoin === "je_ne_sais_pas") {
    if (statut === "etudiant") {
      allowedIds.add("secu-ameli");
      if (logement === "premier_appartement" || logement === "colocation") {
        allowedIds.add("caf-apl");
        allowedIds.add("assurance-habitation");
        allowedIds.add("checklist-premier-appartement");
      }
      allowedIds.add("bourse-crous");
      allowedIds.add("aide-transport-etudiant");
    } else if (statut === "premier_emploi") {
      allowedIds.add("impots-premier-emploi");
      allowedIds.add("secu-ameli");
      if (logement === "premier_appartement" || logement === "colocation") {
        allowedIds.add("caf-apl");
        allowedIds.add("assurance-habitation");
      }
    } else if (statut === "alternant") {
      allowedIds.add("secu-ameli");
      allowedIds.add("aide-transport-etudiant");
      if (logement === "premier_appartement" || logement === "colocation") {
        allowedIds.add("caf-apl");
        allowedIds.add("assurance-habitation");
      }
    }
  } else if (besoin === "logement") {
    // STRICT logement: only housing-related
    allowedIds.add("caf-apl");
    allowedIds.add("assurance-habitation");
    allowedIds.add("checklist-premier-appartement");
  } else if (besoin === "aides_financieres") {
    // STRICT aides: grants, CAF, transport
    if (statut === "etudiant") {
      allowedIds.add("bourse-crous");
    }
    // CAF only if housing situation requires it
    if (logement === "premier_appartement" || logement === "colocation") {
      allowedIds.add("caf-apl");
    }
    // Transport for students and alternants
    if (statut === "etudiant" || statut === "alternant") {
      allowedIds.add("aide-transport-etudiant");
    }
  } else if (besoin === "sante") {
    // STRICT santé: ONLY health procedures
    allowedIds.add("secu-ameli");
    allowedIds.add("mutuelle-complementaire-sante");
  } else if (besoin === "impots") {
    // STRICT impots: ONLY tax procedures
    allowedIds.add("impots-premier-emploi");
  } else if (besoin === "transport") {
    // STRICT transport: ONLY transport aid
    allowedIds.add("aide-transport-etudiant");
  }

  // Return ONLY procedures in allowedIds
  return procedures.filter((d) => allowedIds.has(d.id));
}

/**
 * Retourne les démarches recommandées filtrées et triées par priorité puis par id.
 * Logique STRICTE : besoin d'abord, puis affine par statut/logement.
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

  // Step 1: Filtre par besoin d'abord (plus important que le statut)
  let filtrées = filterByNeed(toutes, besoin, statutKey, logement);

  // Step 2: Filtrer par statut SEULEMENT si le besoin le permet
  filtrées = filtrées.filter(
    (d) => d.pour_qui.includes(statutKey) || d.pour_qui.includes("tous")
  );

  // Step 3: Règles spécifiques logement SEULEMENT si besoin = logement
  if (besoin === "logement") {
    if (logement === "chez_parents") {
      // Pas en appartement : retire les démarches de premier appartement
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
