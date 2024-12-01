import type { Err } from 'wari'
import type { ZodSchema } from 'zod'
import type { Ollama } from 'ollama'
import type { OpenAI } from 'openai'
import type Anthropic from '@anthropic-ai/sdk'
import type { GoogleGenerativeAI } from '@google/generative-ai'

export type Client = OpenAI | Anthropic | GoogleGenerativeAI | Ollama

export type LLM = {
  provider: string
  client?: any
  model?: string
  generate: (req: LLMRequest) => Promise<LLMResponse>
}

export type LLMRequest = {
  system: string
  messages: Message[]
  output_schema?: ZodSchema<any>
}

export type LLMResponse =
  | { type: 'text'; content: string; response: any }
  | { type: 'json'; data: unknown; response: any }
  | { type: 'error'; error: unknown }

export type Message = {
  role: 'user' | 'assistant'
  content: string
}

export type FnConfig<A, R> = {
  llm: LLM
  description: string
  input: ZodSchema<A>
  output: ZodSchema<R>
  examples?: Array<{ input: A; output: R }>
}

export interface Fn<A, R> {
  (args: A): Promise<R>
  config: FnConfig<A, R>
  mock: (implementation: (args: A) => Promise<R>) => void
  unmock: () => void
}

declare module 'wari' {
  interface ErrorTypes {
    LLMRequestFailed: {
      provider: string
      client: any
      method: string
      options: any
      error: unknown
    }
    InvalidOutput: {
      config: FnConfig<any, any>
      args: any
      schema: ZodSchema<any>
      result: any
      error: unknown
    }
    UnstructuredOutput: {
      config: FnConfig<any, any>
      args: any
      output: string
    }
  }
}
