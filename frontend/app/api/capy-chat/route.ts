import { NextRequest, NextResponse } from "next/server";

interface CapyRequest {
  question: string;
  demarches: Array<{ id: string; titre: string; description_simple: string; documents: string[] }>;
}

// Fallback keyword matching (côté serveur)
function getKeywordFallback(question: string, demarches: CapyRequest["demarches"]): string {
  const input = question.toLowerCase();

  if (input.includes("commence") || input.includes("début") || input.includes("priorité")) {
    return `Commence par les démarches marquées en vert. Ce sont les plus urgentes : ${demarches
      .slice(0, 2)
      .map((d) => d.titre)
      .join(", ")}.`;
  } else if (input.includes("document") || input.includes("papier") || input.includes("justificatif")) {
    const allDocs = demarches
      .filter((d) => d.documents.length > 0)
      .flatMap((d) => d.documents.slice(0, 2));
    const uniqueDocs = [...new Set(allDocs)];
    if (uniqueDocs.length > 0) {
      return `Documents à préparer : ${uniqueDocs.slice(0, 5).join(", ")}. Demande à ta famille ce que tu n'as pas.`;
    }
    return "Regroupe les documents listés sous chaque démarche.";
  } else if (input.includes("pourquoi") || input.includes("important") || input.includes("obligatoire")) {
    return "Chaque démarche te protège ou t'aide financièrement. C'est pas optionnel, c'est vital.";
  } else if (input.includes("source") || input.includes("officiel") || input.includes("vérifier")) {
    return "Clique sur les boutons 'Lien officiel'. C'est la source directe du gouvernement, le plus fiable.";
  } else if (input.includes("upload") || input.includes("fichier") || input.includes("envoyer document")) {
    return "Bientôt tu pourras envoyer tes documents ici. Pour l'instant, suis les liens officiels.";
  } else {
    return "Je peux t'aider sur : par quoi commencer, les documents, pourquoi c'est important, ou les sources officielles. Pose une question là-dessus !";
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
      return NextResponse.json({ response: getKeywordFallback(question, demarches) });
    }

    // Vérifier clé Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log("[Capy] Gemini API key missing → fallback mode enabled");
      return NextResponse.json({ response: getKeywordFallback(question, demarches) });
    }

    console.log("[Capy] Gemini API key detected → using LLM for response");


    // Appeler Gemini
    const demarachesText = demarches
      .map((d) => `${d.titre}: ${d.description_simple}. Documents: ${d.documents.join(", ")}`)
      .join("\n");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Tu es Capy, assistant administratif pour jeunes adultes.
Tu réponds uniquement à partir des démarches fournies.
Tu n'inventes jamais d'aide, de droit, de condition ou de lien.
Tu expliques simplement ce qu'il faut faire.
Tu ne remplaces pas un agent public.
Réponds court, humain, concret (1-3 phrases max).

Démarches disponibles:
${demarachesText}

Question: ${question}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 120,
        },
      }),
      // @ts-ignore - signal not fully typed
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[Capy] Gemini status:", response.status);
      console.error("[Capy] Gemini body:", errorBody);
      throw new Error(`Gemini API error ${response.status}`);
    }

    const data = await response.json();
    const llmResponse = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (llmResponse) {
      console.log("[Capy] LLM response generated successfully");
      return NextResponse.json({ response: llmResponse });
    }

    console.log("[Capy] LLM returned empty response → using fallback");
    return NextResponse.json({ response: getKeywordFallback(question, demarches) });
  } catch (error) {
    console.warn("[Capy] Gemini API error → using fallback", error);
    return NextResponse.json({ response: getKeywordFallback(question, demarches) });
  }
}
