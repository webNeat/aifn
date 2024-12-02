import yaml from 'yaml'
import * as E from 'wari'
import { z, ZodError } from 'zod'
import type { FnConfig, LLMResponse } from '../src/types.js'

export function deep_fn<Args, R>(config: FnConfig<Args, R>) {
  return async (args: Args) => {
    let brainstorming = await make_plan(config, args)
    brainstorming = await verify_plan(config, args, brainstorming)
    brainstorming = await execute_plan(config, args, brainstorming)
    let steps = 1
    let done = await are_we_done(config, args, brainstorming)
    while (!done && steps < 2) {
      brainstorming = await continue_plan(config, args, brainstorming)
      steps++
    }
    let res: LLMResponse = await get_result(config, args, brainstorming)
    while (!done && steps < 2) {
      if (res.type === 'json') {
        const x = config.output.safeParse(res.data)
        if (x.success) return x.data as R
        res = await wrong_format(config, args, brainstorming, JSON.stringify(res.data), x.error)
      } else {
        res = await didnt_call_tool(config, args, brainstorming, res.type === 'text' ? res.content : '')
      }
      steps++
    }
    if (res.type === 'error') throw res.error
    if (res.type === 'text') throw E.new('UnstructuredOutput', { config, args, output: res.content })
    const output = E.catch(
      () => config.output.parse(res.data),
      (error) => E.new('InvalidOutput', { config, args, result: res.data, schema: config.output, error }),
    )
    if (E.any(output)) throw output
    return output as R
  }
}

async function make_plan(config: FnConfig<any, any>, args: any) {
  const examples = (config.examples || []).flatMap((x) => [
    `<user_input>`,
    yaml.stringify(x.input),
    `</user_input>`,
    `<expected_output>`,
    JSON.stringify(x.output),
    `</expected_output>`,
    '',
  ])
  const system = [
    `You are given the following task: ${config.description}`,
    `Here are some examples of the user input and your expected output:`,
    ...examples,
    `The user input is:`,
    yaml.stringify(args),
  ].join('\n')
  const res = await config.llm.generate({
    system,
    messages: [{ role: 'user', content: `Write a detailed plan that would be executed by a human to solve the task.` }],
  })
  if (res.type === 'error') throw res.error
  const plan = res.type === 'text' ? res.content : JSON.stringify(res.data)
  return [system, 'Your thinking process is:', `I understand the task, let's write a plan to solve it.`, plan].join('\n')
}

async function verify_plan(config: FnConfig<any, any>, args: any, brainstorming: string) {
  const res = await config.llm.generate({
    system: brainstorming,
    messages: [{ role: 'user', content: `Please double check the plan to make sure you didn't forget anything.` }],
  })
  if (res.type === 'error') throw res.error
  const verification = res.type === 'text' ? res.content : JSON.stringify(res.data)
  return [brainstorming, `That's my plan, but let me double check it one more time.`, verification].join('\n')
}

async function execute_plan(config: FnConfig<any, any>, args: any, brainstorming: string) {
  const content = [
    `Please execute the plan to solve the task.`,
    `As a reminder, the task is: ${config.description}`,
    `And the user input is:`,
    yaml.stringify(args),
  ].join('\n')
  const res = await config.llm.generate({ system: brainstorming, messages: [{ role: 'user', content }] })
  if (res.type === 'error') throw res.error
  const execution = res.type === 'text' ? res.content : JSON.stringify(res.data)
  return [brainstorming, `That's my plan, let's execute it.`, execution].join('\n')
}

async function are_we_done(config: FnConfig<any, any>, args: any, brainstorming: string) {
  const output_schema = z.object({
    done: z.boolean().describe('Whether the task is done or not'),
  })
  const res = await config.llm.generate({
    system: brainstorming,
    messages: [{ role: 'user', content: 'Did you fully solve the task? Answer with `{"done":true}` or `{"done":false}`.' }],
    output_schema,
  })
  if (res.type === 'error') throw res.error
  const result = res.type === 'text' ? JSON.parse(res.content) : res.data
  const output = E.catch(
    () => output_schema.parse(result),
    (error) => E.new('InvalidOutput', { config, args, result, schema: output_schema, error }),
  )
  if (E.any(output)) throw output
  return output.done
}

async function continue_plan(config: FnConfig<any, any>, args: any, brainstorming: string) {
  const res = await config.llm.generate({
    system: brainstorming,
    messages: [{ role: 'user', content: 'Please continue the plan to solve the task.' }],
  })
  if (res.type === 'error') throw res.error
  const continuation = res.type === 'text' ? res.content : JSON.stringify(res.data)
  return [brainstorming, continuation].join('\n')
}

async function get_result(config: FnConfig<any, any>, args: any, brainstorming: string) {
  const content = [
    `Please get the result of the task.`,
    `As a reminder, the task is: ${config.description}`,
    `And the user input is:`,
    yaml.stringify(args),
  ].join('\n')
  return config.llm.generate({
    system: brainstorming,
    messages: [{ role: 'user', content }],
    output_schema: config.output,
  })
}

async function wrong_format(config: FnConfig<any, any>, args: any, brainstorming: string, output: string, error: ZodError) {
  const content = [`The output is not in the expected format. It Gives the following error:`, error.message, '', `Please fix it.`].join('\n')
  return config.llm.generate({
    system: brainstorming,
    messages: [
      { role: 'assistant', content: output },
      { role: 'user', content },
    ],
    output_schema: config.output,
  })
}

async function didnt_call_tool(config: FnConfig<any, any>, args: any, brainstorming: string, output: string) {
  return config.llm.generate({
    system: brainstorming,
    messages: [
      { role: 'assistant', content: output },
      { role: 'user', content: `The output is not in the expected format. Please call the tool to format the output.` },
    ],
    output_schema: config.output,
  })
}
