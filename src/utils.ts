import { ZodSchema } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

export function to_json_schema(schema: ZodSchema<any>): any {
  return clean(zodToJsonSchema(schema))
}

function clean<T>(data: T): T {
  if (Array.isArray(data)) return data.map((item) => clean(item)) as T
  if (typeof data === 'object' && data !== null) {
    // @ts-ignore-error
    delete data['$schema']
    // @ts-ignore-error
    delete data['additionalProperties']
    for (const key in data) {
      data[key] = clean(data[key])
    }
  }
  return data
}
