import React, { useReducer } from "react";
import Dialog from "@material-ui/core/Dialog";
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import { ClrdButton } from "app/components/common/formFields";
import _ from "lodash";

const reducer = (state, newState) => ({ ...state, ...newState });

export default function BrowseFileDialog(props) {

  const [state, setState] = useReducer(reducer, {
    fetching: false,
    file: "",
    error: ""
  });

  const handleSubmit = e => {
    e.preventDefault();
    //validate
    if (state.file) {
      props.uploadFile(state.file);
      setState({ file: "", error: "" });
    }
  }

  const onClose = () => {
    setState({ file: "", error: "" });
    props.dailogClose();
  }

  const onChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      setState({ file: file, error: "" });
    } else {
      setState({ file: "", error: "" });
    }
  }

  return (
    <Dialog
      open={props.open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth={true}
      aria-labelledby="form-dialog-title"
      aria-describedby="form-dialog-description">
      <DialogTitle id="form-dialog-title" className="py-2">
        {props.title}</DialogTitle>
      <DialogContent className="py-2">
        <input
          type="file"
          accept={props.accept}
          onChange={(e) => onChange(e)}
        />
      </DialogContent>
      <DialogActions>
        <ClrdButton size="small" onClick={onClose} color="danger">
          Cancel
          </ClrdButton>
        <ClrdButton
          size="small"
          disabled={!state.file}
          onClick={handleSubmit}
          color="success"
          autoFocus>
          Upload
          </ClrdButton>
      </DialogActions>
    </Dialog>
  );
}
