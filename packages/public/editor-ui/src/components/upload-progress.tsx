import { Icon, faSpinner } from '@edtr-io/ui'
import * as React from 'react'

/** @public */
export class UploadProgress extends React.Component<UploadProgressProps> {
  public render() {
    const { progress } = this.props

    if (!progress) {
      return null
    }

    if (progress > 0 && progress < 1) {
      return <Icon icon={faSpinner} spin color="#ffffff" size="lg" />
    }

    return null
  }
}

/** @public */
export interface UploadProgressProps {
  progress?: number
  complete?: boolean
}
