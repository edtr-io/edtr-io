import * as React from 'react'

import { Icon, faSpinner } from './icon'

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

export interface UploadProgressProps {
  progress?: number
  complete?: boolean
}
