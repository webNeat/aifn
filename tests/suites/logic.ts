import z from 'zod'
import { testFn } from '../utils.js'

export const evaluateSyllogism = testFn({
  name: 'evaluateSyllogism',
  description: 'Evaluate logical syllogisms and explain the reasoning',
  input: z.object({
    premises: z.array(z.string()),
    conclusion: z.string(),
  }),
  output: z.object({
    isValid: z.boolean(),
    explanation: z.string(),
    formalStructure: z.object({
      majorPremise: z.string(),
      minorPremise: z.string(),
      conclusion: z.string(),
      form: z.string(),
    }),
  }),
  tests: [
    {
      input: {
        premises: ['All mammals are warm-blooded', 'All dogs are mammals'],
        conclusion: 'All dogs are warm-blooded',
      },
      output: {
        isValid: true,
        explanation: 'This is a valid syllogism in the form of "All A are B, All C are A, therefore All C are B"',
        formalStructure: {
          majorPremise: 'All mammals (M) are warm-blooded (P)',
          minorPremise: 'All dogs (S) are mammals (M)',
          conclusion: 'All dogs (S) are warm-blooded (P)',
          form: 'AAA-1',
        },
      },
    },
    {
      description: 'Invalid syllogism',
      input: {
        premises: ['All birds can fly', 'Penguins are birds'],
        conclusion: 'Therefore, penguins can fly',
      },
      output: {
        isValid: false,
        explanation: 'While the syllogism structure is valid, the major premise "All birds can fly" is false, making the conclusion unsound',
        formalStructure: {
          majorPremise: 'All birds (M) can fly (P)',
          minorPremise: 'Penguins (S) are birds (M)',
          conclusion: 'Penguins (S) can fly (P)',
          form: 'AAA-1',
        },
      },
    },
  ],
})

export const completeSequence = testFn({
  name: 'completeSequence',
  description: 'Complete logical sequences and explain the pattern',
  input: z.object({
    sequence: z.array(z.string()),
    options: z.array(z.string()).optional(),
  }),
  output: z.object({
    next: z.string(),
    pattern: z.string(),
    explanation: z.string(),
  }),
  tests: [
    {
      input: {
        sequence: ['RED BLUE', 'BLUE GREEN', 'GREEN YELLOW'],
        options: ['YELLOW PURPLE', 'YELLOW RED', 'YELLOW BLUE'],
      },
      output: {
        next: 'YELLOW RED',
        pattern: 'Each pair contains consecutive colors, second color becomes first color in next pair',
        explanation:
          'The second color of each pair becomes the first color of the next pair, forming a chain. Following this pattern, YELLOW should be followed by RED to complete the cycle.',
      },
    },
    {
      description: 'Numeric pattern',
      input: {
        sequence: ['2 4', '4 8', '8 16'],
      },
      output: {
        next: '16 32',
        pattern: 'Each number is doubled to get the next number',
        explanation: 'Each pair contains a number and its double. The second number becomes the first number of the next pair.',
      },
    },
  ],
})
