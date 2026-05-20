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
    titre: "Tu es dans quelle situation aujourd'hui ?",
    hint: "On adapte les démarches selon ta situation.",
    type: "radio",
    emoji: "👤",
    options: [
      { valeur: "etudiant",        label: "Etudiant" },
      { valeur: "alternant",       label: "Alternant" },
      { valeur: "premier_emploi",  label: "Premier emploi (CDI / CDD)" },
      { valeur: "etudiant_etranger", label: "Etudiant étranger" },
    ],
  },
  {
    id: "logement",
    titre: "Tu vis où en ce moment ?",
    hint: "Certaines aides sont liées à ton hébergement.",
    type: "radio",
    emoji: "🏠",
    options: [
      { valeur: "chez_parents",         label: "Chez mes parents" },
      { valeur: "premier_appartement",  label: "Premier appartement" },
      { valeur: "colocation",           label: "Colocation" },
    ],
  },
  {
    id: "ville",
    titre: "Dans quelle ville tu t'installes ?",
    hint: "Pour te signaler des aides locales si disponibles.",
    type: "text",
    emoji: "📍",
    placeholder: "Ex : Paris, Lyon, Bordeaux…",
  },
  {
    id: "besoin",
    titre: "Tu veux surtout être aidé sur quoi ?",
    hint: "On mettra les démarches les plus utiles en avant.",
    type: "radio",
    emoji: "💡",
    options: [
      { valeur: "logement",          label: "Logement" },
      { valeur: "aides_financieres", label: "Aides financières" },
      { valeur: "sante",             label: "Santé" },
      { valeur: "impots",            label: "Impôts" },
      { valeur: "transport",         label: "Transport" },
      { valeur: "je_ne_sais_pas",    label: "Je ne sais pas encore" },
    ],
  },
  {
    id: "demarches_commencees",
    titre: "Tu as déjà commencé des démarches ?",
    hint: "On évite de te répéter ce que tu as déjà fait.",
    type: "radio",
    emoji: "✅",
    options: [
      { valeur: "oui",          label: "Oui, j'ai tout fait" },
      { valeur: "partiellement", label: "Partiellement" },
      { valeur: "non",          label: "Non, je commence" },
    ],
  },
] as const;

const TOTAL = questions.length;

export default function QuestionnairePage() {
  const router = useRouter();
  const [etape, setEtape]     = useState(0);
  const [reponses, setReponses] = useState<Reponses>({
    statut: "",
    logement: "",
    ville: "",
    besoin: "",
    demarches_commencees: "",
  });

  const question       = questions[etape];
  const valeurActuelle = reponses[question.id as keyof Reponses];
  const peutContinuer  =
    question.id === "ville"
      ? valeurActuelle.trim().length > 0
      : valeurActuelle !== "";

  const pourcentage = Math.round(((etape + 1) / TOTAL) * 100);

  function handleSelect(valeur: string) {
    setReponses((prev) => ({ ...prev, [question.id]: valeur }));
  }

  function handleNext() {
    if (!peutContinuer) return;
    if (etape < TOTAL - 1) {
      setEtape(etape + 1);
    } else {
      const params = new URLSearchParams({
        statut:                reponses.statut,
        logement:              reponses.logement,
        ville:                 reponses.ville,
        besoin:                reponses.besoin,
        demarches_commencees:  reponses.demarches_commencees,
      });
      router.push(`/resultats?${params.toString()}`);
    }
  }

  function handleBack() {
    if (etape > 0) setEtape(etape - 1);
  }

  const estDerniereEtape = etape === TOTAL - 1;

  return (
    <div style={{ maxWidth: 520 }} className="mx-auto w-full">

      {/* ---- CAPY ACCUEIL ---- */}
      <div className="text-center mb-8">
        <div style={{ fontSize: 56, marginBottom: 12 }}>🦫</div>
        <p style={{ fontSize: 14, color: "var(--color-text-muted)", lineHeight: 1.5 }}>
          Réponds en 30 secondes, je prépare ton parcours
        </p>
      </div>

      {/* ---- PROGRESSION ---- */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-soft)" }}>
            Question {etape + 1} sur {TOTAL}
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-primary)" }}>
            {pourcentage} %
          </span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${pourcentage}%` }} />
        </div>
      </div>

      {/* ---- CARTE QUESTION ---- */}
      <div
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: 18,
          padding: "32px 28px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        }}
      >
        {/* Hint */}
        {question.hint && (
          <p
            className="mb-3"
            style={{ fontSize: 13, color: "var(--color-text-muted)" }}
          >
            {question.hint}
          </p>
        )}

        {/* Titre question avec emoji */}
        <div className="flex items-start gap-3 mb-6">
          <span style={{ fontSize: 28, flexShrink: 0 }} aria-hidden="true">
            {"emoji" in question ? question.emoji : "•"}
          </span>
          <h2
            className="font-bold"
            style={{ fontSize: 22, color: "var(--color-text-strong)", lineHeight: 1.3 }}
          >
            {question.titre}
          </h2>
        </div>

        {/* Options */}
        {question.type === "text" ? (
          <input
            type="text"
            className="input-text"
            placeholder={"placeholder" in question ? question.placeholder : ""}
            value={valeurActuelle}
            onChange={(e) => handleSelect(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && peutContinuer && handleNext()}
            autoFocus
          />
        ) : (
          <div className="flex flex-col gap-3">
            {"options" in question &&
              question.options.map((opt) => (
                <button
                  key={opt.valeur}
                  onClick={() => handleSelect(opt.valeur)}
                  className={`option-card${valeurActuelle === opt.valeur ? " selected" : ""}`}
                >
                  {/* Check mark quand sélectionné */}
                  <span className="flex items-center gap-3">
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: `2px solid ${valeurActuelle === opt.valeur ? "var(--color-primary)" : "var(--color-border)"}`,
                        background: valeurActuelle === opt.valeur ? "var(--color-primary)" : "transparent",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        transition: "all 0.15s ease",
                      }}
                    >
                      {valeurActuelle === opt.valeur && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                          <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                    {opt.label}
                  </span>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* ---- NAVIGATION ---- */}
      <div className="flex justify-between items-center mt-5">
        <button
          onClick={handleBack}
          disabled={etape === 0}
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "var(--color-text-soft)",
            background: "none",
            border: "none",
            cursor: etape === 0 ? "not-allowed" : "pointer",
            opacity: etape === 0 ? 0.3 : 1,
            padding: "10px 4px",
          }}
        >
          ← Retour
        </button>

        <button
          onClick={handleNext}
          disabled={!peutContinuer}
          className="btn-primary"
          style={{
            fontSize: 15,
            padding: "12px 28px",
          }}
        >
          {estDerniereEtape ? "Voir mes démarches" : "Suivant"}
          {!estDerniereEtape && (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>

    </div>
  );
}
