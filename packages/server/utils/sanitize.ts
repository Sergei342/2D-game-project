import validator from 'validator'

/**
 * Экранирует < > & " ' для защиты от XSS
 *
 */
export function sanitize(input: string): string {
  return validator.escape(input.trim())
}
