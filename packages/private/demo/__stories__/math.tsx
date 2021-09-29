import { MathEditor, MathEditorProps, MathRenderer } from '@edtr-io/math'
import {
  defaultEditorTheme,
  defaultRendererTheme,
  RootThemeProvider,
} from '@edtr-io/ui'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

function MathEditorStory(props: Partial<MathEditorProps>) {
  return (
    <RootThemeProvider
      theme={{ editor: defaultEditorTheme, renderer: defaultRendererTheme }}
    >
      <MathEditorExample {...props} />
    </RootThemeProvider>
  )
}

function MathEditorExample(props: Partial<MathEditorProps>) {
  const [state, onChange] = React.useState(props.state || '')
  const [visual, setVisual] = React.useState(props.visual === true)
  const [inline, setInline] = React.useState(props.inline === true)

  return (
    <MathEditor
      {...props}
      visual={visual}
      inline={inline}
      state={state}
      onEditorChange={setVisual}
      onInlineChange={setInline}
      onChange={onChange}
      config={{}}
    />
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
  .add('MathEditor (block, focus on click)', () => {
    const [focused, setFocused] = React.useState(false)
    return (
      <div onClick={() => setFocused(true)}>
        <MathEditorStory autofocus state="\sqrt{2}" readOnly={!focused} />
      </div>
    )
  })
  .add('MathEditor (block, visual, focus on click)', () => {
    const [focused, setFocused] = React.useState(false)
    return (
      <div onClick={() => setFocused(true)}>
        <MathEditorStory
          autofocus
          state="\sqrt{2}"
          readOnly={!focused}
          visual
        />
      </div>
    )
  })
  .add('MathEditor (Overlay does not hide previous text)', () => {
    return (
      <RootThemeProvider
        theme={{ editor: defaultEditorTheme, renderer: defaultRendererTheme }}
      >
        <p>
          Consequatur quos vitae vel in. Suscipit a eius deserunt nisi neque.
          Minima dolores quia quo veritatis. Aut natus nihil necessitatibus
          delectus ea eligendi dolor sit. Neque deleniti vel sint laborum et
          quia.
        </p>

        <p>
          Voluptatem similique perspiciatis earum eius fugit officiis ut et.
          Numquam laudantium ut ipsum. Fugiat voluptatum dolores sit maiores.
        </p>

        <MathEditorExample state="\sqrt{2}" visual />
      </RootThemeProvider>
    )
  })
