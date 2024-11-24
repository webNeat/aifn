import type { ZodSchema } from 'zod'
import type { Ollama } from 'ollama'
import type { OpenAI } from 'openai'
import type Anthropic from '@anthropic-ai/sdk'
import type { GoogleGenerativeAI } from '@google/generative-ai'

export type FnConfig<A, R> = {
  client: OpenAI | Anthropic | GoogleGenerativeAI | Ollama
  model: string
  system: string
  input: ZodSchema<A>
  output: ZodSchema<R>
  examples?: Array<{ input: A; output: R }>
}
