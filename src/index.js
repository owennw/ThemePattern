import React from 'react'
import ReactDom from 'react-dom'

import Shell from './Shell/Shell'
import Welcome from './Welcome/Welcome'

ReactDom.render(
  <Shell><Welcome /></Shell>,
  document.getElementById('root')
)
