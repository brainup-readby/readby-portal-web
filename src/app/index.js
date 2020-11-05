import React, { Component, Suspense } from "react";
import localStorage from "app/utils/localStorage";
import { UserContext } from "app/contexts";
import LoaderError, { ErrorBoundary } from "app/components/common/loaderError";
import { SnackbarProvider } from "notistack";
import api from "app/api";
import { API_FETCHUSERINFO } from "app/api/endpoints";

import User from "./user";
const Login = React.lazy(() => import("app/components/pages/login"));
const Root = React.lazy(() => import("app/components/root"));

class Config extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      fetching: false,
      success: true
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { success: false };
  }

  logout = () => {
    localStorage.logout();
    this.setState({ user: undefined, fetching: false, success: true });
  };

  login = data => {
    let user = data;
    if (!!user.token)
      localStorage.authToken = user.token;
    this.setState({
      user: user,
      fetching: false,
      success: true,
    });
  };

  render() {
    const {
      user,
      fetching,
    } = this.state;
    if (fetching) return <LoaderError className="min-vh-100" />;
    return (
      <UserContext.Provider
        value={{
          user: new User(user),
          login: this.login,
          logout: this.logout
        }}
      >
        {!!user ? (
          <Root />
        ) : (
            <Login
              className="min-vh-100 min-vw-100 d-flex align-items-center justify-content-center"
              login={this.login}
              logout={this.logout}
            />
          )}
      </UserContext.Provider>
    );
  }

  componentDidMount() {
    if (!localStorage.isLoggedIn) return;
    // call API to make user context
    // this.fetchProfile();
    this.login({ userid: "123456", email: "admin@readby.com", token: "asfdfsfsbdbdb", role: "admin" });
  }

  fetchProfile = () => {
    this.setState({ user: undefined, fetching: true, success: false });
    api.basicAuth
      .get(API_FETCHUSERINFO)
      .then(({ status, data = {} }) => {
        if (status !== 200) throw new Error();
        if (data && data.response) this.login(data.response);
        else this.logout();
      })
      .catch(err => {
        this.logout();
      });
  };

}

const App = props => {
  return (
    <ErrorBoundary className="min-vh-100">
      <Suspense fallback={<LoaderError className="min-vh-100" />}>
        <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          maxSnack={3}>
          <Config {...props} />
        </SnackbarProvider>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
