# aifn

Create functions using AI LLMs.

```ts
import z from 'zod'
import { OpenAI } from 'openai'
import {fn} from 'aifn'

const client = new OpenAI()

const toFrench = fn({
  client,
  model: 'gpt-4o-mini',
  system: `Translate the user message from English to French`,
  input: z.string(),
  output: z.object({
    translation: z.string().describe('The translated text'),
  }),
})

const res = await toFrench('Hello world!')
console.log(res.translation) // "Bonjour le monde!"
```

# Features

- Supports multiple providers: `openai`, `anthropic`, `gemini`, and `ollama`
- Type safe arguments and results
