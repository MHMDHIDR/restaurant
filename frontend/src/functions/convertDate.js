export const createLocaleDateString = date =>
  new Date(date).toLocaleDateString('ar-QA', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
