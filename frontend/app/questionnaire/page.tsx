"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Reponses = {
  statut: string;
  logement: string;
  ville: string;
  besoin: string;
  demarches_commencees: string;
};

const questions = [
  {
    id: "statut",
    titre: "Quel est ton statut ?",
    type: "radio",
    options: [
      { valeur: "etudiant", label: "Etudiant" },
      { valeur: "alternant", label: "Alternant" },
      { valeur: "premier_emploi", label: "Premier emploi (CDI/CDD)" },
      { valeur: "etudiant_etranger", label: "Etudiant etranger" },
    ],
  },
  {
    id: "logement",
    titre: "Quelle est ta situation logement ?",
    type: "radio",
    options: [
      { valeur: "chez_parents", label: "Chez mes parents" },
      { valeur: "premier_appartement", label: "Premier appartement" },
      { valeur: "colocation", label: "Colocation" },
    ],
  },
  {
    id: "ville",
    titre: "Dans quelle ville es-tu ?",
    type: "text",
    placeholder: "Ex : Paris, Lyon, Bordeaux...",
  },
  {
    id: "besoin",
    titre: "Quel est ton besoin principal ?",
    type: "radio",
    options: [
      { valeur: "logement", label: "Logement" },
      { valeur: "aides_financieres", label: "Aides financieres" },
      { valeur: "sante", label: "Sante" },
      { valeur: "impots", label: "Impots" },
      { valeur: "transport", label: "Transport" },
      { valeur: "je_ne_sais_pas", label: "Je ne sais pas" },
    ],
  },
  {
    id: "demarches_commencees",
    titre: "As-tu deja commence tes demarches ?",
    type: "radio",
    options: [
      { valeur: "oui", label: "Oui" },
      { valeur: "non", label: "Non" },
      { valeur: "partiellement", label: "Partiellement" },
    ],
  },
] as const;

const TOTAL = questions.length;

export default function QuestionnairePage() {
  const router = useRouter();
  const [etape, setEtape] = useState(0);
  const [reponses, setReponses] = useState<Reponses>({
    statut: "",
    logement: "",
    ville: "",
    besoin: "",
    demarches_commencees: "",
  });

  const question = questions[etape];
  const valeurActuelle = reponses[question.id as keyof Reponses];
  const peutContinuer =
    question.id === "ville"
      ? valeurActuelle.trim().length > 0
      : valeurActuelle !== "";

  function handleSelect(valeur: string) {
    setReponses((prev) => ({ ...prev, [question.id]: valeur }));
  }

  function handleNext() {
    if (!peutContinuer) return;
    if (etape < TOTAL - 1) {
      setEtape(etape + 1);
    } else {
      // Derniere etape : rediriger vers resultats avec les reponses en query params
      const params = new URLSearchParams({
        statut: reponses.statut,
        logement: reponses.logement,
        ville: reponses.ville,
        besoin: reponses.besoin,
        demarches_commencees: reponses.demarches_commencees,
      });
      router.push(`/resultats?${params.toString()}`);
    }
  }

  function handleBack() {
    if (etape > 0) setEtape(etape - 1);
  }

  const pourcentage = Math.round(((etape + 1) / TOTAL) * 100);

  return (
    <div className="max-w-xl mx-auto">
      {/* Barre de progression */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500 font-medium">
            Question {etape + 1} sur {TOTAL}
          </span>
          <span className="text-sm text-blue-600 font-semibold">
            {pourcentage}%
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${pourcentage}%` }}
          />
        </div>
      </div>

      {/* Carte question */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {question.titre}
        </h2>

        {question.type === "text" ? (
          <input
            type="text"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={"placeholder" in question ? question.placeholder : ""}
            value={valeurActuelle}
            onChange={(e) => handleSelect(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && peutContinuer && handleNext()}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {"options" in question &&
              question.options.map((opt) => (
                <button
                  key={opt.valeur}
                  onClick={() => handleSelect(opt.valeur)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium text-base transition-all ${
                    valeurActuelle === opt.valeur
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handleBack}
          disabled={etape === 0}
          className="px-5 py-3 text-gray-500 hover:text-gray-700 font-medium disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Retour
        </button>

        <button
          onClick={handleNext}
          disabled={!peutContinuer}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-xl transition-colors"
        >
          {etape === TOTAL - 1 ? "Voir mes demarches" : "Suivant"}
        </button>
      </div>
    </div>
  );
}
