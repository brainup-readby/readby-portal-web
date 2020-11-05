import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppBar, { ToolbarSpace } from "./common/appBar";
import AppDrawer from "./common/appDrawer";
import AppRoutes from "./appRoutes";
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

const Root = (props) => {
  const [drawer, setDrawer] = useState(false)
  const toggleDrawer = () => setDrawer(prev => !prev)
  return (
    <Router basename={process.env.REACT_APP_APP_ENV}>
      <div className="d-flex">
        <AppBar openDrawer={toggleDrawer}/>
        <AppDrawer open={drawer} onClose={toggleDrawer} />
        <div className="d-flex flex-column flex-grow-1 align-items-stretch min-vh-100">
          <ToolbarSpace />
          <div className="d-flex flex-column flex-grow-1">
            <AppRoutes />
          </div>
        </div>
      </div>
    </Router>
  );
}

export default Root;
