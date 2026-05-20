"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import {
  getRecommendedProcedures,
  getPersonaLabel,
} from "../../lib/matching";
import { getExplicationBloc } from "../../lib/explanation";
import type { Demarche, QuestionnaireReponses } from "../../lib/types";

/* ---- Badge priorité ---- */
function BadgePriorite({ priorite }: { priorite: 1 | 2 | 3 }) {
  if (priorite === 1) {
    return <span className="badge badge-p1">Prioritaire</span>;
  }
  if (priorite === 2) {
    return <span className="badge badge-p2">Important</span>;
  }
  return <span className="badge badge-p3">Utile</span>;
}

/* ---- Icône check ---- */
function IconCheck() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, marginTop: 2 }}
    >
      <circle cx="7" cy="7" r="6.5" stroke="var(--color-p1)" strokeWidth="1.2" />
      <path d="M4.5 7l2 2L9.5 5" stroke="var(--color-p1)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---- Icône lien externe ---- */
function IconExternal() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V7M7 1h4m0 0v4M11 1 5.5 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ---- Carte démarche ---- */
function CarteDemarche({ demarche }: { demarche: Demarche }) {
  const [explicationVisible, setExplicationVisible] = useState(false);

  const isP1 = demarche.priorite === 1;
  const explication = getExplicationBloc(demarche);

  return (
    <div
      className={`card-demarche${isP1 ? " priorite-1" : demarche.priorite === 2 ? " priorite-2" : ""}`}
    >
      {/* En-tête */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3
          className="font-bold"
          style={{
            fontSize: 17,
            color: "var(--color-text-strong)",
            lineHeight: 1.35,
          }}
        >
          {demarche.titre}
        </h3>
        <BadgePriorite priorite={demarche.priorite} />
      </div>

      {/* Description */}
      <p
        className="mb-4"
        style={{
          fontSize: 14,
          color: "var(--color-text-body)",
          lineHeight: 1.6,
        }}
      >
        {demarche.description_simple}
      </p>

      {/* Documents */}
      {demarche.documents && demarche.documents.length > 0 && (
        <div className="mb-4">
          <p
            className="mb-2"
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
            }}
          >
            Documents a préparer
          </p>
          <ul className="flex flex-col gap-1.5">
            {demarche.documents.map((doc, i) => (
              <li
                key={i}
                className="flex items-start gap-2"
                style={{ fontSize: 13, color: "var(--color-text-body)" }}
              >
                <IconCheck />
                {doc}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Explication dépliable — Stratégie 1 statique, zéro hallucination */}
      {explicationVisible && (
        <div className="encart-explication mb-4">
          <p style={{ marginBottom: 10 }}>{explication.texte}</p>
          <p style={{ fontSize: 12, color: "#3B82F6", marginTop: 6 }}>
            Source officielle :{" "}
            <a
              href={explication.lien_officiel}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontWeight: 600, textDecoration: "underline", color: "#1D4ED8" }}
            >
              {explication.source}
            </a>
            {" "}— les sources officielles font foi.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-1">
        <a
          href={demarche.lien_officiel}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ fontSize: 13, padding: "9px 16px" }}
        >
          Lien officiel
          <IconExternal />
        </a>
        <button
          onClick={() => setExplicationVisible(!explicationVisible)}
          className="btn-outline"
          style={{ fontSize: 13 }}
        >
          {explicationVisible ? "Masquer" : "Explique-moi simplement"}
        </button>
      </div>
    </div>
  );
}

/* ---- Étiquette de section ---- */
function SectionLabel({
  children,
  couleur,
}: {
  children: React.ReactNode;
  couleur: string;
}) {
  return (
    <p
      className="mb-4"
      style={{
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: "0.09em",
        textTransform: "uppercase",
        color: couleur,
      }}
    >
      {children}
    </p>
  );
}

/* ---- Contenu principal (wrapped in Suspense) ---- */
function ResultatsContenu() {
  const searchParams = useSearchParams();

  const reponses: QuestionnaireReponses = {
    statut:               searchParams.get("statut")               ?? "etudiant",
    logement:             searchParams.get("logement")             ?? "premier_appartement",
    ville:                searchParams.get("ville")                ?? "",
    besoin:               searchParams.get("besoin")               ?? "je_ne_sais_pas",
    demarches_commencees: searchParams.get("demarches_commencees") ?? "non",
  };

  const demarches   = getRecommendedProcedures(reponses);
  const persona     = getPersonaLabel(reponses);
  const prioritaires = demarches.filter((d) => d.priorite === 1);
  const secondaires  = demarches.filter((d) => d.priorite !== 1);

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>

      {/* ---- EN-TÊTE RÉSULTATS ---- */}
      <div className="mb-10">
        {/* Tag vert */}
        <span
          className="inline-block mb-4"
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "var(--color-p1-dark)",
            background: "var(--color-p1-light)",
            border: "1px solid var(--color-p1-border)",
            borderRadius: 20,
            padding: "4px 12px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {demarches.length} démarche{demarches.length > 1 ? "s" : ""} identifiée{demarches.length > 1 ? "s" : ""}
        </span>

        <h1
          className="font-extrabold mb-2"
          style={{
            fontSize: "clamp(24px, 4vw, 34px)",
            color: "var(--color-text-strong)",
            lineHeight: 1.2,
            letterSpacing: "-0.015em",
          }}
        >
          Tes démarches prioritaires
        </h1>

        <p style={{ fontSize: 16, color: "var(--color-text-soft)", lineHeight: 1.5 }}>
          En tant que{" "}
          <strong style={{ color: "var(--color-text-body)", fontWeight: 600 }}>
            {persona}
          </strong>
          {reponses.ville ? ` à ${reponses.ville}` : ""}
          {" "}— voici ce que tu dois faire.
        </p>
      </div>

      {/* ---- PRIORITAIRES P1 ---- */}
      {prioritaires.length > 0 && (
        <section className="mb-8">
          <SectionLabel couleur="var(--color-p1-dark)">
            A faire en premier — prioritaire
          </SectionLabel>
          <div className="flex flex-col gap-4">
            {prioritaires.map((d) => (
              <CarteDemarche key={d.id} demarche={d} />
            ))}
          </div>
        </section>
      )}

      {/* ---- SECONDAIRES P2/P3 ---- */}
      {secondaires.length > 0 && (
        <section className="mb-8">
          <SectionLabel couleur="var(--color-p2-dark)">
            A faire ensuite — important
          </SectionLabel>
          <div className="flex flex-col gap-4">
            {secondaires.map((d) => (
              <CarteDemarche key={d.id} demarche={d} />
            ))}
          </div>
        </section>
      )}

      {/* ---- AUCUN RÉSULTAT ---- */}
      {demarches.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "var(--color-text-soft)",
          }}
        >
          <p style={{ fontSize: 17, marginBottom: 16 }}>
            Aucune démarche trouvée pour ta situation.
          </p>
          <Link
            href="/questionnaire"
            className="btn-primary"
            style={{ fontSize: 15 }}
          >
            Recommencer le questionnaire
          </Link>
        </div>
      )}

      {/* ---- ACTIONS BAS DE PAGE ---- */}
      {demarches.length > 0 && (
        <div
          className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-10 pt-6"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <Link
            href="/questionnaire"
            style={{ fontSize: 13, color: "var(--color-text-soft)", textDecoration: "underline" }}
          >
            Refaire le questionnaire
          </Link>
          <Link
            href="/sources"
            style={{ fontSize: 13, color: "var(--color-primary)", fontWeight: 600 }}
          >
            Comment on a sélectionné ces démarches ?
          </Link>
        </div>
      )}

      {/* ---- NOTE CONFIANCE ---- */}
      <p
        className="mt-6 text-center"
        style={{ fontSize: 12, color: "var(--color-text-muted)", lineHeight: 1.6 }}
      >
        Ces informations viennent de sources officielles et sont indicatives.
        Vérifiez toujours sur le site officiel de l'organisme.
      </p>

    </div>
  );
}

/* ---- Export page ---- */
export default function ResultatsPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 20px",
          }}
        >
          <div style={{ fontSize: 16, color: "var(--color-text-soft)" }}>
            Chargement de tes démarches…
          </div>
        </div>
      }
    >
      <ResultatsContenu />
    </Suspense>
  );
}
