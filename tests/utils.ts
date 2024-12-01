import * as E from 'wari'
import yaml from 'yaml'
import ollama from 'ollama'
import { deep_fn, fn } from '../src/fn.js'
import type { FnConfig, LLM } from '../src/types.js'
import _ from 'lodash'

type TestFn<A, R> = Omit<FnConfig<A, R>, 'llm'> & {
  name: string
  tests: Array<{
    description?: string
    input: A
    output: R
  }>
}

type TestSuite = Record<string, TestFn<any, any>>

export function testFn<A, R>(config: TestFn<A, R>) {
  return config
}

export async function checkFn<A, R>(llm: LLM, spec: TestFn<A, R>) {
  const f = deep_fn({
    llm,
    description: spec.description,
    input: spec.input,
    output: spec.output,
    examples: spec.examples,
  })
  let failures = 0
  let total = 0
  const answers = await Promise.all(
    spec.tests.map((x) =>
      E.catch(
        () => f(x.input),
        () => ({ error: true }),
      ),
    ),
  )
  const [is_correct, score] = await is_equal_batch(answers.map((answer, i) => [answer, spec.tests[i]!.output]))
  for (let i = 0; i < spec.tests.length; i++) {
    const x = spec.tests[i]!
    if (is_correct[i]) process.stdout.write(`      ${x.description || JSON.stringify(x.input)} ... ✅\n`)
    else {
      process.stdout.write(`      ${x.description || JSON.stringify(x.input)} ... ❌\n`)
      failures++
    }
    total++
  }
  return { failures, total, score }
}

export async function checkSuite(suiteName: string, llm: LLM, suite: Record<string, TestFn<any, any>>) {
  console.log(`  ${suiteName}`)
  let failures = 0
  let total = 0
  let score = 0
  for (const [name, spec] of Object.entries(suite)) {
    console.log(`    ${name}`)
    const x = await checkFn(llm, spec)
    failures += x.failures
    total += x.total
    score += x.score
  }
  score = Math.floor(score / Object.keys(suite).length)
  return { failures, total, score }
}

export async function run(llms: Record<string, LLM>, suites: Record<string, TestSuite>) {
  const scores = {} as Record<string, number>
  for (const [llmName, llm] of Object.entries(llms)) {
    console.log(llmName)
    let failures = 0
    let total = 0
    let score = 0
    for (const [suiteName, suite] of Object.entries(suites)) {
      const res = await checkSuite(suiteName, llm, suite)
      failures += res.failures
      total += res.total
      score += res.score
    }
    scores[llmName] = Math.floor(score / Object.keys(suites).length)
    console.log(`${llmName} - ${scores[llmName]}%`)
  }
  return scores
}

async function is_equal_batch(pairs: Array<[any, any]>) {
  const results = Array(pairs.length).fill(false)
  const requires_embeddings: number[] = []
  let score = 0
  for (let i = 0; i < pairs.length; i++) {
    const [a, b] = pairs[i]!
    if (JSON.stringify(a) === JSON.stringify(b)) {
      results[i] = true
      score += 100
    } else requires_embeddings.push(i)
  }
  if (requires_embeddings.length > 0) {
    const res = await ollama.embed({
      model: 'mxbai-embed-large',
      input: requires_embeddings.map((i) => pairs[i]!).flatMap(([a, b]) => [yaml.stringify(a), yaml.stringify(b)]),
    })
    const similarities = _.chunk(res.embeddings, 2).map(([a, b]) => {
      const s = similarity(a, b)
      score += s
      return s > 0.97
    })
    for (let i = 0; i < similarities.length; i++) {
      results[requires_embeddings[i]!] = similarities[i]!
    }
  }
  return [results, score / pairs.length] as [boolean[], number]
}

function similarity(a: number[] | undefined, b: number[] | undefined) {
  if (!a || !b) return 0
  let product = 0,
    normA = 0,
    normB = 0
  for (let i = 0; i < a.length; i++) {
    product += a[i]! * b[i]!
    normA += a[i]! * a[i]!
    normB += b[i]! * b[i]!
  }
  return product / Math.sqrt(normA * normB)
}
