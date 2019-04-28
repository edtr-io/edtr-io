import * as React from 'react'
import { Icon, faBold, faItalic, faLink } from '@edtr-io/editor-ui'
import { OverlayContext } from '@edtr-io/core'
import { Button } from '../toolbar/button'
import {
  isEmphasized,
  isStrong,
  toggleEmphasize,
  toggleStrong
} from '../plugins/rich-text'
import { isLink, unwrapLink, wrapLink } from '../plugins/link'
import { insertKatex, isKatex, removeKatex } from '../plugins/katex'
import { getHeadingLevel } from '../plugins/headings'
import { ControlProps, VisibleControls } from '.'

export const DefaultControls: React.FunctionComponent<
  ControlProps & { switchControls: (controlType: VisibleControls) => void }
> = props => {
  const { editor, name } = props
  const overlayContext = React.useContext(OverlayContext)
  return (
    <React.Fragment>
      <Button
        name={name}
        active={isStrong(editor)}
        onClick={() => toggleStrong(editor).focus()}
      >
        <Icon icon={faBold} />
      </Button>
      <Button
        name={name}
        active={isEmphasized(editor)}
        onClick={() => toggleEmphasize(editor).focus()}
      >
        <Icon icon={faItalic} />
      </Button>
      <Button
        name={name}
        active={isLink(editor)}
        onClick={() =>
          isLink(editor)
            ? unwrapLink(editor).focus()
            : wrapLink()(editor, overlayContext)
        }
      >
        <Icon icon={faLink} />
      </Button>
      <Button
        name={name}
        onClick={() => props.switchControls(VisibleControls.Headings)}
      >
        {getHeadingLevel(editor) ? `H${getHeadingLevel(editor)}` : 'Text'}
      </Button>
      <Button
        name={name}
        active={isKatex(editor)}
        onClick={() =>
          isKatex(editor) ? removeKatex(editor).focus() : insertKatex(editor)
        }
      >
        f(x)
      </Button>
    </React.Fragment>
  )
}
