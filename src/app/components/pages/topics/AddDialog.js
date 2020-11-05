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
  topicCode: "",
  topicName: "",
  topicIcon: "",
};
const reducer = (state, value) => ({ ...state, ...value });
const AddDialog = props => {
  let { open, title, buttonTxt, parentId, data, onClose, onSuccess } = props;
  const [state, setState] = useReducer(reducer, {
    topicId: _.get(data, 'topicId', ""),
    tempTopicIcon: _.get(data, 'topicIcon', ""),
    data: {
      topicCode: _.get(data, 'topicCode', ""),
      topicName: _.get(data, 'topicName', ""),
      topicIcon: _.get(data, 'topicIcon', ""),
    },
    fetching: false,
    error: {}
  });

  useEffect(() => {
    if (data) {
      setState({
        topicId: data.topicId,
        tempTopicIcon: _.get(data, 'topicIcon', ""),
        data: {
          topicCode: _.get(data, 'topicCode', ""),
          topicName: _.get(data, 'topicName', ""),
          topicIcon: _.get(data, 'topicIcon', ""),
        }
      });
    } else {
      setState({
        topicId: "",
        tempTopicIcon: "",
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
      } else if (key === 'topicIcon' && value.type && value.size > 50000) {
        _.set(error, key, "Topic Icon can't be greater than 50kb");
        isValid = false;
      }
    });
    setState({ error });
    return isValid;
  }

  const handleClose = () => {
    setState({
      tempTopicIcon: _.get(data, 'topicIcon', ""),
      data: {
        topicCode: _.get(data, 'topicCode', ""),
        topicName: _.get(data, 'topicName', ""),
        topicIcon: _.get(data, 'topicIcon', ""),
      },
      error: {}
    });
    onClose && onClose();
  }

  const onChange = (e) => {
    let stateObj = { ...state };
    if (e.target.name === 'topicIcon') {
      let file = e.currentTarget.files[0] || _.get(data, 'topicIcon', '');
      _.set(stateObj, ['data', e.target.name], file);
      if (e.currentTarget.files[0])
        _.set(stateObj, ['tempTopicIcon'], URL.createObjectURL(e.currentTarget.files[0]));
      else {
        _.set(stateObj, ['tempTopicIcon'], _.get(data, 'topicIcon', ""));
      }
    } else {
      _.set(stateObj, ['data', e.target.name], e.target.value);
    }

    _.set(stateObj, ['error', e.target.name], '');
    setState(stateObj);
  }

  const onSubmit = () => {
    let topic = { ...state.data };
    if (validate(topic) && !state.fetching) {
      setState({ fetching: true });
      const formData = new FormData();
      _.forIn(topic, function (value, key) {
        if (key === 'topicIcon' && value.type) {
          formData.append("icon", value, value.name);
        } else {
          formData.append(key, value);
        }
      });
      formData.append('chapterId', parentId);
      if (state.topicId) {
        formData.append('topicId', state.topicId);
        api.sessionAuth
          .put(API_TOPIC, formData).then(({ data }) => {
            handleClose();
            props.enqueueSnackbar("Topic updated successfully", { variant: "success" });
            onSuccess && onSuccess("");
          }).catch(err => {
            api.showError(err, props.enqueueSnackbar, { variant: "error" });
          }).finally(() => {
            setState({ fetching: false });
          });
      } else {
        api.sessionAuth
          .post(API_TOPIC, formData).then(({ data }) => {
            handleClose();
            props.enqueueSnackbar("Topic added successfully", { variant: "success" });
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
                  value={_.get(state.data, ['topicCode'], '')}
                  error={!_.isEmpty(_.get(state.error, ['topicCode'], ''))}
                  helperText={_.get(state.error, ['topicCode'], '')}
                  onChange={e => { onChange(e) }}
                  className="w-100 mt-3"
                  variant="standard"
                  name="topicCode" />
              </div>
            </div>
            <div className="row col-12 p-0 m-0">
              <div className="form-group col-sm-12">
                <TextField
                  label="Name"
                  required
                  value={_.get(state.data, ['topicName'], '')}
                  error={!_.isEmpty(_.get(state.error, ['topicName'], ''))}
                  helperText={_.get(state.error, ['topicName'], '')}
                  onChange={e => { onChange(e) }}
                  className="w-100 mt-3"
                  variant="standard"
                  name="topicName" />
              </div>
            </div>
            <div className="row col-12 p-0 m-0">
              <div className="form-group col-sm-12">
                <div className="w-100 mt-4 d-flex justify-content-between">
                  <input
                    type="file"
                    name="topicIcon"
                    className="col-10 p-0"
                    accept={"image/jpeg, image/png"}
                    onChange={(e) => onChange(e)}
                  />
                  {(state.data.topicIcon || state.tempTopicIcon) && <img className="col-2 p-0" style={{ height: '50px', width: '50px' }} src={!state.tempTopicIcon ? state.data.topicIcon : state.tempTopicIcon} alt="icon" />}
                </div>
                <FormHelperText error={_.get(state.error, 'topicIcon', '') ? true : false}>{_.get(state.error, 'topicIcon', '')}</FormHelperText>
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
