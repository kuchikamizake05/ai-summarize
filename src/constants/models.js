export const models = [
  { value: "openai/gpt-3.5-turbo", label: "GPT 3.5 Turbo", tone: "Cepat" },
  { value: "mistralai/devstral-small:free", label: "Mistral Devstral", tone: "Free" },
  { value: "meta-llama/llama-3-8b-instruct", label: "Llama 3", tone: "Balanced" },
  { value: "anthropic/claude-3.5-haiku", label: "Claude 3.5 Haiku", tone: "Rapi" },
];

export const modelValues = models.map((model) => model.value);
