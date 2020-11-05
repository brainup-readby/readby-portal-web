import React from "react";
import Dialog from "@material-ui/core/Dialog";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { Player, BigPlayButton } from 'video-react';
import _ from "lodash";
import { ClrdButton } from "app/components/common/formFields";

const VideoPlayer = (props) => {
  const onClose = () => {
    props.dailogClose();
  }

  return (
    <Dialog
      open={props.open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth={true}
      aria-labelledby="form-dialog-title"
      aria-describedby="form-dialog-description">
      <div style={props.style}>
        <DialogTitle id="form-dialog-title" className="py-2">
          {props.title}</DialogTitle>
        <DialogContent className="py-2">
          <Player
            playsInline
            autoPlay={props.autoPlay}
            poster={props.poster}
            src={props.src}
          >
            <BigPlayButton style={{ visibility: 'hidden' }} position="center" />
          </Player>
        </DialogContent>
        <DialogActions>
          <ClrdButton size="small" onClick={onClose} color="danger">
            Close
          </ClrdButton>
        </DialogActions>
      </div>
    </Dialog>
  )
}

export default VideoPlayer;