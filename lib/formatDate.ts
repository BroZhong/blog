const defaultDateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
}

export function formatDate(
  date: string | Date,
  locale = 'en-US',
  options: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat(locale, {
    ...defaultDateOptions,
    ...options,
    timeZone: options.timeZone ?? defaultDateOptions.timeZone,
  }).format(new Date(date))
}
