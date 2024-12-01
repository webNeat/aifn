# aifn

Create type-safe functions using AI Language Models with ease.

[![npm version](https://badge.fury.io/js/aifn.svg)](https://badge.fury.io/js/aifn)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Contents

## Features

- 🤖 Support for multiple AI providers:
  - OpenAI
  - Anthropic
  - Gemini
  - Ollama (Local models)
- 📝 Type-safe function creation using [Zod](https://github.com/colinhacks/zod)
- 🔒 Runtime validation of LLM output

## Installation

```bash
# Using npm
npm install aifn

# Using yarn
yarn add aifn

# Using pnpm
pnpm add aifn
```

You'll also need to install the provider SDK you want to use:

```bash
# For OpenAI
pnpm add openai

# For Anthropic
pnpm add @anthropic-ai/sdk

# For Google's Gemini
pnpm add @google/generative-ai

# For Ollama
pnpm add ollama
```

## Quick Usage

### Usage with OpenAI

```ts
import { z } from 'zod'
import { llm, fn } from 'aifn'
import { OpenAI } from 'openai'

const toFrench = fn({
  llm: llm.openai(new OpenAI({ apiKey: 'YOUR_OPENAI_API_KEY' }), 'gpt-4o-mini'),
  description: `Translate the user message from English to French`,
  input: z.string().describe('The text to translate'),
  output: z.object({
    translation: z.string().describe('The translated text'),
  }),
})

const res = await toFrench('Hello, how are you?')
console.log(res.translation) // 'Bonjour, comment ça va?'
```

### Usage with Anthropic

```ts
import { z } from 'zod'
import { llm, fn } from 'aifn'
import { Anthropic } from '@anthropic-ai/sdk'

const toFrench = fn({
  llm: llm.anthropic(new Anthropic({ apiKey: 'YOUR_ANTHROPIC_API_KEY' }), 'claude-3-5-haiku-20241022'),
  description: `Translate the user message from English to French`,
  input: z.string().describe('The text to translate'),
  output: z.object({
    translation: z.string().describe('The translated text'),
  }),
})

const res = await toFrench('Hello, how are you?')
console.log(res.translation) // 'Bonjour, comment ça va?'
```

### Usage with Gemini

```ts
import { z } from 'zod'
import { llm, fn } from 'aifn'
import { GoogleGenerativeAI } from '@google/generative-ai'

const toFrench = fn({
  llm: llm.gemini(new GoogleGenerativeAI('YOUR_GEMINI_API_KEY'), 'gemini-1.5-flash'),
  description: `Translate the user message from English to French`,
  input: z.string().describe('The text to translate'),
  output: z.object({
    translation: z.string().describe('The translated text'),
  }),
})

const res = await toFrench('Hello, how are you?')
console.log(res.translation) // 'Bonjour, comment ça va?'
```

### Usage with Ollama

```ts
const toFrench = fn({
  llm: llm.ollama(new Ollama(), 'mistral:7b'),
  description: `Translate the user message from English to French`,
  input: z.string().describe('The text to translate'),
  output: z.object({
    translation: z.string().describe('The translated text'),
  }),
})

const res = await toFrench('Hello, how are you?')
console.log(res.translation) // 'Bonjour, comment ça va?'
```

## Guides

### Adding examples for better results

You can specify examples for your function to improve the quality of the output.

```ts
import { z } from 'zod'
import { llm, fn } from 'aifn'

const toFrench = fn({
  llm: llm.openai(new OpenAI({ apiKey: 'YOUR_OPENAI_API_KEY' }), 'gpt-4o-mini'),
  description: `Translate the user message from English to French`,
  input: z.string().describe('The text to translate'),
  output: z.object({
    translation: z.string().describe('The translated text'),
  }),
  examples: [
    { input: 'Hello', output: { translation: 'Bonjour' } },
    { input: 'How are you?', output: { translation: 'Comment ça va?' } },
  ],
})
```

### Using custom LLM provider

You can use custom LLM providers by specifying the `llm.custom` method

```ts
import { z } from 'zod'
import { llm, fn, LLMRequest, LLMResponse } from 'aifn'

const toFrench = fn({
  llm: llm.custom(async (req: LLMRequest): Promise<LLMResponse> => {
    // implement your custom LLM calling logic here
  }),
  description: `Translate the user message from English to French`,
  input: z.string().describe('The text to translate'),
  output: z.object({
    translation: z.string().describe('The translated text'),
  })
})
```

The request and response types look as follows:

```ts
type LLMRequest = {
  system: string
  messages: Message[]
  output_schema?: ZodSchema<any>
}

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type LLMResponse =
  | { type: 'text'; content: string; response: any }
  | { type: 'json'; data: unknown; response: any }
  | { type: 'error'; error: unknown }
```

### Get the function configuration

The function created with `fn` has a `config` property that contains the configuration used to create the function.

```ts
import { z } from 'zod'
import { OpenAI } from 'openai'
import { llm, fn } from 'aifn'

const toFrench = fn({
  llm: llm.openai(new OpenAI({ apiKey: 'YOUR_OPENAI_API_KEY' }), 'gpt-4o-mini'),
  description: `Translate the user message from English to French`,
  input: z.string().describe('The text to translate'),
  output: z.object({
    translation: z.string().describe('The translated text'),
  }),
})

console.log(toFrench.config)
// {
//   llm: {
//     provider: 'openai',
//     client: OpenAI {...},
//     model: 'gpt-4o-mini',
//     ...
//   },
//   description: 'Translate the user message from English to French',
//   input: ZodString {...},
//   output: ZodObject {...},
// }
```

You can use this configuration to duplicate the function with a different LLM for example:

```ts
const otherToFrench = fn({
  ... toFrench.config,
  llm: llm.ollama(new Ollama(), 'llama3.1'),
})
```

### Mock the function during tests

The function created with `fn` has `mock` and `unmock` methods that can be used to mock the function during tests.

```ts
import { toFrench } from './my/file.js'

describe('my awesome feature', () => {
  before(() => {
    toFrench.mock(async text => ({ translation: `Translated(${text})` }))
  })

  after(() => {
    toFrench.unmock()
  })

  it('translates text', async () => {
    const res = await toFrench('Hello, how are you?')
    expect(res.translation).to.equal('Translated(Hello, how are you?)')
  })
})
```

## API Reference

_detailled API reference coming soon ..._

