import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] text-center px-4">
      {/* Badge */}
      <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full mb-6">
        Pour les 18-25 ans qui deviennent autonomes
      </span>

      {/* Titre principal */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4 max-w-2xl">
        Ne rate plus aucune démarche administrative importante
      </h1>

      {/* Sous-titre */}
      <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-xl">
        En 5 questions, on identifie les démarches prioritaires selon ta
        situation et on t'explique comment les faire.
      </p>

      {/* CTA principal */}
      <Link
        href="/questionnaire"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-md transition-colors"
      >
        Commencer le questionnaire
      </Link>

      {/* Reassurance */}
      <p className="text-sm text-gray-400 mt-4">
        2 minutes — aucune inscription — données officielles
      </p>

      {/* 3 points clés */}
      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full text-left">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="text-2xl mb-2">APL</div>
          <p className="font-semibold text-gray-800 text-sm">
            Aide au logement
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Jusqu'a 300€/mois que tu peux toucher dès le 1er mois
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="text-2xl mb-2">Secu</div>
          <p className="font-semibold text-gray-800 text-sm">
            Securite sociale
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Prends ton autonomie a 18 ans, cree ton compte Ameli
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="text-2xl mb-2">Impots</div>
          <p className="font-semibold text-gray-800 text-sm">
            1ere declaration
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Obligatoire meme si tu ne dois rien — 15 minutes en ligne
          </p>
        </div>
      </div>
    </div>
  );
}
