import React from "react";
import {
  withStyles,
  Divider,
  Drawer,
  Hidden,
  List,
  ListItem,
  ListItemText,
  Typography
} from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { DrawerWidth } from "app/utils/constants";

const Menu = props => {
  const { classes } = props;
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className={`${classes.toolbar} position-relative bg-white`}>
        <div className={classes.logo} />
      </div>
      <Divider className="bg-dark" />
      <List disablePadding component="nav" className="drawer flex-grow-1">
        <ListItem button component={NavLink} to="/" exact strict>
          <i className={`fa fa-tachometer-alt fa-fw icon`} />
          <ListItemText primary="Dashboard" color="inherit" />
        </ListItem>
        <ListItem button component={NavLink} to="/courses" exact strict>
          <i className={`fa fa-address-card fa-fw icon`} />
          <ListItemText primary="Course Management" color="inherit" />
        </ListItem>
        <ListItem button component={NavLink} to="/subjects" exact strict>
          <i className={`fa fa-book fa-fw icon`} />
          <ListItemText primary="Subject Management" color="inherit" />
        </ListItem>
        <ListItem button component={NavLink} to="/chapters" exact strict>
          <i className={`fa fa-list-alt fa-fw icon`} />
          <ListItemText primary="Chapter Management" color="inherit" />
        </ListItem>
        <ListItem button component={NavLink} to="/topics" exact strict>
          <i className={`fa fa-tasks fa-fw icon`} />
          <ListItemText primary="Topic Management" color="inherit" />
        </ListItem>
        <ListItem button component={NavLink} to="/users" exact strict>
          <i className={`fa fa-users fa-fw icon`} />
          <ListItemText primary="User Management" color="inherit" />
        </ListItem>
        <ListItem button component={NavLink} to="/boards" exact strict>
          <i className={`fa fa-clipboard fa-fw icon`} />
          <ListItemText primary="Board Management" color="inherit" />
        </ListItem>
      </List>
      <Divider className="bg-dark" />
      <Typography variant="caption" className="text-center text-muted p-3">
        ReadBy&copy; {new Date().getFullYear()}
      </Typography>
    </div>
  );
};

const AppDrawer = props => {
  const { classes, open, onClose } = props;
  const menu = <Menu classes={classes} />;
  return (
    <nav className={classes.drawer}>
      <Hidden mdUp>
        <Drawer
          variant="temporary"
          open={!!open}
          onClose={onClose}
          classes={{ paper: classes.drawerPaper }}
        >
          {menu}
        </Drawer>
      </Hidden>
      <Hidden smDown>
        <Drawer
          variant="permanent"
          open
          classes={{ paper: classes.drawerPaper }}
        >
          {menu}
        </Drawer>
      </Hidden>
    </nav>
  );
};

const styles = theme => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: DrawerWidth,
      flexShrink: 0
    }
  },
  toolbar: theme.mixins.toolbar,
  logo: {
    backgroundImage:
      "url(/drawer-logo.png)",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    position: "absolute",
    top: theme.spacing.unit,
    bottom: theme.spacing.unit,
    left: theme.spacing.unit,
    right: theme.spacing.unit
  },
  drawerPaper: {
    width: DrawerWidth,
    background: "#242528"
  }
});

export default withStyles(styles)(AppDrawer);
