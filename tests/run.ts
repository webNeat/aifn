import { Ollama } from 'ollama'
import { llm } from '../src/index.js'
import type { LLM } from '../src/types.js'
import { text } from './suites/index.js'
import { run } from './utils.js'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'

const client = new Ollama()
const models: string[] = [
  'smollm2:1.7b', // 11 - 14
  // 'granite3-moe:3b', // 11
  // 'nemotron-mini:4b', // 17
  // 'qwen2.5:7b', // 26
  // 'mistral:7b', // 23
  // 'qwen2.5-coder:7b', // 29
  // 'llama3.1:8b', // 30
  // 'granite3-dense:8b',
  // 'aya-expanse:8b',
  // 'hermes3:8b',
  // 'mistral-nemo:12b',
  // 'qwen2.5:14b',
  // 'qwq',
]
const llms: Record<string, LLM> = {}
const suites = { text }

for (const model of models) {
  llms[model] = llm.ollama(client, model, { num_thread: 6 })
}
console.log(await run(llms, suites))
