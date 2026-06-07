import { RequestError, summarizeText } from "./_summarize.js";

const readBody = async (req) => {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    try {
      return req.body ? JSON.parse(req.body) : {};
    } catch {
      throw new RequestError("Body JSON tidak valid.");
    }
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  try {
    return rawBody ? JSON.parse(rawBody) : {};
  } catch {
    throw new RequestError("Body JSON tidak valid.");
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const body = await readBody(req);
    const result = await summarizeText({
      text: body.text,
      model: body.model,
      mode: body.mode,
      apiKey: process.env.GROQ_API_KEY,
    });

    return res.status(200).json(result);
  } catch (error) {
    const statusCode = error instanceof RequestError ? error.statusCode : 500;
    const message = error instanceof Error ? error.message : "Terjadi kesalahan server.";
    return res.status(statusCode).json({ error: message });
  }
}
