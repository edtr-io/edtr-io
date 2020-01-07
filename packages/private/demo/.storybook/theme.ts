import { create } from '@storybook/theming'

const title = process.env.TITLE ? ` (${process.env.TITLE})` : ''

export const theme = create({
  base: 'light',
  brandTitle: `Edtr.io${title}`,
  brandUrl: 'https://edtr.io'
})
