import yaml from 'yaml'
import * as E from 'wari'
import type { Fn, FnConfig, LLMRequest, Message } from './types.js'

export function fn<Args, R>(config: FnConfig<Args, R>): Fn<Args, R> {
  let mockImplementation: ((args: Args) => Promise<R>) | undefined = undefined
  const f = (async (args: Args) => {
    if (mockImplementation) return mockImplementation(args)
    const res = await config.llm.generate(make_request(config, args))
    if (res.type === 'error') throw res.error
    if (res.type === 'text') throw E.new('UnstructuredOutput', { config, args, output: res.content })
    const output = E.catch(
      () => config.output.parse(res.data),
      (error) => E.new('InvalidOutput', { config, args, result: res.data, schema: config.output, error }),
    )
    if (E.any(output)) throw output
    return output as R
  }) as Fn<Args, R>
  f.config = config
  f.mock = (implementation: (args: Args) => Promise<R>) => {
    mockImplementation = implementation
  }
  f.unmock = () => {
    mockImplementation = undefined
  }
  return f
}

function make_request<Args, R>(config: FnConfig<Args, R>, args: Args): LLMRequest {
  const messages: Message[] = []
  for (const x of config.examples || []) {
    messages.push({ role: 'user', content: yaml.stringify(x.input) })
    messages.push({ role: 'assistant', content: JSON.stringify(x.output) })
  }
  return {
    system: config.description,
    messages: [...messages, { role: 'user', content: yaml.stringify(args) }],
    output_schema: config.output,
  }
}
