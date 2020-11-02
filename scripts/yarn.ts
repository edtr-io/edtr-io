import { platform } from 'os'

export const yarn = platform() === 'win32' ? 'yarn.cmd' : 'yarn'
