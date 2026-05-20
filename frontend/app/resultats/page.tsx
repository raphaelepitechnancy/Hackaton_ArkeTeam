"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import {
  getRecommendedProcedures,
  getPersonaLabel,
} from "../../lib/matching";
import { getExplicationBloc } from "../../lib/explanation";
import { simplifyWithLLM } from "../../lib/llm";
import type { Demarche, QuestionnaireReponses } from "../../lib/types";

/* ---- Bloc Capy ---- */
const capyQuestions = [
  {
    id: "commencement",
    label: "Par quoi je commence ?",
    reponse:
      "Commence par les démarches marquées en vert (priorité 1). Elles sont les plus urgentes et souvent les plus rapides. Ouvre la première, clique sur le lien officiel, et tu vas pas à pas.",
  },
  {
    id: "documents",
    label: "Quels documents préparer ?",
    reponse:
      "Regroupe les documents demandés par chaque démarche (tu vois la liste sous chaque titre). Demande à ta famille ce que tu n'as pas. Les documents manquent rarement, et le site officiel peut te dire comment les obtenir si tu es bloqué.",
  },
  {
    id: "importance",
    label: "Pourquoi cette démarche est importante ?",
    reponse:
      "Chaque démarche te protège ou t'aide financièrement. Par exemple, la CAF te verse de l'argent pour le loyer. La Sécu te couvre en cas de problème de santé. C'est pas optionnel, c'est vital.",
  },
  {
    id: "sources",
    label: "Où vérifier l'information officielle ?",
    reponse:
      "Clique sur le bouton \"Lien officiel\" de chaque démarche. C'est la source directe du gouvernement, le plus fiable possible. Tu peux aussi aller à la page Sources en bas pour voir d'où viennent toutes les infos.",
  },
];

type Message = { role: "user" | "capy"; text: string };

