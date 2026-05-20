"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import {
  getRecommendedProcedures,
  getPersonaLabel,
} from "../../lib/matching";
import type { Demarche, QuestionnaireReponses } from "../../lib/types";

function BadgePriorite({ priorite }: { priorite: 1 | 2 | 3 }) {
  if (priorite === 1) {
    return (
      <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
        Prioritaire
      </span>
    );
  }
  if (priorite === 2) {
    return (
      <span className="inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
        Important
      </span>
    );
  }
  return (
    <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">
      Utile
    </span>
  );
}

function CarteDemarche({ demarche }: { demarche: Demarche }) {
  const [explicationVisible, setExplicationVisible] = useState(false);

  return (
    <div
      className={`bg-white rounded-2xl border shadow-sm p-6 ${
        demarche.priorite === 1
          ? "border-red-200 shadow-red-50"
          : "border-gray-200"
      }`}
    >
      {/* En-tete */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3
          className={`font-bold text-lg ${
            demarche.priorite === 1 ? "text-gray-900" : "text-gray-800"
          }`}
        >
          {demarche.titre}
        </h3>
        <BadgePriorite priorite={demarche.priorite} />
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4">{demarche.description_simple}</p>

      {/* Documents */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Documents a preparer :
        </p>
        <ul className="space-y-1">
          {demarche.documents.map((doc, i) => (
            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-green-500 mt-0.5 flex-shrink-0">+</span>
              {doc}
            </li>
          ))}
        </ul>
      </div>

      {/* Explication simple (inline toggle) */}
      {explicationVisible && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4 text-sm text-blue-900">
          {demarche.explication_jeune}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-2">
        <a
          href={demarche.lien_officiel}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          Lien officiel
        </a>
        <button
          onClick={() => setExplicationVisible(!explicationVisible)}
          className="border border-blue-300 text-blue-700 hover:bg-blue-50 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          {explicationVisible ? "Masquer" : "Explique-moi simplement"}
        </button>
      </div>
    </div>
  );
}

function ResultatsContenu() {
  const searchParams = useSearchParams();

  const reponses: QuestionnaireReponses = {
    statut: searchParams.get("statut") ?? "etudiant",
    logement: searchParams.get("logement") ?? "premier_appartement",
    ville: searchParams.get("ville") ?? "",
    besoin: searchParams.get("besoin") ?? "je_ne_sais_pas",
    demarches_commencees: searchParams.get("demarches_commencees") ?? "non",
  };

  const demarches = getRecommendedProcedures(reponses);
  const persona = getPersonaLabel(reponses);

  const prioritaires = demarches.filter((d) => d.priorite === 1);
  const secondaires = demarches.filter((d) => d.priorite !== 1);

  return (
    <div>
      {/* En-tete resultats */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Tes demarches prioritaires
        </h1>
        <p className="text-gray-500 text-lg">
          En tant que{" "}
          <span className="font-semibold text-gray-700">{persona}</span>
          {reponses.ville ? ` a ${reponses.ville}` : ""}, voici ce que tu dois
          faire.
        </p>
        <p className="text-sm text-gray-400 mt-1">
          {demarches.length} demarche{demarches.length > 1 ? "s" : ""}{" "}
          identifiee{demarches.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Demarches prioritaires */}
      {prioritaires.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-4">
            A faire en premier — Prioritaire
          </h2>
          <div className="flex flex-col gap-4">
            {prioritaires.map((d) => (
              <CarteDemarche key={d.id} demarche={d} />
            ))}
          </div>
        </section>
      )}

      {/* Demarches secondaires */}
      {secondaires.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold text-yellow-600 uppercase tracking-widest mb-4">
            A faire ensuite — Important
          </h2>
          <div className="flex flex-col gap-4">
            {secondaires.map((d) => (
              <CarteDemarche key={d.id} demarche={d} />
            ))}
          </div>
        </section>
      )}

      {/* Aucun resultat */}
      {demarches.length === 0 && (
        <div className="text-center text-gray-500 py-16">
          <p className="text-lg">Aucune demarche trouvee pour ta situation.</p>
          <Link
            href="/questionnaire"
            className="mt-4 inline-block text-blue-600 underline"
          >
            Recommencer le questionnaire
          </Link>
        </div>
      )}

      {/* Actions bas de page */}
      <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Link
          href="/questionnaire"
          className="text-gray-500 hover:text-gray-700 text-sm underline"
        >
          Refaire le questionnaire
        </Link>
        <Link
          href="/sources"
          className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
        >
          Comment on a selectionne ces demarches ?
        </Link>
      </div>

      {/* Note de bas de page */}
      <p className="text-xs text-gray-400 mt-6 text-center">
        Ces informations sont issues de sources officielles et a titre
        indicatif. Verifiez toujours sur le site officiel de l'organisme.
      </p>
    </div>
  );
}

export default function ResultatsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-500 text-lg">Chargement...</div>
        </div>
      }
    >
      <ResultatsContenu />
    </Suspense>
  );
}
