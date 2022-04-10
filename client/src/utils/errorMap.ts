interface Error {
  field: string
  message: string
}

export const errorMap = (error: Error) => {
  const result: Record<string, string> = {}
  result[error.field] = error.message
  return result
}
