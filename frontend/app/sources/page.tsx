import demarchesData from "../../data/demarches.json";

const { page_sources } = demarchesData;

export default function SourcesPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
        Transparence & Sources
      </h1>
      <p className="text-gray-500 mb-10">
        Ce que cette application fait, comment elle le fait, et ce qu'elle ne
        fait pas.
      </p>

      {/* Question 1 : D'ou viennent les donnees ? */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-700 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">
            1
          </span>
          D'ou viennent les donnees ?
        </h2>
        <p className="text-gray-600 mb-5">
          {page_sources.description} Voici les sources utilisees :
        </p>
        <div className="flex flex-col gap-4">
          {page_sources.sources.map((source) => (
            <div
              key={source.nom}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-bold text-gray-900">{source.nom}</h3>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium underline flex-shrink-0"
                >
                  Visiter
                </a>
              </div>
              <p className="text-gray-600 text-sm mb-3">{source.description}</p>
              <p className="text-xs text-gray-400">
                Couvre :{" "}
                {source.demarches_couvertes.map((id) => (
                  <span
                    key={id}
                    className="inline-block bg-gray-100 text-gray-600 rounded px-1.5 py-0.5 mr-1 mb-1"
                  >
                    {id}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Verifie le : {page_sources.date_verification} — {page_sources.note}
        </p>
      </section>

      {/* Question 2 : Comment fonctionne le matching ? */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-700 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">
            2
          </span>
          Comment fonctionne le matching ?
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-sm text-gray-700 space-y-3">
          <p>
            Le matching est une logique de filtrage statique basee sur tes
            reponses au questionnaire. Il n'y a ni intelligence artificielle,
            ni algorithme complexe.
          </p>
          <p>
            <strong>Etape 1 — Filtrage par statut :</strong> chaque demarche a
            une liste "pour_qui" (etudiant, alternant, premier_emploi,
            etudiant_etranger). On garde uniquement les demarches qui
            correspondent a ton statut.
          </p>
          <p>
            <strong>Etape 2 — Ajustement par logement :</strong> si tu es
            encore chez tes parents, on retire les demarches liees au premier
            appartement (APL, assurance habitation, checklist). Si tu
            emmenages, on s'assure qu'elles apparaissent.
          </p>
          <p>
            <strong>Etape 3 — Filtrage par besoin :</strong> si tu as un
            besoin prioritaire (sante, transport, etc.), on garde toutes les
            demarches P1 et on filtre les P2/P3 vers ta categorie d'interet.
          </p>
          <p>
            <strong>Etape 4 — Tri :</strong> les demarches sont toujours
            affichees par priorite (P1 en rouge en premier, P2 ensuite),
            l'ordre est fixe et ne depend pas de l'utilisateur.
          </p>
        </div>
      </section>

      {/* Question 3 : Limites */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-700 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold flex-shrink-0">
            3
          </span>
          Quelles sont les limites ?
        </h2>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-900 space-y-3">
          <p className="font-semibold">Ce que CapAutonomie ne fait PAS :</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              L'application ne verifie pas ton eligibilite reelle a une aide —
              les conditions officielles peuvent changer.
            </li>
            <li>
              Elle ne couvre pas toutes les situations (ex : handicap,
              situations familiales complexes, cas speciaux).
            </li>
            <li>
              Elle ne remplace pas les conseils d'un assistant social, d'un
              CROUS ou d'un conseiller CAF.
            </li>
            <li>
              La ville que tu renseignes n'est pas encore utilisee pour filtrer
              des aides locales (fonctionnalite a venir).
            </li>
            <li>
              Les montants (ex : "jusqu'a 300€/mois d'APL") sont des
              estimations — le montant reel depend de ta situation precise.
            </li>
          </ul>
          <p className="font-semibold mt-4">
            Toujours verifier sur le site officiel de l'organisme avant de faire
            une demarche.
          </p>
        </div>
      </section>

      {/* CTA retour */}
      <div className="text-center pt-4">
        <a
          href="/questionnaire"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl transition-colors"
        >
          Faire le questionnaire
        </a>
      </div>
    </div>
  );
}
