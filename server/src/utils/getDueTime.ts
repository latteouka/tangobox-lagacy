export const getDueTime = (days: number) => {
  const dueDate = new Date(new Date().setDate(new Date().getDate() + days))
  return dueDate
}
