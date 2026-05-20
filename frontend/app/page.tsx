import Link from "next/link";

const exemples = [
  {
    sigle: "APL",
    titre: "Aide au logement",
    description: "Jusqu'à ~300 €/mois si tu loues un appartement. À demander dès le 1er mois.",
    couleur: "var(--color-p1)",
    bg: "var(--color-p1-light)",
    border: "var(--color-p1-border)",
  },
  {
    sigle: "Sécu",
    titre: "Sécurité sociale",
    description: "Crée ton compte Ameli à 18 ans pour être remboursé sans dépendre de tes parents.",
    couleur: "var(--color-primary)",
    bg: "var(--color-primary-light)",
    border: "#BFDBFE",
  },
  {
    sigle: "Impôts",
    titre: "1re déclaration",
    description: "Obligatoire même si tu ne dois rien. 15 minutes en ligne, une fois par an.",
    couleur: "var(--color-p2-dark)",
    bg: "var(--color-p2-light)",
    border: "var(--color-p2-border)",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center text-center">

      {/* ---- HERO ---- */}
      <div style={{ maxWidth: 580 }} className="w-full">

        {/* Pill badge */}
        <span
          className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-7"
          style={{
            background: "var(--color-primary-light)",
            color: "var(--color-primary)",
          }}
        >
          Pour les 18-25 ans qui deviennent autonomes
        </span>

        {/* H1 */}
        <h1
          className="font-extrabold leading-tight mb-5"
          style={{
            fontSize: "clamp(30px, 5vw, 44px)",
            color: "var(--color-text-strong)",
            letterSpacing: "-0.02em",
          }}
        >
          Ne rate plus aucune démarche
          <br />
          administrative importante
        </h1>

        {/* Sous-titre */}
        <p
          className="mb-9"
          style={{
            fontSize: 18,
            color: "var(--color-text-soft)",
            lineHeight: 1.6,
            maxWidth: 480,
            margin: "0 auto 36px",
          }}
        >
          En 5 questions, on identifie les démarches prioritaires
          pour ta situation et on t'explique comment les faire.
        </p>

        {/* CTA principal */}
        <Link
          href="/questionnaire"
          className="btn-primary"
          style={{ fontSize: 17, padding: "14px 32px", borderRadius: 12 }}
        >
          Commencer le questionnaire
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        {/* Micro-texte de réassurance */}
        <p
          className="mt-4"
          style={{ fontSize: 13, color: "var(--color-text-muted)" }}
        >
          2 minutes · aucune inscription · données officielles
        </p>
      </div>

      {/* ---- SÉPARATEUR ---- */}
      <div
        style={{
          width: 48,
          height: 3,
          background: "var(--color-border)",
          borderRadius: 9999,
          margin: "56px auto 48px",
        }}
      />

      {/* ---- CARTES EXEMPLES ---- */}
      <p
        className="mb-6 font-semibold"
        style={{ color: "var(--color-text-soft)", fontSize: 13, letterSpacing: "0.06em", textTransform: "uppercase" }}
      >
        Exemples de démarches détectées
      </p>

      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left"
        style={{ maxWidth: 620 }}
      >
        {exemples.map((ex) => (
          <div
            key={ex.sigle}
            style={{
              background: ex.bg,
              border: `1px solid ${ex.border}`,
              borderRadius: 14,
              padding: "20px",
            }}
          >
            <span
              className="inline-block font-bold mb-2"
              style={{ fontSize: 22, color: ex.couleur }}
            >
              {ex.sigle}
            </span>
            <p
              className="font-semibold mb-1"
              style={{ fontSize: 14, color: "var(--color-text-strong)" }}
            >
              {ex.titre}
            </p>
            <p style={{ fontSize: 13, color: "var(--color-text-soft)", lineHeight: 1.55 }}>
              {ex.description}
            </p>
          </div>
        ))}
      </div>

      {/* ---- CONFIANCE ---- */}
      <p
        className="mt-12"
        style={{ fontSize: 13, color: "var(--color-text-muted)", maxWidth: 420 }}
      >
        Toutes les informations viennent de{" "}
        <span style={{ color: "var(--color-text-soft)", fontWeight: 600 }}>
          Service-Public.fr, CAF.fr et Ameli.fr
        </span>
        . Aucune publicité, aucun partenaire commercial.{" "}
        <a href="/sources" style={{ color: "var(--color-primary)" }}>
          En savoir plus
        </a>
        .
      </p>

    </div>
  );
}
