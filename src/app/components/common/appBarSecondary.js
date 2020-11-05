import React from 'react'
import {AppBar} from '@material-ui/core'
import {ToolbarSpace} from './appBar';

const AppBarSecondary = (props) => {
  return (
    <>
      <AppBar className='AppBar bg-transparent secondary-bar' elevation={0}>
        <ToolbarSpace/>
        {props.children}
      </AppBar>
      <ToolbarSpace/>
    </>
  )
}

export default AppBarSecondary
