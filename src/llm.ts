import _ from 'lodash'
import * as E from 'wari'
import type { Ollama, Options as OllamaOptions } from 'ollama'
import type { OpenAI } from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import type Anthropic from '@anthropic-ai/sdk'
import type { Content, GoogleGenerativeAI } from '@google/generative-ai'
import { to_json_schema } from './utils.js'
import type { LLM, LLMRequest, LLMResponse } from './types.js'

export function ollama(client: Ollama, model: string, parameters: Partial<OllamaOptions> = {}): LLM {
  const generate = async (req: LLMRequest): Promise<LLMResponse> => {
    const options = {
      model,
      messages: [{ role: 'system', content: req.system }, ...req.messages],
      tools: req.output_schema && [
        {
          type: 'function',
          function: {
            name: 'format_output',
            description: 'Formats the output. You should always call this function to format the response.',
            parameters: to_json_schema(req.output_schema),
          },
        },
      ],
      format: req.output_schema && 'json',
      options: parameters,
    }
    const res = await E.catch(
      () => client.chat(options),
      (error) => E.new('LLMRequestFailed', { provider: 'ollama', client, method: 'chat', options, error }),
    )
    if (E.any(res)) return { type: 'error', error: res }
    const call = res.message.tool_calls?.[0]
    if (call) return { type: 'json', data: call.function.arguments, response: res }
    return E.catch(
      () => ({ type: 'json', data: JSON.parse(res.message.content), response: res }),
      () => ({ type: 'text', content: res.message.content, response: res }),
    )
  }
  return { provider: 'ollama', client, model, generate }
}

export function openai(client: OpenAI, model: string): LLM {
  const generate = async (req: LLMRequest): Promise<LLMResponse> => {
    const options = {
      model,
      messages: [{ role: 'system', content: req.system }, ...req.messages],
      response_format: req.output_schema && zodResponseFormat(req.output_schema, 'output'),
    } as Parameters<typeof client.chat.completions.create>[0]

    const res = await E.catch(
      () => client.chat.completions.create(options),
      (error) => E.new('LLMRequestFailed', { provider: 'openai', client, method: 'chat.completions.create', options, error }),
    )
    if (E.any(res)) return { type: 'error', error: res }

    const tool_call = _.get(res, 'choices.0.message.tool_calls.0')
    if (tool_call) return { type: 'json', data: JSON.parse(tool_call.function.arguments), response: res }

    const content = _.get(res, 'choices.0.message.content') || ''
    return E.catch(
      () => ({ type: 'json', data: JSON.parse(content), response: res }),
      () => ({ type: 'text', content, response: res }),
    )
  }
  return { provider: 'openai', client, model, generate }
}

export function gemini(client: GoogleGenerativeAI, model: string): LLM {
  const generate = async (req: LLMRequest): Promise<LLMResponse> => {
    const messages = req.messages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    })) as Content[]
    const options = {
      model,
      systemInstruction: req.system,
      tools: req.output_schema && [
        {
          functionDeclarations: [
            {
              name: 'format_output',
              description: 'Formats the output. You should always call this function to format the response.',
              parameters: to_json_schema(req.output_schema),
            },
          ],
        },
      ],
    }
    const res = await E.catch(
      () => client.getGenerativeModel(options).generateContent({ contents: messages }),
      (error) => E.new('LLMRequestFailed', { provider: 'gemini', client, method: 'generateContent', options: { ...options, messages }, error }),
    )
    if (E.any(res)) return { type: 'error', error: res }
    const part = res.response.candidates?.[0]?.content.parts[0]
    if (part?.functionCall) {
      return { type: 'json', data: part.functionCall.args, response: res }
    }
    const content = part?.text || ''
    return E.catch(
      () => ({ type: 'json', data: JSON.parse(content), response: res }),
      () => ({ type: 'text', content, response: res }),
    )
  }
  return { provider: 'gemini', client, model, generate }
}

export function anthropic(client: Anthropic, model: string): LLM {
  const generate = async (req: LLMRequest): Promise<LLMResponse> => {
    const options = {
      model,
      max_tokens: 4000,
      system: req.system,
      messages: req.messages,
      tools: req.output_schema && [
        {
          name: 'format_output',
          description: 'Formats the output. You should always call this function to format the response.',
          input_schema: to_json_schema(req.output_schema),
        },
      ],
      tool_choice: req.output_schema && { type: 'tool' as const, name: 'format_output' },
    }

    const res = await E.catch(
      () => client.messages.create(options),
      (error) => E.new('LLMRequestFailed', { provider: 'anthropic', client, method: 'messages.create', options, error }),
    )
    if (E.any(res)) return { type: 'error', error: res }

    const tool_call = res.content.find((x) => x.type === 'tool_use')
    if (tool_call) return { type: 'json', data: tool_call.input, response: res }

    const content = (res.content[0] as any)?.text || ''
    return E.catch(
      () => ({ type: 'json', data: JSON.parse(content), response: res }),
      () => ({ type: 'text', content, response: res }),
    )
  }
  return { provider: 'anthropic', client, model, generate }
}

export function custom(generate: (req: LLMRequest) => Promise<LLMResponse>): LLM {
  return { provider: 'custom', generate }
}
