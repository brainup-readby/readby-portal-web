import React from "react";

export const UserContext = React.createContext({
  user: undefined,
  logout: () => {},
  login: () => {}
});