function CapyChatSection({ demarches }: { demarches: Demarche[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [capyText, setCapyText] = useState<string>("");
  const [capyTextSource, setCapyTextSource] = useState<"llm" | "static">("static");
  const [capyLoading, setCapyLoading] = useState(false);
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);

  function handleCapyQuestion(questionId: string) {
    const question = capyQuestions.find((q) => q.id === questionId);
    if (!question) return;

    // Ajouter le message utilisateur (question rapide)
    setMessages((prev) => [...prev, { role: "user", text: question.label }]);

    // Générer la réponse (OpenAI ou fallback)
    getCapyResponse(question.label).then((response) => {
      setMessages((prev) => [...prev, { role: "capy", text: response }]);
    });
  }

  const activeQuestion = capyQuestions.find((q) => q.id === activeId) ?? null;

  // Fallback par mots-clés
  function getKeywordResponse(userQuestion: string): string {
    const input = userQuestion.toLowerCase();

    if (
      input.includes("commence") ||
      input.includes("début") ||
      input.includes("priorité") ||
      input.includes("urgence")
    ) {
      const p1 = demarches.filter((d) => d.priorite === 1);
      if (p1.length > 0) {
        return `Commence par celles en vert : ${p1.map((d) => d.titre).join(", ")}. Ce sont les plus urgentes.`;
      } else {
        return "Commence par les démarches en haut de la liste.";
      }
    } else if (
      input.includes("document") ||
      input.includes("papier") ||
      input.includes("justificatif")
    ) {
      const allDocs = demarches
        .filter((d) => d.documents.length > 0)
        .flatMap((d) => d.documents.slice(0, 2));
      const uniqueDocs = [...new Set(allDocs)];
      if (uniqueDocs.length > 0) {
        return `Documents à préparer : ${uniqueDocs.slice(0, 5).join(", ")}. Demande à ta famille ce que tu n'as pas.`;
      } else {
        return "Regroupe les documents listés sous chaque démarche.";
      }
    } else if (
      input.includes("pourquoi") ||
      input.includes("important") ||
      input.includes("obligatoire")
    ) {
      return "Chaque démarche te protège ou t'aide financièrement. Par exemple, la CAF te verse de l'argent pour le loyer. La Sécu te couvre en cas de problème. C'est pas optionnel, c'est vital.";
    } else if (
      input.includes("source") ||
      input.includes("officiel") ||
      input.includes("vérifier")
    ) {
      return "Clique sur les boutons 'Lien officiel' de chaque démarche. C'est la source directe du gouvernement, le plus fiable. Tu peux aussi voir la page Sources pour d'où vient tout.";
    } else if (
      input.includes("upload") ||
      input.includes("fichier") ||
      input.includes("envoyer document")
    ) {
      return "Bientôt tu pourras envoyer tes documents directement ici. Pour maintenant, suis les liens officiels.";
    } else {
      return "Je peux t'aider sur : par quoi commencer, quels documents préparer, pourquoi c'est important, ou où vérifier les infos officielles. Pose une question là-dessus !";
    }
  }

  // Obtenir réponse Capy (via API serveur)
  async function getCapyResponse(userQuestion: string): Promise<string> {
    try {
      const response = await fetch("/api/capy-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userQuestion,
          demarches: demarches.map((d) => ({
            id: d.id,
            titre: d.titre,
            description_simple: d.description_simple,
            documents: d.documents,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("API error");
      }

      const data = await response.json();
      return data.response || getKeywordResponse(userQuestion);
    } catch (error) {
      console.warn("Capy API failed, using fallback", error);
      return getKeywordResponse(userQuestion);
    }
  }

  // Soumettre une question libre
  async function handleFreeTextSubmit() {
    if (!userInput.trim()) return;

    const userQuestion = userInput.trim();

    // Ajouter le message utilisateur immédiatement
    setMessages((prev) => [...prev, { role: "user", text: userQuestion }]);
    setUserInput("");

    // Générer la réponse (OpenAI ou fallback)
    const response = await getCapyResponse(userQuestion);

    // Ajouter la réponse Capy
    setMessages((prev) => [...prev, { role: "capy", text: response }]);
  }

  return (
    <div className="capy-chat-section">
      {/* En-tête */}
      <div className="capy-header">
        <span className="capy-avatar" aria-hidden="true">🦫</span>
        <div>
          <p className="capy-title">Parle avec Capy</p>
          <p className="capy-subtitle">Tu veux que je t&apos;aide à comprendre ton parcours ?</p>
          <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 4 }}>
            🔒 Mode local sécurisé — pas de données envoyées
          </p>
        </div>
      </div>

      {/* Afficher l'historique des messages */}
      {messages.length > 0 && (
        <div style={{ marginBottom: 12, maxHeight: "200px", overflowY: "auto" }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                marginBottom: 8,
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              {msg.role === "capy" && (
                <span style={{ fontSize: 16, marginRight: 6 }} aria-hidden="true">
                  🦫
                </span>
              )}
              <div
                style={{
                  maxWidth: "80%",
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: msg.role === "user" ? "#DBEAFE" : "#F0F9FF",
                  border: `1px solid ${msg.role === "user" ? "#BFDBFE" : "#E0F2FE"}`,
                  fontSize: 13,
                  lineHeight: 1.4,
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Boutons rapides (toujours visibles) */}
      {messages.length === 0 && (
        <div className="capy-button-group">
          {capyQuestions.map((q) => (
            <button
              key={q.id}
              onClick={() => handleCapyQuestion(q.id)}
              className="capy-btn"
            >
              {q.label}
            </button>
          ))}
        </div>
      )}

      {/* Champ texte + bouton (toujours visibles) */}
      <div style={{ marginTop: 12, borderTop: "1px solid #E0F2FE", paddingTop: 12 }}>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Pose une question..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFreeTextSubmit()}
            style={{
              flex: 1,
              padding: "8px 12px",
              border: "1px solid #BFDBFE",
              borderRadius: 6,
              fontSize: 13,
              fontFamily: "inherit",
            }}
          />
          <button
            type="button"
            onClick={() => handleFreeTextSubmit()}
            style={{
              padding: "8px 12px",
              background: "var(--color-primary)",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Envoyer
          </button>
        </div>
      </div>

    </div>
  );
}

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
  const [explicationTexte, setExplicationTexte] = useState<string>("");
  const [explicationTextSource, setExplicationTextSource] = useState<"llm" | "static">("static");
  const [explicationLoading, setExplicationLoading] = useState(false);

  const isP1 = demarche.priorite === 1;
  const explication = getExplicationBloc(demarche);

  function handleExplainToggle() {
    if (explicationVisible) {
      setExplicationVisible(false);
      return;
    }

    // Affiche immédiatement le texte statique, puis tente LLM en parallèle
    setExplicationTexte(explication.texte);
    setExplicationTextSource("static");
    setExplicationVisible(true);
    setExplicationLoading(true);

    simplifyWithLLM(
      {
        titre: demarche.titre,
        description_simple: demarche.description_simple,
        pour_qui: demarche.pour_qui,
        documents: demarche.documents,
        source: demarche.source,
      },
      explication.texte
    ).then((result) => {
      setExplicationTexte(result.text);
      setExplicationTextSource(result.source);
      setExplicationLoading(false);
    });
  }

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

      {/* Explication dépliable — fallback statique garanti, LLM optionnel */}
      {explicationVisible && (
        <div className="encart-explication mb-4">
          <p style={{ marginBottom: 6 }}>
            {explicationLoading ? explication.texte : explicationTexte}
          </p>
          {/* Attribution transparente */}
          <p
            style={{
              fontSize: 11,
              color: "var(--color-text-muted)",
              marginBottom: 8,
              fontStyle: "italic",
            }}
          >
            {explicationTextSource === "llm"
              ? "Reformulé par IA à partir de sources officielles"
              : "Explication contrôlée à partir de sources officielles"}
          </p>
          <p style={{ fontSize: 12, color: "#3B82F6", marginTop: 4 }}>
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
          onClick={handleExplainToggle}
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

        {/* Message Capy dynamique */}
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: "#F0F9FF",
            border: "1px solid #E0F2FE",
            borderRadius: 10,
            display: "flex",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 18, flexShrink: 0 }} aria-hidden="true">
            🦫
          </span>
          <p style={{ fontSize: 14, color: "var(--color-text-body)", lineHeight: 1.5 }}>
            <strong>Ok, j'ai compris ta situation :</strong> tu es {persona}
            {reponses.ville ? ` à ${reponses.ville}` : ""}. J'ai préparé{" "}
            <strong>{prioritaires.length}</strong> démarches prioritaires pour éviter les oublis. On commence par les urgences, puis je t'explique le reste simplement.
          </p>
        </div>
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

      {/* ---- BLOC CAPY ---- */}
      {demarches.length > 0 && <CapyChatSection demarches={demarches} />}

      {/* ---- ANALYSER UN DOCUMENT ---- */}
      {demarches.length > 0 && (
        <section className="mb-8" style={{ marginTop: 24 }}>
          <div
            style={{
              background: "linear-gradient(135deg, #FEF3C7 0%, #FCD34D 100%)",
              border: "1px solid #F59E0B",
              borderRadius: 16,
              padding: 24,
            }}
          >
            {/* En-tête */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <span style={{ fontSize: 28 }} aria-hidden="true">
                📄
              </span>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: "#1F2937" }}>
                  Bientôt : Envoie un document à Capy
                </h3>
                <p style={{ fontSize: 13, color: "#6B7280" }}>
                  Capy explique les documents, il ne les conserve pas.
                </p>
              </div>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: 13,
                color: "#374151",
                lineHeight: 1.6,
                marginBottom: 16,
              }}
            >
              <strong>Exemples :</strong> bail, attestation CAF, courrier administratif, fiche de paie anonymisée.
            </p>

            {/* Bouton upload */}
            <button
              disabled
              style={{
                width: "100%",
                padding: "12px 16px",
                background: "rgba(255, 255, 255, 0.7)",
                border: "2px dashed #D97706",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                color: "#92400E",
                cursor: "not-allowed",
                opacity: 0.6,
                marginBottom: 16,
                transition: "all 0.2s",
              }}
            >
              📤 Importer un document (phase 2)
            </button>

            {/* Exemple simulé */}
            <div
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <p style={{ fontSize: 12, fontWeight: 600, color: "#4B5563", marginBottom: 8 }}>
                📋 Exemple simulé : Fiche de paie anonymisée
              </p>
              <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>
                <strong>Capy peut t'aider à comprendre :</strong> salaire net, cotisations sociales, déductions,
                informations utiles pour une demande d'aide logement ou de bourse.
              </p>
            </div>

            {/* Avertissement RGPD */}
            <div
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid #F87171",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <p style={{ fontSize: 11, color: "#991B1B", fontWeight: 500, lineHeight: 1.5 }}>
                <strong>🔒 Respect de ta vie privée :</strong> Ne téléverse pas de document réel contenant des données personnelles pendant cette démo. La fonction d'analyse complète sera disponible en phase 2 avec anonymisation locale.
              </p>
            </div>
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
