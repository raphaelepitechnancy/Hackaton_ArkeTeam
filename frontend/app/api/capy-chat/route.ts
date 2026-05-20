import { NextRequest, NextResponse } from "next/server";

interface CapyRequest {
  question: string;
  demarches: Array<{ id: string; titre: string; description_simple: string; documents: string[]; priorite?: number }>;
}

// Détection d'intention
type Intention =
  | "start" | "documents" | "why" | "sources" | "next_step"
  | "done" | "lost" | "upload" | "other";

function detectIntention(question: string): Intention {
  const input = question.toLowerCase();

  if (input.match(/commence|début|priorité|par où|où commence|d'abord|au début/i)) {
    return "start";
  }
  if (input.match(/document|papier|justificatif|pièce|dossier|à préparer/i)) {
    return "documents";
  }
  if (input.match(/pourquoi|important|utile|obligatoire|obligé|intérêt|avantage|bénéfice/i)) {
    return "why";
  }
  if (input.match(/source|officiel|vérifier|confiance|fiable|lien|site|gouvernement/i)) {
    return "sources";
  }
  if (input.match(/ensuite|après|suivant|prochaine|next|étape suivante|suite/i)) {
    return "next_step";
  }
  if (input.match(/fait|terminé|ok|super|validé|c'est bon|c'est fait|done|fini/i)) {
    return "done";
  }
  if (input.match(/perdu|stress|comprends pas|galère|compliqué|difficile|pas claire|aide|secours/i)) {
    return "lost";
  }
  if (input.match(/upload|envoyer|document|courrier|fichier|importer|joindre|transmettre|mail/i)) {
    return "upload";
  }

  return "other";
}

// Réponse locale contextualisée (fallback)
function getLocalCapyResponse(
  question: string,
  demarches: CapyRequest["demarches"]
): string {
  const intention = detectIntention(question);
  const p1Safe = demarches.filter((d) => (d.priorite ?? 2) === 1);
  const p2Safe = demarches.filter((d) => (d.priorite ?? 2) > 1);

  const hasManyDemarches = demarches.length >= 4;
  const hasDocuments = demarches.some((d) => d.documents && d.documents.length > 0);

  switch (intention) {
    case "start":
      if (p1Safe.length > 0) {
        const titles = p1Safe.slice(0, 2).map((d) => d.titre).join(" et ");
        return `Commence par les cartes vertes : c'est ${titles} en priorité. C'est le plus urgent pour ta situation.`;
      }
      return "Commence par les démarches affichées en vert. Ce sont les plus importantes pour toi.";

    case "documents":
      if (!hasDocuments) {
        return "Peu de documents pour ces démarches. Regarde la liste sous chaque carte pour ce qu'il te faut.";
      }
      const allDocs = demarches
        .filter((d) => d.documents && d.documents.length > 0)
        .flatMap((d) => (d.documents || []).slice(0, 2));
      const uniqueDocs = [...new Set(allDocs)].slice(0, 4);
      return `À préparer : ${uniqueDocs.join(", ")}. Demande à ta famille si tu n'as pas tout, c'est normal.`;

    case "why":
      if (demarches.length > 0 && demarches[0]) {
        const example = demarches[0].titre;
        return `${example} : ça te protège ou t'aide financièrement. C'est pas du luxe, c'est vital pour ta stabilité.`;
      }
      return "Chaque démarche te protège ou t'aide concrètement. C'est pas optionnel pour ta situation.";

    case "sources":
      return "Clique sur 'Lien officiel' dans chaque carte. C'est direct du gouvernement : CAF, Ameli, impots.gouv… le plus fiable.";

    case "next_step":
      if (hasManyDemarches && p2Safe.length > 0 && p2Safe[0]) {
        const nextTitle = p2Safe[0].titre;
        return `Une fois les vertes faites, passe à ${nextTitle}. Les priorités suivent un ordre pour être plus facile.`;
      }
      return "Une fois les démarches vertes faites, regarde les autres en ordre. C'est comme ça que c'est pensé.";

    case "done":
      const remaining = demarches.length - 1;
      if (remaining > 0) {
        return `Super ! 👍 ${remaining} autres démarches t'attendent. On continue doucement, sans stress.`;
      }
      return "Bravo ! Tu as pris les bonnes étapes. C'était pas si compliqué, hein ?";

    case "lost":
      return "Pas de souci, on va faire simple. Regarde les cartes vertes, ce sont les plus importantes. Commence par celle qui te parle le plus.";

    case "upload":
      return "C'est une bonne question ! Envoyer des docs, c'est pas encore possible ici, mais c'est prévu. Pour l'instant, suis les liens officiels et contact direct.";

    case "other":
      const tips = [
        "Je peux t'aider sur les démarches affichées, les documents, ou pourquoi c'est important.",
        "Pose une question sur ce que tu vois : comment commencer, quels documents, pourquoi c'est utile…",
        "Tu peux me demander par quoi commencer, ce qu'il faut préparer, ou où vérifier les infos.",
      ];
      return tips[Math.floor(Math.random() * tips.length)];

    default:
      return "Je suis là pour t'aider avec les démarches affichées. Pose-moi une question !";
  }
}

// Appel Ollama local avec timeout et fallback
async function getOllamaResponse(question: string, demarches: CapyRequest["demarches"]): Promise<string | null> {
  try {
    // Construire le contexte des démarches
    const demarachesContext = demarches
      .map((d) => `- ${d.titre}: ${d.description_simple} (Documents: ${d.documents.join(", ")})`)
      .join("\n");

    const prompt = `Tu es Capy, un assistant administratif sympa pour jeunes adultes de 18-25 ans en France.
Tu répondS court (max 3 phrases), naturel, sans jargon administratif, comme on parlerait entre potes.
RÈGLE ABSOLUE: Tu répondS UNIQUEMENT à partir des démarches listées ci-dessous. Jamais tu n'inventes d'aide, de droit ou de condition qui ne sont pas dans la liste.

Démarches qu'on affiche à l'utilisateur:
${demarachesContext}

Question de l'utilisateur: "${question}"

Réponds en français naturel, jeune, rassurante, max 3 courtes phrases:`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2:3b",
        prompt,
        stream: false,
      }),
      // @ts-ignore
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.warn(`[Capy] Ollama error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const text = data.response?.trim();

    if (!text) {
      console.warn("[Capy] Ollama returned empty response");
      return null;
    }

    console.log("[Capy] Ollama response generated");
    return text;
  } catch (error) {
    console.warn("[Capy] Ollama unavailable, using fallback", error instanceof Error ? error.message : String(error));
    return null;
  }
}

export async function POST(req: NextRequest) {
  let question = "";
  let demarches: CapyRequest["demarches"] = [];

  try {
    const body: CapyRequest = await req.json();
    question = body.question || "";
    demarches = body.demarches || [];

    if (!question || !demarches) {
      return NextResponse.json({ response: getLocalCapyResponse(question, demarches) });
    }

    // Essayer Ollama d'abord
    console.log("[Capy] Trying Ollama local LLM");
    const ollamaResponse = await getOllamaResponse(question, demarches);

    if (ollamaResponse) {
      return NextResponse.json({ response: ollamaResponse });
    }

    // Fallback à la détection d'intention locale
    console.log("[Capy] Falling back to local intention detection");
    const localResponse = getLocalCapyResponse(question, demarches);
    return NextResponse.json({ response: localResponse });
  } catch (error) {
    console.warn("[Capy] Request processing error", error);
    return NextResponse.json({ response: "Je peux t'aider ! Pose une question sur tes démarches." });
  }
}
