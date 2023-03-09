import React from 'react'
import { TextEncoder } from 'util'

React.useLayoutEffect = React.useEffect
global.TextEncoder = TextEncoder
