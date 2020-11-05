import React from 'react';
import {
  withStyles,
  CircularProgress, Button,
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import { DEFAULT_ERROR } from 'app/utils/constants';

const styles = () => ({
  altRoot: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  errorMessage: {
    maxWidth: '320px',
    textAlign: 'center',
    marginTop: '16px',
  }
});

const LoaderError = (props) => {
  const {
    classes, fill,
    error, message,
    retry, className
  } = props;
  const styling = `${classes.altRoot} ${!!fill ? 'flex-fill' : ''} ${className || ''}`
  if (!!error) {
    if (error !== true) console.error(error)
    return (
      <div className={styling}>
        <h1 className='text-center'><i className="fas fa-exclamation-triangle"></i></h1>
        <div className={classes.errorMessage}>
          { message || DEFAULT_ERROR }
        </div>
        {!!retry && <Button variant='contained' color='secondary'
          onClick={retry} className='mt-3'>
          <RefreshIcon className='mr-3'/>Retry
        </Button>}
      </div>
    );
  } else {
    return (
      <div className={styling}>
        <CircularProgress className={classes.progress} />
      </div>
    );
  }
}

const StyledLoaderError = withStyles(styles)(LoaderError);

export class ErrorBoundary extends React.Component {
  state = {hasError: false}

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.error(error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError)
      return <StyledLoaderError {...this.props} error />
    return this.props.children;
  }
}

export default StyledLoaderError;
