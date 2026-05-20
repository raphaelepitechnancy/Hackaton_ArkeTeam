import { getSources, getSourcesMeta } from "../../lib/db";

const sources_list = getSources();
const page_sources_meta = getSourcesMeta();

function IconArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function SourcesPage() {
  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>

      {/* ---- EN-TÊTE ---- */}
      <div className="mb-10">
        <h1
          className="font-extrabold mb-3"
          style={{
            fontSize: "clamp(24px, 4vw, 34px)",
            color: "var(--color-text-strong)",
            letterSpacing: "-0.015em",
          }}
        >
          Transparence &amp; Sources
        </h1>
        <p style={{ fontSize: 16, color: "var(--color-text-soft)", lineHeight: 1.6, maxWidth: 500 }}>
          Ce que cette application fait, comment elle le fait,
          et ce qu'elle ne fait pas.
        </p>
      </div>

      {/* ---- SECTION 1 : D'où viennent les données ? ---- */}
      <section className="mb-10">
        <h2
          className="font-bold mb-5 flex items-center gap-3"
          style={{ fontSize: 19, color: "var(--color-text-strong)" }}
        >
          <span className="numero-section">1</span>
          D'où viennent les données ?
        </h2>

        <p
          className="mb-5"
          style={{ fontSize: 15, color: "var(--color-text-body)", lineHeight: 1.65 }}
        >
          {page_sources_meta.description}
        </p>

        <div className="flex flex-col gap-4">
          {sources_list.map((source) => (
            <div
              key={source.nom}
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: 14,
                padding: "20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3
                  className="font-bold"
                  style={{ fontSize: 15, color: "var(--color-text-strong)" }}
                >
                  {source.nom}
                </h3>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-primary)",
                    flexShrink: 0,
                  }}
                >
                  Visiter
                  <IconArrow />
                </a>
              </div>

              <p
                className="mb-3"
                style={{ fontSize: 13, color: "var(--color-text-soft)", lineHeight: 1.6 }}
              >
                {source.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {source.demarches_couvertes.map((id) => (
                  <span
                    key={id}
                    style={{
                      display: "inline-block",
                      fontSize: 11,
                      fontWeight: 500,
                      background: "var(--color-bg)",
                      color: "var(--color-text-soft)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 6,
                      padding: "2px 8px",
                    }}
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p
          className="mt-4"
          style={{ fontSize: 12, color: "var(--color-text-muted)" }}
        >
          Vérifié le : {page_sources_meta.date_verification} — {page_sources_meta.note}
        </p>
      </section>

      {/* ---- SECTION 2 : Comment fonctionne le matching ? ---- */}
      <section className="mb-10">
        <h2
          className="font-bold mb-5 flex items-center gap-3"
          style={{ fontSize: 19, color: "var(--color-text-strong)" }}
        >
          <span className="numero-section">2</span>
          Comment fonctionne le matching ?
        </h2>

        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 14,
            padding: "22px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          {[
            {
              label: "Filtrage par statut",
              texte:
                "Chaque démarche a une liste «pour qui» (étudiant, alternant…). On garde uniquement celles qui correspondent à ta situation.",
            },
            {
              label: "Ajustement par logement",
              texte:
                "Si tu es encore chez tes parents, on retire les démarches liées au premier appartement (APL, assurance…). Si tu emménages, on s'assure qu'elles apparaissent.",
            },
            {
              label: "Filtrage par besoin",
              texte:
                "Si tu as un besoin prioritaire (santé, transport…), on garde toutes les démarches P1 et on filtre les P2/P3 vers ta catégorie.",
            },
            {
              label: "Tri final",
              texte:
                "Les démarches sont toujours affichées par priorité (P1 en vert en premier, P2 ensuite). L'ordre est fixe.",
            },
          ].map((etape, i) => (
            <div
              key={i}
              className="flex gap-4"
              style={{
                paddingBottom: i < 3 ? "16px" : 0,
                marginBottom: i < 3 ? "16px" : 0,
                borderBottom: i < 3 ? "1px solid var(--color-border-soft)" : "none",
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "var(--color-primary-light)",
                  color: "var(--color-primary)",
                  fontSize: 12,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {i + 1}
              </span>
              <div>
                <p
                  className="font-semibold mb-1"
                  style={{ fontSize: 14, color: "var(--color-text-strong)" }}
                >
                  {etape.label}
                </p>
                <p style={{ fontSize: 13, color: "var(--color-text-soft)", lineHeight: 1.6 }}>
                  {etape.texte}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- SECTION 3 : Limites ---- */}
      <section className="mb-12">
        <h2
          className="font-bold mb-5 flex items-center gap-3"
          style={{ fontSize: 19, color: "var(--color-text-strong)" }}
        >
          <span className="numero-section">3</span>
          Quelles sont les limites ?
        </h2>

        <div className="encart-limite">
          <p
            className="font-bold mb-4"
            style={{ fontSize: 14, color: "#92400E" }}
          >
            Ce que CapAutonomie ne fait PAS :
          </p>
          <ul className="flex flex-col gap-3">
            {[
              "L'application ne vérifie pas ton éligibilité réelle à une aide — les conditions officielles peuvent changer.",
              "Elle ne couvre pas toutes les situations (ex : handicap, situations familiales complexes, cas spéciaux).",
              "Elle ne remplace pas les conseils d'un assistant social, d'un CROUS ou d'un conseiller CAF.",
              "La ville que tu renseignes n'est pas encore utilisée pour filtrer des aides locales (fonctionnalité à venir).",
              "Les montants (ex : «jusqu'à 300 €/mois d'APL») sont des estimations — le montant réel dépend de ta situation précise.",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2"
                style={{ fontSize: 13, lineHeight: 1.6 }}
              >
                <span style={{ flexShrink: 0, marginTop: 3 }}>•</span>
                {item}
              </li>
            ))}
          </ul>
          <p
            className="font-bold mt-5"
            style={{ fontSize: 13, color: "#78350F" }}
          >
            Toujours vérifier sur le site officiel de l'organisme avant de faire une démarche.
          </p>
        </div>
      </section>

      {/* ---- CTA RETOUR ---- */}
      <div className="text-center">
        <a
          href="/questionnaire"
          className="btn-primary"
          style={{ fontSize: 15, padding: "13px 30px" }}
        >
          Faire le questionnaire
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

    </div>
  );
}
