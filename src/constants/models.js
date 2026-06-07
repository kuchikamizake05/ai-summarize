export const models = [
  { value: "llama-3.3-70b-versatile", label: "Llama 3.3 70B", tone: "Rapi" },
  { value: "llama-3.1-8b-instant", label: "Llama 3.1 8B", tone: "Cepat" },
  { value: "openai/gpt-oss-120b", label: "GPT OSS 120B", tone: "Kuat" },
  { value: "openai/gpt-oss-20b", label: "GPT OSS 20B", tone: "Hemat" },
];

export const modelValues = models.map((model) => model.value);
