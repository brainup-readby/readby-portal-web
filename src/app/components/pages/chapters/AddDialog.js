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
import { API_CHAPTER } from "app/api/endpoints";
import _ from "lodash";
import { ERROR_MESSAGES } from "app/components/pages/util";

const defaultData = {
  chapterCode: "",
  chapterName: "",
  chapterIcon: "",
};
const reducer = (state, value) => ({ ...state, ...value });
const AddDialog = props => {
  let { open, title, buttonTxt, parentId, data, onClose, onSuccess } = props;
  const [state, setState] = useReducer(reducer, {
    chapterId: _.get(data, 'chapterId', ""),
    tempChapterIcon: _.get(data, 'chapterIcon', ""),
    data: {
      chapterCode: _.get(data, 'chapterCode', ""),
      chapterName: _.get(data, 'chapterName', ""),
      chapterIcon: _.get(data, 'chapterIcon', ""),
    },
    fetching: false,
    error: {}
  });

  useEffect(() => {
    if (data) {
      setState({
        chapterId: data.chapterId,
        tempChapterIcon: _.get(data, 'chapterIcon', ""),
        data: {
          chapterCode: _.get(data, 'chapterCode', ""),
          chapterName: _.get(data, 'chapterName', ""),
          chapterIcon: _.get(data, 'chapterIcon', ""),
        }
      });
    } else {
      setState({
        chapterId: "",
        tempChapterIcon: "",
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
      } else if (key === 'chapterIcon' && value.type && value.size > 50000) {
        _.set(error, key, "Chapter Icon can't be greater than 50kb");
        isValid = false;
      }
    });
    setState({ error });
    return isValid;
  }

  const handleClose = () => {
    setState({
      tempChapterIcon: _.get(data, 'chapterIcon', ""),
      data: {
        chapterCode: _.get(data, 'chapterCode', ""),
        chapterName: _.get(data, 'chapterName', ""),
        chapterIcon: _.get(data, 'chapterIcon', ""),
      },
      error: {}
    });
    onClose && onClose();
  }

  const onChange = (e) => {
    let stateObj = { ...state };
    if (e.target.name === 'chapterIcon') {
      let file = e.currentTarget.files[0] || _.get(data, 'chapterIcon', '');
      _.set(stateObj, ['data', e.target.name], file);
      if (e.currentTarget.files[0])
        _.set(stateObj, ['tempChapterIcon'], URL.createObjectURL(e.currentTarget.files[0]));
      else {
        _.set(stateObj, ['tempChapterIcon'], _.get(data, 'chapterIcon', ""));
      }
    } else {
      _.set(stateObj, ['data', e.target.name], e.target.value);
    }

    _.set(stateObj, ['error', e.target.name], '');
    setState(stateObj);
  }

  const onSubmit = () => {
    let chapter = { ...state.data };
    if (validate(chapter) && !state.fetching) {
      setState({ fetching: true });
      const formData = new FormData();
      _.forIn(chapter, function (value, key) {
        if (key === 'chapterIcon' && value.type) {
          formData.append("icon", value, value.name);
        } else {
          formData.append(key, value);
        }
      });
      formData.append('subjectId', parentId);
      if (state.chapterId) {
        formData.append('chapterId', state.chapterId);
        api.sessionAuth
          .put(API_CHAPTER, formData).then(({ data }) => {
            handleClose();
            props.enqueueSnackbar("Chapter updated successfully", { variant: "success" });
            onSuccess && onSuccess("");
          }).catch(err => {
            api.showError(err, props.enqueueSnackbar, { variant: "error" });
          }).finally(() => {
            setState({ fetching: false });
          });
      } else {
        api.sessionAuth
          .post(API_CHAPTER, formData).then(({ data }) => {
            handleClose();
            props.enqueueSnackbar("Chapter added successfully", { variant: "success" });
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
                  value={_.get(state.data, ['chapterCode'], '')}
                  error={!_.isEmpty(_.get(state.error, ['chapterCode'], ''))}
                  helperText={_.get(state.error, ['chapterCode'], '')}
                  onChange={e => { onChange(e) }}
                  className="w-100 mt-3"
                  variant="standard"
                  name="chapterCode" />
              </div>
            </div>
            <div className="row col-12 p-0 m-0">
              <div className="form-group col-sm-12">
                <TextField
                  label="Name"
                  required
                  value={_.get(state.data, ['chapterName'], '')}
                  error={!_.isEmpty(_.get(state.error, ['chapterName'], ''))}
                  helperText={_.get(state.error, ['chapterName'], '')}
                  onChange={e => { onChange(e) }}
                  className="w-100 mt-3"
                  variant="standard"
                  name="chapterName" />
              </div>
            </div>
            <div className="row col-12 p-0 m-0">
              <div className="form-group col-sm-12">
                <div className="w-100 mt-4 d-flex justify-content-between">
                  <input
                    type="file"
                    name="chapterIcon"
                    className="col-10 p-0"
                    accept={"image/jpeg, image/png"}
                    onChange={(e) => onChange(e)}
                  />
                  {(state.data.chapterIcon || state.tempChapterIcon) && <img className="col-2 p-0" style={{ height: '50px', width: '50px' }} src={!state.tempChapterIcon ? state.data.chapterIcon : state.tempChapterIcon} alt="icon" />}
                </div>
                <FormHelperText error={_.get(state.error, 'chapterIcon', '') ? true : false}>{_.get(state.error, 'chapterIcon', '')}</FormHelperText>
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
