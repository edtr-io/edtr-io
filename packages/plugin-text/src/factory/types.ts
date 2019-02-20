import * as React from 'react'
import { Plugin } from 'slate-react'
import { Rule } from 'slate-html-serializer'

export interface TextPluginOptions {
  plugins: (Plugin & Rule)[]
  placeholder?: React.ReactNode
}
