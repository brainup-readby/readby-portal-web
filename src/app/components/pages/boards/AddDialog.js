import React, { useReducer, useEffect } from "react";
import {
  Button, TextField, Dialog,
  IconButton, DialogContent,
  DialogTitle, FormHelperText
} from "@material-ui/core";
import CloseIocn from "@material-ui/icons/Close";
import api from "app/api";
import LoadingIndicator from "app/components/common/LoadingIndicator";
import { withSnackbar } from "notistack";
import { API_TOPIC } from "app/api/endpoints";
import _ from "lodash";
import { ERROR_MESSAGES } from "app/components/pages/util";

const defaultData = {
  boardCode: "",
  boardName: "",
};
const reducer = (state, value) => ({ ...state, ...value });
const AddDialog = props => {
  let { open, title, buttonTxt, parentId, data, onClose, onSuccess } = props;
  const [state, setState] = useReducer(reducer, {
    boardId: _.get(data, 'boardId', ""),
    data: {
      boardCode: _.get(data, 'boardCode', ""),
      boardName: _.get(data, 'boardName', ""),
    },
    fetching: false,
    error: {}
  });

  useEffect(() => {
    if (data) {
      setState({
        boardId: data.boardId,
        data: {
          boardCode: _.get(data, 'boardCode', ""),
          boardName: _.get(data, 'boardName', ""),
        }
      });
    } else {
      setState({
        boardId: "",
        data: { ...defaultData }
      });
    }
  }, [data, open]);

  const validate = (data) => {
    let isValid = true;
    let error = {};
    if (_.isEmpty(data)) {
      data = { ...defaultData };
    }
    _.forIn(data, function (value, key) {
      if (!value) {
        isValid = false;
        _.set(error, key, ERROR_MESSAGES[key]);
      }
    });
    setState({ error });
    return isValid;
  }

  const handleClose = () => {
    setState({
      data: {
        boardCode: _.get(data, 'boardCode', ""),
        boardName: _.get(data, 'boardName', ""),
      },
      error: {}
    });
    onClose && onClose();
  }

  const onChange = (e) => {
    let stateObj = { ...state };
    _.set(stateObj, ['data', e.target.name], e.target.value);
    _.set(stateObj, ['error', e.target.name], '');
    setState(stateObj);
  }

  const onSubmit = () => {
    let board = { ...state.data };
    if (validate(board) && !state.fetching) {
      setState({ fetching: true });
      if (state.boardId) {
        board.boardId = state.boardId;
        api.sessionAuth
          .put(API_TOPIC, board).then(({ data }) => {
            handleClose();
            props.enqueueSnackbar("Board updated successfully", { variant: "success" });
            onSuccess && onSuccess("");
          }).catch(err => {
            api.showError(err, props.enqueueSnackbar, { variant: "error" });
          }).finally(() => {
            setState({ fetching: false });
          });
      } else {
        api.sessionAuth
          .post(API_TOPIC, board).then(({ data }) => {
            handleClose();
            props.enqueueSnackbar("Board added successfully", { variant: "success" });
            onSuccess && onSuccess();
          }).catch(err => {
            api.showError(err, props.enqueueSnackbar, { variant: "error" });
          }).finally(() => {
            setState({ fetching: false });
          });
      }
    }
  };

  return (
    <>
      <Dialog
        open={!!open}
        onClose={handleClose}
        maxWidth="xs"
        disableEscapeKeyDown={true}
        disableBackdropClick={true}
        fullWidth={true}>
        <IconButton onClick={handleClose} className="align-self-end p-2">
          <CloseIocn />
        </IconButton>
        <DialogTitle
          id="form-dialog-title"
          className="d-flex flex-grow-1 py-1 justify-content-center">
          {title}
        </DialogTitle>
        <DialogContent className="pb-2">
          <form>
            <div className="row col-12 p-0 m-0">
              <div className="form-group col-sm-12">
                <TextField
                  label="Code"
                  required
                  value={_.get(state.data, ['boardCode'], '')}
                  error={!_.isEmpty(_.get(state.error, ['boardCode'], ''))}
                  helperText={_.get(state.error, ['boardCode'], '')}
                  onChange={e => { onChange(e) }}
                  className="w-100 mt-3"
                  variant="standard"
                  name="boardCode" />
              </div>
            </div>
            <div className="row col-12 p-0 m-0">
              <div className="form-group col-sm-12">
                <TextField
                  label="Name"
                  required
                  value={_.get(state.data, ['boardName'], '')}
                  error={!_.isEmpty(_.get(state.error, ['boardName'], ''))}
                  helperText={_.get(state.error, ['boardName'], '')}
                  onChange={e => { onChange(e) }}
                  className="w-100 mt-3"
                  variant="standard"
                  name="boardName" />
              </div>
            </div>
          </form>
          <div className="row col-12 p-0 m-0">
            <div className="form-group col-sm-12">
              <Button
                fullWidth
                onClick={onSubmit}
                variant="contained"
                color="primary"
                size="large"
                className="text-white mt-4">
                {buttonTxt}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <LoadingIndicator open={!!state.networkRequest} />
    </>
  );
};

export default withSnackbar(AddDialog);
