/**
 * llm.ts — CapAutonomie
 *
 * Couche optionnelle de reformulation par LLM.
 *
 * Principe : l'API OpenAI est un PLUS, pas une dépendance.
 * Si la clé est absente, si l'API est lente (>3s) ou si elle plante,
 * on retombe systématiquement sur le texte statique.
 *
 * Ce que cette couche PEUT faire :
 *   - Reformuler une description existante en langage simple
 *   - Adapter le ton pour un jeune adulte (18-25 ans)
 *   - Rendre le texte rassurant ("c'est pas si compliqué")
 *
 * Ce que cette couche NE PEUT PAS faire :
 *   - Ajouter une démarche non présente dans le JSON
 *   - Décider d'une éligibilité ("tu as droit à...")
 *   - Inventer une condition
 *   - Remplacer la logique de matching
 *   - Parler au-delà des données fournies
 *
 * IMPORTANT : les sources officielles font toujours foi.
 * La reformulation est indicative — l'utilisateur doit vérifier
 * sur le lien officiel de l'organisme.
 */

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY ?? "";
const OPENAI_ENABLED = OPENAI_API_KEY.length > 0;

/** Données d'une démarche passées au LLM pour reformulation. */
export interface SimplifyRequest {
  titre: string;
  description_simple: string;
  pour_qui: string[];
  documents: string[];
  source: string;
}

/** Résultat retourné : texte + origine pour affichage transparent. */
export interface SimplifyResult {
  text: string;
  source: "llm" | "static";
}

/**
 * Tente de reformuler `request` via OpenAI GPT-4o-mini.
 * En cas d'échec (clé absente, timeout, erreur réseau, erreur API),
 * retourne toujours `fallback` avec source "static".
 *
 * @param request   Données de la démarche à reformuler.
 * @param fallback  Texte statique garanti (explication_jeune ou description_simple).
 */
export async function simplifyWithLLM(
  request: SimplifyRequest,
  fallback: string
): Promise<SimplifyResult> {
  // Pas de clé API : fallback immédiat, zéro appel réseau.
  if (!OPENAI_ENABLED) {
    return { text: fallback, source: "static" };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 s max

    const systemPrompt = `Tu reformules uniquement les informations fournies.
Tu n'ajoutes aucune démarche, aucun droit, aucune condition absente du texte.
Tu expliques simplement à un jeune adulte (18-25 ans) ce qu'il doit comprendre.
Réponse courte (2-3 phrases), claire et rassurante.
Tu rappelles toujours qu'il faut vérifier sur la source officielle.
Tu ne fais jamais de liste, tu n'utilises pas de markdown.`;

    const userPrompt = `Démarche : ${request.titre}
Description officielle : ${request.description_simple}
Qui peut en bénéficier : ${request.pour_qui.join(", ")}
Documents requis : ${request.documents.join(", ")}
Source officielle : ${request.source}

Explique cela simplement à un jeune qui entre dans la vie adulte.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn("[llm] OpenAI API error:", response.status, response.statusText);
      return { text: fallback, source: "static" };
    }

    const data = await response.json() as {
      choices?: { message?: { content?: string } }[];
    };

    const llmText = data.choices?.[0]?.message?.content?.trim();

    if (!llmText || llmText.length === 0) {
      return { text: fallback, source: "static" };
    }

    return { text: llmText, source: "llm" };
  } catch (error) {
    // Timeout AbortError ou erreur réseau : fallback silencieux.
    console.warn("[llm] simplification failed, using fallback:", error);
    return { text: fallback, source: "static" };
  }
}

/**
 * Indique si la couche LLM est activée (clé présente au démarrage).
 * Utilisé pour afficher ou non l'indicateur "Reformulé par IA".
 */
export function isLLMAvailable(): boolean {
  return OPENAI_ENABLED;
}
