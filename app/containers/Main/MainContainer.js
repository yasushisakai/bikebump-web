import React from 'react'
import { Main } from 'components'

const MainContainer = React.createClass({
  render () {
    return (
      <Main>
        {this.props.children}
      </Main>
    )
  },
})
export default MainContainer