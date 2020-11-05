import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button } from '@material-ui/core';

const alert = props => {
  const { open, handleClose, handleAction, actionText } = props;
  return (
    <Dialog
      open={!!open}
      maxWidth={"xs"}
      fullWidth={true}
      onClose={handleClose}
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Are you sure?</DialogTitle>
      <DialogActions className="px-3 pb-2">
        <Button onClick={handleClose} variant="outlined" color="default">
          Cancel
          </Button>
        <Button onClick={handleAction} variant="outlined" color="inherit" style={{color:'red'}}>
          {actionText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default alert;