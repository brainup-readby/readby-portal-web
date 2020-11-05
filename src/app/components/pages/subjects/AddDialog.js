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
import { API_SUBJECT } from "app/api/endpoints";
import _ from "lodash";
import { ERROR_MESSAGES } from "app/components/pages/util";

const defaultData = {
  subjectCode: "",
  subjectName: "",
  subjectIcon: "",
};
const reducer = (state, value) => ({ ...state, ...value });
const AddDialog = props => {
  let { open, title, buttonTxt, parentId, data, onClose, onSuccess } = props;
  const [state, setState] = useReducer(reducer, {
    subjectId: _.get(data, 'subjectId', ""),
    tempSubjectIcon: _.get(data, 'subjectIcon', ""),
    data: {
      subjectCode: _.get(data, 'subjectCode', ""),
      subjectName: _.get(data, 'subjectName', ""),
      subjectIcon: _.get(data, 'subjectIcon', ""),
    },
    fetching: false,
    error: {}
  });

  useEffect(() => {
    if (data) {
      setState({
        subjectId: data.subjectId,
        tempSubjectIcon: _.get(data, 'subjectIcon', ""),
        data: {
          subjectCode: _.get(data, 'subjectCode', ""),
          subjectName: _.get(data, 'subjectName', ""),
          subjectIcon: _.get(data, 'subjectIcon', ""),
        }
      });
    } else {
      setState({
        subjectId: "",
        tempSubjectIcon: "",
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
      } else if (key === 'subjectIcon' && value.type && value.size > 50000) {
        _.set(error, key, "Subject Icon can't be greater than 50kb");
        isValid = false;
      }
    });
    setState({ error });
    return isValid;
  }

  const handleClose = () => {
    setState({
      tempSubjectIcon: _.get(data, 'subjectIcon', ""),
      data: {
        subjectCode: _.get(data, 'subjectCode', ""),
        subjectName: _.get(data, 'subjectName', ""),
        subjectIcon: _.get(data, 'subjectIcon', ""),
      },
      error: {}
    });
    onClose && onClose();
  }

  const onChange = (e) => {
    let stateObj = { ...state };
    if (e.target.name === 'subjectIcon') {
      let file = e.currentTarget.files[0] || _.get(data, 'subjectIcon', '');
      _.set(stateObj, ['data', e.target.name], file);
      if (e.currentTarget.files[0])
        _.set(stateObj, ['tempSubjectIcon'], URL.createObjectURL(e.currentTarget.files[0]));
      else {
        _.set(stateObj, ['tempSubjectIcon'], _.get(data, 'subjectIcon', ""));
      }
    } else {
      _.set(stateObj, ['data', e.target.name], e.target.value);
    }

    _.set(stateObj, ['error', e.target.name], '');
    setState(stateObj);
  }

  const onSubmit = () => {
    let subject = { ...state.data };
    if (validate(subject) && !state.fetching) {
      setState({ fetching: true });
      const formData = new FormData();
      _.forIn(subject, function (value, key) {
        if (key === 'subjectIcon' && value.type) {
          formData.append("icon", value, value.name);
        } else {
          formData.append(key, value);
        }
      });
      formData.append('courseId', parentId);
      if (state.subjectId) {
        formData.append('subjectId', state.subjectId);
        api.sessionAuth
          .put(API_SUBJECT, formData).then(({ data }) => {
            handleClose();
            props.enqueueSnackbar("Subject updated successfully", { variant: "success" });
            onSuccess && onSuccess("");
          }).catch(err => {
            api.showError(err, props.enqueueSnackbar, { variant: "error" });
          }).finally(() => {
            setState({ fetching: false });
          });
      } else {
        api.sessionAuth
          .post(API_SUBJECT, formData).then(({ data }) => {
            handleClose();
            props.enqueueSnackbar("Subject added successfully", { variant: "success" });
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
                  value={_.get(state.data, ['subjectCode'], '')}
                  error={!_.isEmpty(_.get(state.error, ['subjectCode'], ''))}
                  helperText={_.get(state.error, ['subjectCode'], '')}
                  onChange={e => { onChange(e) }}
                  className="w-100 mt-3"
                  variant="standard"
                  name="subjectCode" />
              </div>
            </div>
            <div className="row col-12 p-0 m-0">
              <div className="form-group col-sm-12">
                <TextField
                  label="Name"
                  required
                  value={_.get(state.data, ['subjectName'], '')}
                  error={!_.isEmpty(_.get(state.error, ['subjectName'], ''))}
                  helperText={_.get(state.error, ['subjectName'], '')}
                  onChange={e => { onChange(e) }}
                  className="w-100 mt-3"
                  variant="standard"
                  name="subjectName" />
              </div>
            </div>
            <div className="row col-12 p-0 m-0">
              <div className="form-group col-sm-12">
                <div className="w-100 mt-4 d-flex justify-content-between">
                  <input
                    type="file"
                    name="subjectIcon"
                    className="col-10 p-0"
                    accept={"image/jpeg, image/png"}
                    onChange={(e) => onChange(e)}
                  />
                  {(state.data.subjectIcon || state.tempSubjectIcon) && <img className="col-2 p-0" style={{ height: '50px', width: '50px' }} src={!state.tempSubjectIcon ? state.data.subjectIcon : state.tempSubjectIcon} alt="icon" />}
                </div>
                <FormHelperText error={_.get(state.error, 'subjectIcon', '') ? true : false}>{_.get(state.error, 'subjectIcon', '')}</FormHelperText>
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
