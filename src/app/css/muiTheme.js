import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { MuiPickersUtilsProvider } from "material-ui-pickers";
import MomentUtils from "@date-io/moment";

// Also see /css/px-bootstrap.scss
const Primary = "#3c94cf";
const Secondary = "#52C5DE";
const BodyColor = "#3e3f42";
const BodyBG = "#f0f3f5";

const theme = createMuiTheme({
  overrides: {
    MuiFormControlLabel: {
      label: {
        "&.label-large": {
          fontSize: "1rem"
        }
      }
    },
    MuiAppBar: {
      positionFixed: {
        "&.secondary-bar": {
          zIndex: 1099
        }
      }
    },
    MuiTableRow: {
      root: {
        "&:nth-child(odd)": {
          backgroundColor: "rgba(0, 0, 0, 0.03)"
        }
      }
    },
    MuiTableCell: {
      root: {
        padding: "4px 0px 4px 24px"
      }
    },
    MUIDataTableHeadCell: {
      toolButton: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
      },
      sortAction: {
        height: "auto"
      }
    },
    MUIDataTableBodyCell: {
      cellStacked: {
        "@media (max-width: 961px)": {
          width: "30% !important",
          height: "30% !important",
          borderBottomWidth: "0px !important",
          backgroundColor: "transparent !important",
          paddingBottom: 0,
          paddingTop: "15px",
          color: "#999",
          fontSize: 12
        }
      },
      responsiveStacked: {
        "@media (max-width: 961px)": {
          width: "70% !important",
          height: "70% !important",
          overflowX: "scroll",
          paddingTop: "15px",
          borderBottomWidth: 0,
          "& .table-actions": {
            marginTop: -20
          }
        }
      }
    },
    MUIDataTableFilter: {
      selectFormControl: {
        flex: "1 1 200px",
        marginRight: 0
      }
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 601,
      md: 961,
      lg: 1441,
      xl: 1921
    }
  },
  palette: {
    primary: {
      main: Primary,
      contrastText: "#000"
    },
    secondary: {
      main: Secondary,
      contrastText: "#fff"
    },
    background: {
      default: BodyBG
    },
    text: {
      primary: BodyColor,
      secondary: BodyColor
    }
  },
  typography: {
    fontFamily: '"Roboto", sans-serif;',
    useNextVariants: true
  }
});

class PXMaterialUITheme extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          {this.props.children}
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    );
  }
}

export default PXMaterialUITheme;