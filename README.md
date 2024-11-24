# aifn

Create type-safe functions using AI Language Models with ease.

[![npm version](https://badge.fury.io/js/aifn.svg)](https://badge.fury.io/js/aifn)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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

## Usage

```ts
import z from 'zod'
import { fn } from 'aifn'

// 1. Create a client
// For OpenAI
import { OpenAI } from 'openai'
const client = new OpenAI()

// For Anthropic
import { Anthropic } from '@anthropic-ai/sdk'
const client = new Anthropic()

// For Gemini
import { GoogleGenerativeAI } from '@google/generative-ai'
const client = new GoogleGenerativeAI('YOUR_API_KEY')

// For Ollama
import { Ollama } from 'ollama'
const client = new Ollama()

// 2. Create a function
const toFrench = fn({
  client,
  model: 'gpt-4o-mini',
  system: `Translate the user message from English to French`,
  input: z.string(),
  output: z.object({
    translation: z.string().describe('The translated text'),
  }),
})

// 3. Use the function
const result = await toFrench('Hello, how are you?')
console.log(result.translation) // "Bonjour, comment allez-vous ?"
```
