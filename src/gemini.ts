import yaml from 'yaml'
import type { FnConfig } from './types.js'
import { to_json_schema } from './utils.js'
import type { Content, GoogleGenerativeAI } from '@google/generative-ai'

export function gemini_fn<Args, R>(client: GoogleGenerativeAI, config: FnConfig<Args, R>) {
  return async (args: Args) => {
    const examples = (config.examples || []).flatMap((x) => [
      { role: 'user', parts: [{ text: yaml.stringify(x.input) }] },
      { role: 'assistant', parts: [{ text: JSON.stringify(x.output) }] },
    ])
    const messages = [...examples, { role: 'user', parts: [{ text: yaml.stringify(config.input.parse(args)) }] }] as Content[]
    const res = await client
      .getGenerativeModel({
        model: config.model,
        systemInstruction: config.system,
        tools: [
          {
            functionDeclarations: [
              {
                name: 'handle',
                description: 'The function to call with the output',
                parameters: to_json_schema(config.output),
              },
            ],
          },
        ],
      })
      .generateContent({
        contents: messages,
      })
    const part = res.response.candidates![0]!.content.parts[0]!
    if (!part.functionCall) {
      console.error(JSON.stringify(res, null, 2))
      throw new Error('No tool call found')
    }
    return config.output.parse(part.functionCall.args)
  }
}
