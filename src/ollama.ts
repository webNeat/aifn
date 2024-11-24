import yaml from 'yaml'
import { Ollama } from 'ollama'
import type { FnConfig } from './types.js'
import { to_json_schema } from './utils.js'

export function ollama_fn<Args, R>(client: Ollama, config: FnConfig<Args, R>) {
  return async (args: Args) => {
    const examples = (config.examples || []).flatMap((x) => [
      { role: 'user', content: yaml.stringify(x.input) },
      { role: 'assistant', content: JSON.stringify(x.output) },
    ])
    const messages = [{ role: 'system', content: config.system }, ...examples, { role: 'user', content: yaml.stringify(config.input.parse(args)) }]
    const res = await client.chat({
      model: config.model,
      messages,
      tools: [
        {
          type: 'function',
          function: {
            name: 'output',
            description: 'The function to call with the result',
            parameters: to_json_schema(config.output),
          },
        },
      ],
    })
    const calls = res.message.tool_calls
    if (!calls || calls.length === 0) {
      throw new Error('No tool call found')
    }
    return config.output.parse(calls[0]!.function.arguments)
  }
}
