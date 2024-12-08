import { z } from 'zod'
import { Ollama } from 'ollama'
import { fn, llm } from '../src/index.js'
import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Anthropic from '@anthropic-ai/sdk'

const get_country_info = fn({
  llm: llm.custom(async (_) => ({ type: 'text', content: 'Nope', response: null })),
  description: 'Get information The country given by user',
  input: z.string().describe('The name of the country'),
  output: z.object({
    name: z.string().describe('The name of the country'),
    capital: z.string().describe('The capital of the country'),
    currency: z.string().describe('The currency of the country'),
  }),
})

const llms = {
  ollama: llm.ollama(new Ollama(), 'phi3:3.8b'),
  openai: llm.openai(new OpenAI(), 'gpt-4o-mini'),
  gemini: llm.gemini(new GoogleGenerativeAI(process.env.GEMINI_API_KEY!), 'gemini-1.5-flash'),
  anthropic: llm.anthropic(new Anthropic(), 'claude-3-haiku-20240307'),
}

await Promise.all(
  Object.keys(llms).map(async (name) => {
    try {
      const get_info = fn({
        ...get_country_info.config,
        llm: llms[name as keyof typeof llms],
      })
      console.log(name, await get_info('Morocco'))
    } catch (err) {
      console.error(name, err)
    }
  }),
)
