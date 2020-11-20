import React from 'react'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
const styles = {
  root: {
    marginLeft: 0
  }
}
const SpinnerAdornment = withStyles(styles)(props => (
  <CircularProgress
    className={props.classes.spinner}
    size={20}
  />
))
const LoadingButton = (props) => {
  const {
    children,
    loading,
    ...rest
  } = props
  return (
    <Button {...rest}>
      {loading ? <SpinnerAdornment {...rest} /> : children}
    </Button>
  )
}

export default LoadingButton