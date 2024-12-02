export const models = {
  openai: [
    "gpt-4o-2024-11-20",
    "gpt-4o-mini-2024-07-18",
    "o1-preview-2024-09-12",
    "o1-mini-2024-09-12",
  ],
  anthropic: [
    "claude-3-5-sonnet-20241022",
    "claude-3-5-haiku-20241022",
    "claude-3-opus-20240229",
    "claude-3-sonnet-20240229",
    "claude-3-haiku-20240307",
  ],
  gemini: [
    "gemini-1.5-pro",
    "gemini-1.5-flash",
    "gemini-exp-1114",
    "gemini-exp-1121",
  ],
  ollama: [
    "smollm2",
    "aya-expanse",
    "granite3-dense",
    "llama3.2:3b",
    "llama3.1:8b",
    "qwen2.5:3b",
    "qwen2.5:7b",
    "qwen2.5:14b",
    "mistral-nemo",
  ],
} as const;
