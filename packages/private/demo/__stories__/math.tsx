import { MathEditor, MathEditorProps, MathRenderer } from '@edtr-io/math'
import {
  defaultEditorTheme,
  defaultRendererTheme,
  RootThemeProvider,
} from '@edtr-io/ui'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

function MathEditorStory(props: Partial<MathEditorProps>) {
  const [state, onChange] = React.useState(props.state || '')
  const [visual, setVisual] = React.useState(props.visual === true)
  const [inline, setInline] = React.useState(props.inline === true)

  return (
    <RootThemeProvider
      theme={{
        editor: defaultEditorTheme,
        renderer: defaultRendererTheme,
      }}
    >
      <MathEditor
        {...props}
        visual={visual}
        inline={inline}
        state={state}
        onEditorChange={(visual) => {
          setVisual(visual)
        }}
        onInlineChange={(inline) => {
          setInline(inline)
        }}
        onChange={onChange}
        config={{}}
      />
    </RootThemeProvider>
  )
}

storiesOf('Math', module)
  .add('MathEditor (block)', () => {
    return <MathEditorStory state="\sqrt{2}" />
  })
  .add('MathEditor (block, visual)', () => {
    return <MathEditorStory state="\sqrt{2}" visual />
  })
  .add('MathEditor (block, readOnly)', () => {
    return <MathEditorStory state="\sqrt{2}" readOnly />
  })
  .add('MathEditor (inline, latex)', () => {
    return <MathEditorStory state="\sqrt{2}" inline />
  })
  .add('MathEditor (inline, visual)', () => {
    return <MathEditorStory state="\sqrt{2}" visual inline />
  })
  .add('MathEditor (inline, readOnly)', () => {
    return <MathEditorStory state="\sqrt{2}" inline readOnly />
  })
  .add('MathEditor (inline, error)', () => {
    return <MathEditorStory state="\foobar{2}" inline visual />
  })
  .add('MathRenderer (block)', () => {
    return <MathRenderer state="\sqrt{2}" />
  })
  .add('MathRenderer (inline)', () => {
    return <MathRenderer state="\sqrt{2}" inline />
  })
