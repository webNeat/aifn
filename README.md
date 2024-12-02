# aifn

Create type-safe functions using AI Language Models with ease.

[![npm version](https://badge.fury.io/js/aifn.svg)](https://badge.fury.io/js/aifn)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Usage](#quick-usage)
  - [OpenAI](#usage-with-openai)
  - [Anthropic](#usage-with-anthropic)
  - [Gemini](#usage-with-gemini)
  - [Ollama](#usage-with-ollama)
- [Guides](#guides)
  - [Adding Examples for Better Results](#adding-examples-for-better-results)
  - [Using Custom LLM Provider](#using-custom-llm-provider)
  - [Get the Function Configuration](#get-the-function-configuration)
  - [Mock the Function During Tests](#mock-the-function-during-tests)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Features

- 🤖 Support for multiple AI providers:
  - OpenAI
  - Anthropic
  - Google Gemini
  - Ollama (Local models)
- 🛠️ Ability to implement custom providers
- 📝 Type-safe function creation using [Zod](https://github.com/colinhacks/zod)
- 🔒 Runtime validation of LLM output
- 🧪 Built-in mocking support for testing
- 🔄 Easy provider switching
- 🎯 Example-based prompt enhancement

## Installation

```bash
# Using npm
npm install aifn

# Using yarn
yarn add aifn

# Using pnpm
pnpm add aifn
```

You'll also need to install the provider SDKs you want to use:

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

### Functions

#### fn

```ts
function fn<Args, R>(config: FnConfig<Args, R>): Fn<Args, R>
```

Creates a type-safe function that uses an LLM to transform inputs into outputs.

**Parameters:**
- `config`: Configuration object with the following properties:
  - `llm`: LLM provider instance (see LLM Providers below)
  - `description`: String describing what the function does (used as system prompt)
  - `input`: Zod schema for the input type
  - `output`: Zod schema for the output type
  - `examples?`: Optional array of input/output examples to guide the LLM

**Returns:**
A function with the following properties:
- `(args: Args) => Promise<R>`: The main function that processes inputs
- `config`: The configuration object used to create the function
- `mock(implementation: (args: Args) => Promise<R>)`: Method to set a mock implementation
- `unmock()`: Method to remove the mock implementation

**Example:**
```ts
import { z } from 'zod'
import { fn, llm } from 'aifn'
import { OpenAI } from 'openai'

const summarize = fn({
  llm: llm.openai(new OpenAI({ apiKey: 'YOUR_API_KEY' }), 'gpt-3.5-turbo'),
  description: 'Summarize the given text in a concise way',
  input: z.object({
    text: z.string().describe('The text to summarize'),
    maxWords: z.number().describe('Maximum number of words in the summary')
  }),
  output: z.object({
    summary: z.string().describe('The summarized text'),
    wordCount: z.number().describe('Number of words in the summary')
  }),
  examples: [{
    input: { text: 'TypeScript is a programming language...', maxWords: 10 },
    output: { summary: 'TypeScript: JavaScript with static typing.', wordCount: 5 }
  }]
})
```

### LLM Providers

#### llm.openai
```ts
function openai(client: OpenAI, model: string): LLM
```

Creates an OpenAI LLM provider.

**Parameters:**
- `client`: OpenAI client instance
- `model`: Model name (e.g., 'gpt-4', 'gpt-4o-mini')

**Example:**
```ts
import { OpenAI } from 'openai'
import { llm } from 'aifn'

const provider = llm.openai(
  new OpenAI({ apiKey: 'YOUR_API_KEY' }),
  'gpt-4o-mini'
)
```

#### llm.anthropic
```ts
function anthropic(client: Anthropic, model: string): LLM
```

Creates an Anthropic LLM provider.

**Parameters:**
- `client`: Anthropic client instance
- `model`: Model name (e.g., 'claude-3-5-haiku-20241022')

**Example:**
```ts
import Anthropic from '@anthropic-ai/sdk'
import { llm } from 'aifn'

const provider = llm.anthropic(
  new Anthropic({ apiKey: 'YOUR_API_KEY' }),
  'claude-3-5-haiku-20241022'
)
```

#### llm.gemini
```ts
function gemini(client: GoogleGenerativeAI, model: string): LLM
```

Creates a Google Gemini LLM provider.

**Parameters:**
- `client`: Google GenerativeAI client instance
- `model`: Model name (e.g., 'gemini-1.5-flash')

**Example:**
```ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import { llm } from 'aifn'

const provider = llm.gemini(
  new GoogleGenerativeAI('YOUR_API_KEY'),
  'gemini-1.5-flash'
)
```

#### llm.ollama
```ts
function ollama(client: Ollama, model: string): LLM
```

Creates an Ollama LLM provider for local models.

**Parameters:**
- `client`: Ollama client instance
- `model`: Model name (e.g., 'llama3.1', 'mistral')

**Example:**
```ts
import { Ollama } from 'ollama'
import { llm } from 'aifn'

const provider = llm.ollama(new Ollama(), 'llama3.1')
```

#### llm.custom
```ts
function custom(generate: (req: LLMRequest) => Promise<LLMResponse>): LLM
```

Creates a custom LLM provider with your own implementation.

**Parameters:**
- `generate`: Function that implements the LLM request/response cycle

**Example:**
```ts
import { llm, LLMRequest, LLMResponse } from 'aifn'

const provider = llm.custom(async (req: LLMRequest): Promise<LLMResponse> => {
  // Your custom implementation here
  return {
    type: 'json',
    data: { /* your response data */ },
    response: { /* raw response data */ }
  }
})
```

### Types

#### LLMRequest
```ts
type LLMRequest = {
  system: string              // System prompt
  messages: Message[]         // Conversation history
  output_schema?: ZodSchema   // Expected output schema
}
```

#### LLMResponse
```ts
type LLMResponse =
  | { type: 'text'; content: string; response: any }
  | { type: 'json'; data: unknown; response: any }
  | { type: 'error'; error: unknown }
```

#### Message
```ts
type Message = {
  role: 'user' | 'assistant'
  content: string
}
```
