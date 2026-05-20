import type { Demarche, QuestionnaireReponses } from "./types";
import demarchesData from "../data/demarches.json";

const toutes = demarchesData.demarches as Demarche[];

/**
 * Retourne les démarches recommandées filtrées et triées par priorité puis par id.
 * Logique : filtrage par statut + logement + besoin (optionnel).
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
    // S'assurer que les démarches logement sont incluses
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

  // Filtrage par besoin principal si précisé
  const categorieMap: Record<string, string> = {
    logement: "logement",
    aides_financieres: "aides",
    sante: "sante",
    impots: "impots",
    transport: "transport",
  };

  if (besoin && besoin !== "je_ne_sais_pas" && categorieMap[besoin]) {
    const catCible = categorieMap[besoin];
    // On garde toujours les P1, et on filtre davantage les P2/P3 par catégorie
    filtrées = filtrées.filter(
      (d) => d.priorite === 1 || d.categorie === catCible
    );
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

  return unique;
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
