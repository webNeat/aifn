import z from 'zod'
import { testFn } from '../utils.js'

export const solveWordProblem = testFn({
  name: 'solveWordProblem',
  description: 'Solve math word problems with step-by-step explanation',
  input: z.string(),
  output: z.object({
    answer: z.number(),
    unit: z.string().optional(),
    steps: z.array(
      z.object({
        explanation: z.string(),
        calculation: z.string(),
      }),
    ),
  }),
  tests: [
    {
      input: 'A train travels 120 kilometers in 2 hours. What is its average speed?',
      output: {
        answer: 60,
        unit: 'km/h',
        steps: [
          {
            explanation: 'Identify the formula for average speed',
            calculation: 'speed = distance / time',
          },
          {
            explanation: 'Insert the values into the formula',
            calculation: 'speed = 120 kilometers / 2 hours',
          },
          {
            explanation: 'Perform the division',
            calculation: '120 / 2 = 60 km/h',
          },
        ],
      },
    },
    {
      description: 'Handle percentage calculations',
      input: 'A shirt costs $80. It is on sale with a 25% discount. What is the final price?',
      output: {
        answer: 60,
        unit: 'USD',
        steps: [
          {
            explanation: 'Calculate the discount amount',
            calculation: '$80 × 25% = $80 × 0.25 = $20',
          },
          {
            explanation: 'Subtract discount from original price',
            calculation: '$80 - $20 = $60',
          },
        ],
      },
    },
  ],
})

export const simplifyExpression = testFn({
  name: 'simplifyExpression',
  description: 'Simplify mathematical expressions and show steps',
  input: z.string(),
  output: z.object({
    simplified: z.string(),
    steps: z.array(
      z.object({
        expression: z.string(),
        explanation: z.string(),
      }),
    ),
  }),
  tests: [
    {
      input: '3(x + 2) - 2(x - 1)',
      output: {
        simplified: 'x + 8',
        steps: [
          {
            expression: '3x + 6 - 2x + 2',
            explanation: 'Distribute the terms',
          },
          {
            expression: '3x - 2x + 6 + 2',
            explanation: 'Rearrange like terms',
          },
          {
            expression: 'x + 8',
            explanation: 'Combine like terms',
          },
        ],
      },
    },
  ],
})
