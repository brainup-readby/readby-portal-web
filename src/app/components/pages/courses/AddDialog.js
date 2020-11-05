import React, { useReducer, useEffect } from "react";
import {
  Button, TextField, Dialog,
  IconButton, DialogContent,
  DialogTitle, MenuItem
} from "@material-ui/core";
import CloseIocn from "@material-ui/icons/Close";
import api from "app/api";
import LoadingIndicator from "app/components/common/LoadingIndicator";
import { withSnackbar } from "notistack";
import { API_COURSE } from "app/api/endpoints";
import _ from "lodash";
import { ERROR_MESSAGES } from "app/components/pages/util";

const defaultData = {
  courseCode: "",
  courseName: "",
  courseYear: "",
  courseStream: "",
  courseType: "",
};
const reducer = (state, value) => ({ ...state, ...value });
const AddDialog = props => {
  let { open, title, buttonTxt, data, onClose, onSuccess } = props;
  const [state, setState] = useReducer(reducer, {
    courseId: _.get(data, 'courseId', ""),
    data: {
      courseCode: _.get(data, 'courseCode', ""),
      courseName: _.get(data, 'courseName', ""),
      courseYear: _.get(data, 'courseYear', ""),
      courseStream: _.get(data, 'courseStream', ""),
      courseType: _.get(data, 'courseType', ""),
    },
    fetching: false,
    error: {}
  });

  useEffect(() => {
    if (data) {
      setState({
        courseId: data.courseId,
        data: {
          courseCode: data.courseCode,
          courseName: data.courseName,
          courseYear: data.courseYear,
          courseStream: data.courseStream,
          courseType: data.courseType,
        }
      });
    } else {
      setState({
        courseId: "",
        data: { ...defaultData }
      });
    }
  }, [data, open]);

  const validate = (data) => {
    let isValid = true;
    let error = {};
    if (_.isEmpty(data)) {
      data = { ...defaultData }
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
    onClose && onClose();
    setState({
      data: {}, error: {}
    });
  }

  const onChange = (event) => {
    let stateObj = { ...state };
    _.set(stateObj, ['data', event.target.name], event.target.value);
    _.set(stateObj, ['error', event.target.name], '');
    setState(stateObj);
  }

  const onSubmit = () => {
    let course = { ...state.data };
    if (validate(course) && !state.fetching) {
      setState({ fetching: true });
      if (state.courseId) {
        course.courseId = state.courseId;
        api.sessionAuth
          .put(API_COURSE, course).then(({ data }) => {
            handleClose();
            props.enqueueSnackbar("Course updated successfully", { variant: "success" });
            onSuccess && onSuccess("");
          }).catch(err => {
            api.showError(err, props.enqueueSnackbar, { variant: "error" });
          }).finally(() => {
            setState({ fetching: false });
          });
      } else {
        api.sessionAuth
          .post(API_COURSE, course).then(({ data }) => {
            handleClose();
            props.enqueueSnackbar("Course added successfully", { variant: "success" });
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
                  value={_.get(state.data, ['courseCode'], '')}
                  error={!_.isEmpty(_.get(state.error, ['courseCode'], ''))}
                  helperText={_.get(state.error, ['courseCode'], '')}
                  onChange={event => { onChange(event) }}
                  className="w-100 mt-3"
                  variant="standard"
                  name="courseCode" />
              </div>
            </div>
            <div className="row col-12 p-0 m-0">
              <div className="form-group col-sm-12">
                <TextField
                  label="Name"
                  required
                  value={_.get(state.data, ['courseName'], '')}
                  error={!_.isEmpty(_.get(state.error, ['courseName'], ''))}
                  helperText={_.get(state.error, ['courseName'], '')}
                  onChange={event => { onChange(event) }}
                  className="w-100 mt-3"
                  variant="standard"
                  name="courseName" />
              </div>
            </div>
            <div className="row col-12 p-0 m-0">
              <div className="form-group col-sm-12">
                <TextField
                  select
                  required
                  label="Type"
                  value={_.get(state.data, ['courseType'], '')}
                  error={!_.isEmpty(_.get(state.error, ['courseType'], ''))}
                  helperText={_.get(state.error, ['courseType'], '')}
                  onChange={event => { onChange(event) }}
                  className="w-100 mt-3"
                  variant="standard"
                  name="courseType" >
                  <MenuItem className="pl-3" value={''}>Select</MenuItem>
                  <MenuItem className="pl-3" value="Academic">Academic</MenuItem>
                  <MenuItem className="pl-3" value="Compitative">Compitative</MenuItem>
                </TextField>
              </div>
            </div>
            <div className="row col-12 p-0 m-0">
              <div className="form-group col-sm-12">
                <TextField
                  select
                  required
                  label="Year"
                  value={_.get(state.data, ['courseYear'], '')}
                  error={!_.isEmpty(_.get(state.error, ['courseYear'], ''))}
                  helperText={_.get(state.error, ['courseYear'], '')}
                  onChange={event => { onChange(event) }}
                  className="w-100 mt-3"
                  variant="standard"
                  name="courseYear" >
                  <MenuItem className="pl-3" value={''}>Select</MenuItem>
                  <MenuItem className="pl-3" value="1">1st Year</MenuItem>
                  <MenuItem className="pl-3" value="2">2nd Year</MenuItem>
                  <MenuItem className="pl-3" value="3">3rd Year</MenuItem>
                  <MenuItem className="pl-3" value="4">4th Year</MenuItem>
                </TextField>
              </div>
            </div>
            <div className="row col-12 p-0 m-0">
              <div className="form-group col-sm-12">
                <TextField
                  select
                  required
                  label="Stream"
                  value={_.get(state.data, ['courseStream'], '')}
                  error={!_.isEmpty(_.get(state.error, ['courseStream'], ''))}
                  helperText={_.get(state.error, ['courseStream'], '')}
                  onChange={event => { onChange(event) }}
                  className="w-100 mt-3"
                  variant="standard"
                  name="courseStream" >
                  <MenuItem className="pl-3" value={''}>Select</MenuItem>
                  <MenuItem className="pl-3" value="HR">HR</MenuItem>
                  <MenuItem className="pl-3" value="Finance">Finance</MenuItem>
                </TextField>
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
