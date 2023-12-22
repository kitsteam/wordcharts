import React from 'react'

import LeftColumn from './LeftColumn'
import RightColumn from './RightColumn'

function StartPage(): React.ReactElement {
  return (
    <div className="order-1">
      <LeftColumn />
      <RightColumn />
    </div>

  )
}
export default StartPage
