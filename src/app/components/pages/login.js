import React, { useReducer } from "react";
import { TextField, Card, CardContent, Typography } from "@material-ui/core";
import { withSnackbar } from "notistack";
// import api from "app/api";
import { ClrdButton } from "app/components/common/formFields";
// import { API_LOGIN } from "app/api/endpoints";
import _ from "lodash";
import LoadingIndicator from "app/components/common/LoadingIndicator";
import validator from 'validator';

const reducer = (state, newState) => ({ ...state, ...newState });
const Login = (props) => {
  const [state, setState] = useReducer(reducer, {
    fetching: false,
    email: "",
    password: "",
    error: {}
  });

  const handleSubmit = () => {
    const { login } = props;
    const { email, password, fetching } = state;
    let validate = true;
    let error = {};
    if (!email) {
      validate = false;
      _.set(error, ['email'], "Email is required");
    } else {
      let isValidEmail = validator.isEmail(email);
      if (!isValidEmail) {
        validate = false;
        _.set(error, ['email'], "Email is not valid");
      }
    }

    if (!password) {
      validate = false;
      _.set(error, ['password'], "Password is required");
    }

    if (!fetching && validate) {
      // setState({ fetching: true });
      // api.withoutAuth
      //   .post(API_LOGIN, { user: email, password })
      //   .then(({ status, data = {} }) => {
      //     if (status !== 200 || !data.success) throw new Error(data.message);
      //     setState({ fetching: false });
      //     data.response.email = email;
      //     login && login(data.response);
      //   })
      //   .catch(err => {
      //     api.showError(err, props.enqueueSnackbar, { variant: "error" });
      //     setState({ fetching: false });
      //     logout && logout();
      //   });
      login && login({ userid: "663456", email: "admin@readby.com", token: "asbdbdb", role: "admin" });
    } else {
      setState({ error });
    }
  };
  const { login, logout, ...rest } = props;
  return (
    <div {...rest}>
      <Card className="login-card">
        <CardContent
          className="d-flex flex-column align-items-center m-1 w-100">
          <img
            src="/logo.png"
            alt="logo"
            className="mt-2"
            style={{ height: 70, width: 250 }}
          />
          <Typography color="primary" component="h1" className="my-4 font-weight-bold" variant="h4">
            Login
        </Typography>
          <div className="container-fluid p-0 m-0">
            <div className="row col-12 p-0 m-0">
              <div className="form-group col-sm-12">
                <TextField
                  autoFocus={true}
                  margin="normal"
                  label="Email"
                  required
                  className="w-100"
                  variant="standard"
                  autoComplete="email"
                  value={state.email}
                  error={!_.isEmpty(_.get(state.error, ['email'], ''))}
                  helperText={_.get(state.error, ['email'], '')}
                  onChange={(e) => {
                    let error = { ...state.error };
                    error.email = "";
                    setState({ email: e.target.value, error });
                  }}
                />
              </div>
            </div>
            <div className="row col-12 p-0 m-0">
              <div className="form-group col-sm-12">
                <TextField
                  label="Password"
                  required
                  margin="normal"
                  className="w-100"
                  variant="standard"
                  type="password"
                  value={state.password}
                  autoComplete="password"
                  error={!_.isEmpty(_.get(state.error, ['password'], ''))}
                  helperText={_.get(state.error, ['password'], '')}
                  onChange={(e) => {
                    let error = { ...state.error };
                    error.password = "";
                    setState({ password: e.target.value, error });
                  }}
                />
              </div>
            </div>
            <div className="row col-12 p-0 m-0">
              <div className="form-group col-sm-12 mt-4">
                <ClrdButton color="primary" size="large" className="w-100" variant="contained" type="submit" onClick={handleSubmit}>Login</ClrdButton>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <LoadingIndicator open={!!state.fetching} />
    </div>
  );
}

export default withSnackbar(Login);
