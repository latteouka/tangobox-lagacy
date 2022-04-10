export const getDueTime10min = () => {
  const dueDate = new Date(new Date().getTime() + 10 * 60 * 1000)
  return dueDate
}
