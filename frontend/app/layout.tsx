import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CapAutonomie - Tes démarches en 5 minutes",
  description:
    "Trouve les démarches administratives essentielles quand tu deviens autonome.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <a
            href="/"
            className="text-lg font-bold text-blue-700 hover:text-blue-800"
          >
            CapAutonomie
          </a>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-8">{children}</main>
        <footer className="text-center text-sm text-gray-400 py-6 border-t border-gray-200 mt-8">
          Données issues de sources officielles (Service-Public.fr, CAF.fr,
          Ameli.fr…) —{" "}
          <a href="/sources" className="underline hover:text-blue-600">
            Voir les sources
          </a>
        </footer>
      </body>
    </html>
  );
}
