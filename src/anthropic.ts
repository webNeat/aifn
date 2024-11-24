import yaml from 'yaml'
import Anthropic from '@anthropic-ai/sdk'
import type { FnConfig } from './types.js'
import { to_json_schema } from './utils.js'

export function anthropic_fn<Args, R>(client: Anthropic, config: FnConfig<Args, R>) {
  return async (args: Args) => {
    const examples = (config.examples || []).flatMap((x) => [
      { role: 'user', content: yaml.stringify(x.input) },
      { role: 'assistant', content: JSON.stringify(x.output) },
    ])
    const messages = [...examples, { role: 'user', content: yaml.stringify(config.input.parse(args)) }] as Anthropic.MessageParam[]
    const res = await client.messages.create({
      model: config.model,
      max_tokens: 4000,
      system: config.system,
      messages,
      tool_choice: { type: 'tool', name: 'handle' },
      tools: [
        {
          name: 'handle',
          description: 'The function to call with the result',
          input_schema: to_json_schema(config.output),
        },
      ],
    })
    const item = res.content.find((x) => x.type === 'tool_use')
    if (!item) {
      throw new Error('No tool call found')
    }
    return config.output.parse(item.input)
  }
}
