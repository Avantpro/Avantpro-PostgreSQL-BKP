export function log(message: any, ...optionalParams: any[]): void {
  const now = new Date()
  const options = {
    year: 'numeric', // or '2-digit'
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
    hour12: false,
  } as Intl.DateTimeFormatOptions
  const formattedDate = now
    .toLocaleString('pt-BR', options)
    .replace(/\//g, '-')
    .replace(',', '')
  console.log(`${formattedDate} - ${message}`, ...optionalParams)
}
