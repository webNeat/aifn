import { Ollama } from 'ollama'
import { OpenAI } from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { FnConfig } from './types.js'
import { openai_fn } from './openai.js'
import { gemini_fn } from './gemini.js'
import { ollama_fn } from './ollama.js'
import { anthropic_fn } from './anthropic.js'

export function fn<Args, R>(config: FnConfig<Args, R>) {
  if (config.client instanceof OpenAI) return openai_fn(config.client, config)
  if (config.client instanceof Anthropic) return anthropic_fn(config.client, config)
  if (config.client instanceof GoogleGenerativeAI) return gemini_fn(config.client, config)
  if (config.client instanceof Ollama) return ollama_fn(config.client, config)
  throw new Error(`Unknown client: ${config.client}`)
}
