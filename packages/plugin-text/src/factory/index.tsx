import { parseFragment } from 'parse5'
import { Value, ValueJSON } from 'slate'
import Html from 'slate-html-serializer'

import { createTextEditor } from './editor'
import {
  TextPluginState,
  TextPluginOptions,
  TextPluginSerializedState
} from './types'
import { SerializablePlugin } from '../../../core/src/plugin'
import { StateType } from '@edtr-io/core'

export const defaultNode = 'paragraph'

export const textState = StateType.scalar<ValueJSON>({
  document: {
    nodes: [
      {
        object: 'block',
        type: defaultNode,
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                object: 'leaf',
                text: ''
              }
            ]
          }
        ]
      }
    ]
  }
})

export const createTextPlugin = (
  options: TextPluginOptions
): SerializablePlugin<TextPluginState, TextPluginSerializedState> => {
  // const createInitialState = (): TextPluginState => {
  //   return {
  //     editorState: Value.fromJSON({
  //       document: {
  //         nodes: [
  //           {
  //             object: 'block',
  //             type: defaultNode,
  //             nodes: [
  //               {
  //                 object: 'text',
  //                 leaves: [
  //                   {
  //                     object: 'leaf',
  //                     text: ''
  //                   }
  //                 ]
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     })
  //   }
  // }

  const lineBreakSerializer = {
    // @ts-ignore
    deserialize(el) {
      if (el.tagName.toLowerCase() === 'br') {
        return { object: 'text', text: '\n' }
      }

      if (el.nodeName === '#text') {
        if (el.value && el.value.match(/<!--.*?-->/)) return
        if (el.value === '\n') return

        return {
          object: 'text',
          leaves: [
            {
              object: 'leaf',
              text: el.value
            }
          ]
        }
      }

      return undefined
    }
  }

  const html = new Html({
    rules: [lineBreakSerializer, ...options.plugins],
    defaultBlock: {
      type: defaultNode
    },
    parseHtml: (html: string) => parseFragment(html) as HTMLElement
  })

  return {
    Component: createTextEditor(options),
    state: textState

    // handleBlur: (props: {
    //   onChange: (state: TextPluginState) => void
    //   state: TextPluginState
    // }) => {
    //   const { editorState } = props.state
    //
    //   props.onChange({
    //     editorState: editorState
    //       .change()
    //       .deselect()
    //       .blur().value
    //   })
    // },

    // createInitialState,

    // deserialize({
    //   importFromHtml,
    //   editorState
    // }: TextPluginSerializedState): TextPluginState {
    //   if (editorState) {
    //     return { editorState: Value.fromJSON(editorState) }
    //   } else if (importFromHtml) {
    //     try {
    //       const editorState = html.deserialize(importFromHtml)
    //
    //       return { editorState }
    //     } catch (e) {
    //       // console.log('Failed on', importFromHtml, e)
    //       return createInitialState()
    //     }
    //   }
    //
    //   return createInitialState()
    // },

    // serialize({ editorState }: TextPluginState): TextPluginSerializedState {
    //   return {
    //     editorState: editorState.toJSON()
    //   }
    // }
  }
}
