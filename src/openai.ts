import yaml from 'yaml'
import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import type { FnConfig } from './types.js'

export function openai_fn<Args, R>(client: OpenAI, config: FnConfig<Args, R>) {
  return async (args: Args) => {
    const examples = (config.examples || []).flatMap((x) => [
      { role: 'user', content: yaml.stringify(x.input) },
      { role: 'assistant', content: JSON.stringify(x.output) },
    ])
    const messages = [
      { role: 'system', content: config.system },
      ...examples,
      { role: 'user', content: yaml.stringify(config.input.parse(args)) },
    ] as OpenAI.Chat.Completions.ChatCompletionMessageParam[]
    const res = await client.chat.completions.create({
      model: config.model,
      messages,
      response_format: zodResponseFormat(config.output, 'output'),
    })
    const output = res.choices[0]!.message.content!
    return config.output.parse(JSON.parse(output))
  }
}
