import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { RequestError, summarizeText } from "./api/_summarize.js";

const readRequestBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];

    req.on("data", (chunk) => chunks.push(chunk));
    req.on("error", reject);
    req.on("end", () => {
      try {
        const rawBody = Buffer.concat(chunks).toString("utf8");
        resolve(rawBody ? JSON.parse(rawBody) : {});
      } catch (error) {
        reject(error);
      }
    });
  });

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

const summarizeDevMiddleware = (apiKey) => ({
  name: "summarize-dev-api",
  configureServer(server) {
    server.middlewares.use("/api/summarize", async (req, res) => {
      if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        sendJson(res, 405, { error: "Method not allowed." });
        return;
      }

      try {
        const body = await readRequestBody(req);
        const result = await summarizeText({
          text: body.text,
          model: body.model,
          mode: body.mode,
          apiKey,
          origin: "http://localhost",
        });
        sendJson(res, 200, result);
      } catch (error) {
        const statusCode = error instanceof RequestError ? error.statusCode : 500;
        const message = error instanceof Error ? error.message : "Terjadi kesalahan server.";
        sendJson(res, statusCode, { error: message });
      }
    });
  },
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [summarizeDevMiddleware(env.OPENROUTER_API_KEY), react(), tailwindcss()],
  };
});
