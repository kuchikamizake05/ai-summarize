export const allowedModels = [
  "openai/gpt-3.5-turbo",
  "mistralai/devstral-small:free",
  "meta-llama/llama-3-8b-instruct",
  "anthropic/claude-3.5-haiku",
];

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MAX_TEXT_LENGTH = 20000;
const summaryModes = {
  bullets: "Return 5-7 concise bullet points with the core ideas.",
  executive: "Return an executive summary with context, key points, and conclusion.",
  actions: "Return action items, decisions, and follow-up steps as bullets.",
  simple: "Explain the text simply in plain language for a beginner.",
};

export class RequestError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const summarizeText = async ({ text, model, mode = "bullets", apiKey, origin }) => {
  const cleanText = typeof text === "string" ? text.trim() : "";
  const selectedModel = typeof model === "string" ? model : "";
  const selectedMode = summaryModes[mode] ? mode : "bullets";

  if (!apiKey) {
    throw new RequestError("OPENROUTER_API_KEY belum tersedia di server.", 500);
  }

  if (!cleanText) {
    throw new RequestError("Teks ringkasan tidak boleh kosong.");
  }

  if (cleanText.length > MAX_TEXT_LENGTH) {
    throw new RequestError(`Teks terlalu panjang. Maksimal ${MAX_TEXT_LENGTH} karakter.`);
  }

  if (!allowedModels.includes(selectedModel)) {
    throw new RequestError("Model tidak valid.");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": origin || "http://localhost",
      "X-Title": "AI Summarizer",
    },
    body: JSON.stringify({
      model: selectedModel,
      messages: [
        {
          role: "system",
          content: `You summarize text clearly and concisely. Answer only with the summary. Keep the same language as the user. ${summaryModes[selectedMode]}`,
        },
        {
          role: "user",
          content: `Summarize this text:\n\n${cleanText}`,
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new RequestError(data?.error?.message || "OpenRouter request failed.", response.status);
  }

  const summary = data?.choices?.[0]?.message?.content?.trim();

  if (!summary) {
    throw new RequestError("API tidak mengembalikan ringkasan.", 502);
  }

  return { summary };
};
