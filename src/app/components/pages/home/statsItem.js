import React from "react";
import {
  withStyles
} from '@material-ui/core';

let iconStyle = {
  marginLeft: '-30px',
  fontSize: '100px',
  lineHeight: '100px',
  color: '#FFFFFF',
  opacity: 0.3,
}

const StatItem = (props) => {
  const { classes } = props
  return (
    <div className="col-12 col-md-3">
      <div className={classes.dashboardStat} onClick={props.onClick} style={{ backgroundColor: props.bgColor, cursor: 'pointer', borderRadius: '15px' }}>
        <div className={classes.visualStyle}>
          <i className="fa fa-hashtag" style={iconStyle}></i>
        </div>
        <div className={classes.detailsStyle}>
          <div className={classes.detailNumber}>
            <b> {props.count} </b>
          </div>
          <div className={classes.detailDesc}>
            {props.description}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = theme => ({
  dashboardStat: {
    display: 'block',
    marginBottom: '25px',
    overflow: 'hidden',
    color: 'white'
  },
  visualStyle: {
    width: '100px',
    height: '100px',
    float: 'left',
    paddingTop: '10px',
    paddingLeft: '15px',
    marginBottom: '15px',
    fontSize: '35px',
    lineHeight: '35px',
  },
  detailsStyle: {
    position: 'absolute',
    right: '15px',
    paddingRight: '15px'
  },
  detailNumber: {
    paddingTop: '25px',
    textAlign: 'right',
    fontSize: '34px',
    lineHeight: '36px',
    letterSpacing: '-1px',
    marginBottom: '0px',
    fontWeight: 400,
  },
  detailDesc: {
    textAlign: 'right',
    fontSize: '16px',
    letterSpacing: '0px',
    fontWeight: 400
  }
});

export default withStyles(styles)(StatItem);
