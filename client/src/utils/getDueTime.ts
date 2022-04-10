export const getDueTime = (days: number) => {
  const dueDate = new Date(new Date().setDate(new Date().getDate() + days))
  dueDate.setHours(0, 0, 0, 0)
  return dueDate
}
