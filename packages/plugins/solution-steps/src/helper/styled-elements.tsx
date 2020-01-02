import { styled } from '@edtr-io/editor-ui'
import * as React from 'react'
import {
  Icon,
  faBookOpen,
  faChessRook,
  faCommentDots,
  faPencilRuler,
  faSearchPlus
} from '@edtr-io/ui'

export const Buttoncontainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  width: '100%'
})

export const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  position: 'relative'
})

export const ContentComponent = styled.div<{ isHalf?: boolean }>(
  ({ isHalf }: { isHalf?: boolean }) => {
    return {
      //marginTop: '10px',
      boxShadow: '0 1px 3px 0 rgba(0,0,0,0.2)',
      padding: '20px 20px 10px 10px',
      width: isHalf ? '50%' : '100%',
      position: 'relative'
    }
  }
)

const BackgroundSymbol = styled.div({
  position: 'absolute',
  top: '0',
  right: '0',
  color: 'rgba(0,0,0,0.1)',
  transform: 'translate(-15px, 10px)',
  zIndex: 0
})
export enum SolutionPluginTypes {
  introduction,
  strategy,
  explanation,
  step,
  additionals
}

function getIcon(type: SolutionPluginTypes) {
  switch (type) {
    case SolutionPluginTypes.introduction:
      return <Icon icon={faBookOpen} size={'3x'} />
    case SolutionPluginTypes.strategy:
      return <Icon icon={faChessRook} size={'3x'} />
    case SolutionPluginTypes.explanation:
      return <Icon icon={faCommentDots} size={'3x'} />
    case SolutionPluginTypes.step:
      return <Icon icon={faPencilRuler} size={'3x'} />
    case SolutionPluginTypes.additionals:
      return <Icon icon={faSearchPlus} size={'3x'} />
  }
}
export function Content(
  props: React.PropsWithChildren<{
    type: SolutionPluginTypes
    isHalf?: boolean
  }>
) {
  return (
    <React.Fragment>
      <ContentComponent isHalf={props.isHalf}>
        {props.children}
        <BackgroundSymbol>{getIcon(props.type)}</BackgroundSymbol>
      </ContentComponent>
    </React.Fragment>
  )
}

export const Controls = styled.div({
  right: '0',
  position: 'absolute',
  top: '0',
  transform: 'translate(50%, -5px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
})

export const ControlButton = styled.button({
  borderRadius: '50%',
  border: '1px solid rgba(5,51,51,0.95)',
  width: '27px',
  height: '27px',
  outline: 'none',
  textAlign: 'center',
  background: 'rgba(51,51,51,0.95)',
  color: 'white',
  zIndex: 20,
  '&:hover': {
    background: '#469bff',
    border: '1px solid #469bff'
  }
})

export const DragHandler = styled.div({
  borderRadius: '50%',
  width: '27px',
  height: '27px',
  outline: 'none',
  textAlign: 'center',
  background: 'rgba(51,51,51,0.95)',
  color: 'white',
  zIndex: 20,
  '&:hover': {
    background: '#469bff'
  }
})
