import React from "react";
import {
  withStyles,
  CircularProgress,
  Dialog,
  DialogContent
} from "@material-ui/core";

const BlockingLoader = props => {
  const { classes, open, onClose } = props;
  return (
    <Dialog
      id="dialog-loading"
      open={!!open}
      disableBackdropClick
      disableEscapeKeyDown
      classes={{ root: classes.root }}
      onClose={onClose}
    >
      <DialogContent>
        <CircularProgress />
      </DialogContent>
    </Dialog>
  );
};

const styles = theme => ({
  root: {
    zIndex: theme.zIndex.modal + 99
  }
});

export default props => {
  let LoadingIndicator = withStyles(styles, { withTheme: true })(
    BlockingLoader
  );
  return <LoadingIndicator {...props} />;
};
