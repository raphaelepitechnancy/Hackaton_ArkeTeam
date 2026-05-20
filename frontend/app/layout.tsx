import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "CapAutonomie — Tes démarches en 5 minutes",
  description:
    "En 5 questions, trouve les démarches administratives essentielles pour ta situation. Sources officielles, zéro jargon.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
        {/* HEADER */}
        <header
          style={{
            background: "var(--color-surface)",
            borderBottom: "1px solid var(--color-border)",
          }}
          className="px-6 py-4 flex items-center justify-between"
        >
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg"
            style={{ color: "var(--color-primary)" }}
          >
            {/* Logo mark simple */}
            <span
              style={{
                width: 28,
                height: 28,
                background: "var(--color-primary)",
                borderRadius: 8,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 14,
                fontWeight: 800,
                flexShrink: 0,
              }}
            >
              C
            </span>
            CapAutonomie
          </Link>

          <Link
            href="/sources"
            className="text-sm font-medium"
            style={{ color: "var(--color-text-soft)" }}
          >
            Transparence
          </Link>
        </header>

        {/* CONTENU PRINCIPAL */}
        <main className="flex-1 w-full">
          {children}
        </main>

        {/* FOOTER */}
        <footer
          style={{
            borderTop: "1px solid var(--color-border)",
            background: "var(--color-surface)",
          }}
          className="text-center py-5 px-4"
        >
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Données issues de sources officielles (Service-Public.fr, CAF.fr, Ameli.fr…){" "}
            <span style={{ color: "var(--color-border)" }}>—</span>{" "}
            <Link
              href="/sources"
              className="underline"
              style={{ color: "var(--color-text-soft)" }}
            >
              Voir les sources
            </Link>
          </p>
        </footer>
      </body>
    </html>
  );
}
