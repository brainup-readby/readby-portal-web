import React, { useState, useContext } from "react";
import {
  Divider,
  // Hidden,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  withStyles
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
// import ArrDnIcon from "@material-ui/icons/ArrowDropDown";
import ArrUpIcon from "@material-ui/icons/ArrowDropUp";
import AccntIcon from "@material-ui/icons/AccountCircle";
import BackIcon from "@material-ui/icons/ArrowBack";
import { withRouter } from "react-router-dom";
import { UserContext } from "app/contexts";

const AppBarPrimary = props => {
  const [profileEl, setProfileEl] = useState(null);
  const { user = {}, logout } = useContext(UserContext);
  const { openDrawer /*openSearch, openNotes*/ } = props;
  const toggleProfileMenu = e =>
    setProfileEl(prev => (!!prev ? null : e && e.currentTarget));
  return (
    <AppBar position="fixed" className="AppBar">
      <Toolbar className="pl-1">
        <IconButton color="inherit" onClick={openDrawer} className="d-block d-md-none">
          <MenuIcon style={{ color: '#fff' }} />
        </IconButton>
        <div className="flex-grow-1" />
        <IconButton onClick={toggleProfileMenu} >
          <AccntIcon style={{ color: '#fff' }} />
        </IconButton>
        <Menu anchorEl={profileEl} open={!!profileEl} onClose={toggleProfileMenu} marginThreshold={0}>
          <Button disabled size="small" style={{ textTransform: "none" }}>
            <ListItemText className="px-0 px-md-3" primary={user.email} secondary={user.name} />
            <ArrUpIcon />
          </Button>
          <Divider />
          <MenuItem onClick={logout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

const AppBarSecondary = withRouter(props => {
  return <SecondaryAppBar {...props} />;
});

const SecondaryAppBar = props => {
  const { history, back = true, className } = props;
  return (
    <React.Fragment>
      <AppBar className={`AppBar bg-transparent secondary-bar ${className}`} elevation={0}>
        <ToolbarSpace />
        <Toolbar className="w-100 pl-1 bg-body">
          {history && back && (
            <IconButton onClick={history.goBack}>
              <BackIcon />
            </IconButton>
          )}
          {props.children}
        </Toolbar>
      </AppBar>
      <ToolbarSpace />
    </React.Fragment>
  );
};

const AppBarPublicSecondary = props => {
  return <SecondaryAppBar {...props} />;
};

const AppBarPublic = withStyles(theme => ({
  logo: {
    backgroundImage:
      "url(/logo.png)",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    height: 60,
    width: 150
  }
}))(({ classes, ...rest }) => {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <div className={classes.logo} />
      </Toolbar>
    </AppBar>
  );
});

const ToolbarSpace = props => {
  return <Toolbar style={{ opacity: 0 }} />;
};

export default AppBarPrimary;
export { ToolbarSpace, AppBarSecondary, AppBarPublic, AppBarPublicSecondary };
