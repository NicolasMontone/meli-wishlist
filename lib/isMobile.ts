import { UAParser } from 'ua-parser-js'

export function isMobile(): boolean {
  const device = new UAParser().getDevice()
  return device.type === 'mobile'
}
