import React from "react";
import { withRouter } from "react-router-dom";
import { LinearProgress, Typography, Switch, IconButton, Tooltip } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import api from "app/api";
import { UserContext } from "app/contexts";
import { API_USER } from "app/api/endpoints";
import { withSnackbar } from "notistack"
import { ClrdButton } from "app/components/common/formFields";
import _ from "lodash";
import ConfirmAlert from 'app/components/common/confirmAlert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const NO_FILTER_WITH_SORTING = { options: { sort: true, filter: false } };
const FILTER_WITH_SORTING = { options: { sort: true, filter: true } };

const OPTS_TABLE = {
  filter: false,
  search: true,
  pagination: true,
  rowsPerPage: 10,
  rowsPerPageOptions: [10, 50, 100],
  serverSide: false,
  selectableRows: "none",
  responsive: "stacked",
  print: false,
  download: false,
  viewColumns: false
};

class List extends React.Component {
  static contextType = UserContext;
  state = {
    fetching: false,
    list: [
      {
        userId: 1,
        firstName: "Aman",
        lastName: "Jain",
        middleName: "",
        userName: "aman.jain",
        email: "aman@gmail.com",
        mobileNo: "9015287400",
        courseName: "MBA",
        courseYear: "1",
        courseStream: "HR",
        isActive: true
      },
      {
        userId: 2,
        firstName: "Rakesh",
        lastName: "Verma",
        middleName: "Kumar",
        userName: "rakesh.singh",
        email: "rakesh@gmail.com",
        mobileNo: "9045234403",
        courseName: "MBA",
        courseYear: "2",
        courseStream: "Finance",
        isActive: false
      },
    ],
    alert: null,
    selectedUser: null,
    openDialog: false,
    openSubjectDialog: false
  };

  COLUMNS = [
    { name: "#", ...NO_FILTER_WITH_SORTING },
    { name: "Username", ...NO_FILTER_WITH_SORTING },
    { name: "Name", ...NO_FILTER_WITH_SORTING },
    { name: "Email", ...NO_FILTER_WITH_SORTING },
    { name: "Mobile No.", ...NO_FILTER_WITH_SORTING },
    { name: "Course Name", ...NO_FILTER_WITH_SORTING },
    { name: "Course Year", ...NO_FILTER_WITH_SORTING },
    { name: "Course Stream", ...NO_FILTER_WITH_SORTING },
    {
      name: "Status",
      options: {
        sort: false,
        filter: false,
        customBodyRender: (id) => {
          let user = _.find(this.state.list, { userId: id });
          return (
            <>
              <Tooltip title={user.isActive ? "Click to Deactivate" : "Click to Activate"}><Switch
                checked={user.isActive}
                onChange={() => this.updateStatus(id, !user.isActive)}
                color="primary"
              /></Tooltip>
            </>
          )
        }
      }
    }
  ];

  componentDidMount() {
    // this.fetchData();
  }

  getColumns = () => {
    return this.COLUMNS;
  }

  onChange = (e) => {
    if (e.target.value !== "")
      this.fetchData(e.target.value);
    this.props.onUserClientUpdate(e.target.value);
  }

  fetchData = () => {
    let { fetching } = this.state;
    if (!fetching) {
      this.setState({ fetching: true });
      api.sessionAuth
        .get(API_USER).then(({ data }) => {
          this.setState({ list: data.data || [] });
        }).catch(err => {
          api.showError(err, this.props.enqueueSnackbar, { variant: "error" });
        }).finally(() => {
          this.setState({ fetching: false });
        });
    }
  };

  updateStatus = (id, isActive) => {
    let { fetching } = this.state;
    if (!fetching) {
      this.setState({ fetching: true });
      api.sessionAuth
        .put(API_USER, { userId: id, isActive: isActive }).then(({ data }) => {
          let message = "User deactivated successfully";
          if (isActive) {
            message = "User activated successfully";
          }
          let stateObj = { ...this.state };
          let list = stateObj.list.map((user) => {
            if (user.userId === id) {
              user.isActive = isActive;
            }
            return user;
          })
          this.setState({ list });
          this.props.enqueueSnackbar(message, { variant: "success" });
        }).catch(err => {
          api.showError(err, this.props.enqueueSnackbar, { variant: "error" });
        }).finally(() => {
          this.setState({ fetching: false });
        });
    }
  }

  onDelete = () => {
    let { fetching, selectedUser } = this.state;
    if (!fetching) {
      this.setState({ fetching: true, alert: false });
      api.sessionAuth
        .put(API_USER, { userId: selectedUser.userId }).then(({ data }) => {
          this.fetchData();
          let message = "User deleted successfully";
          this.props.enqueueSnackbar(message, { variant: "success" });
        }).catch(err => {
          api.showError(err, this.props.enqueueSnackbar, { variant: "error" });
        }).finally(() => {
          this.setState({ fetching: false });
        });
    }
  }

  getTableData = () => {
    let { list = [] } = this.state;
    return list.map((data, index) => [
      index + 1,
      data.userName,
      data.firstName,
      data.email,
      data.mobileNo,
      data.courseName,
      data.courseYear,
      data.courseStream,
      data.userId
    ]);
  };

  render() {
    const { fetching } = this.state;
    return (
      <>
        <div className="container-fluid p-3 p-md-4">
          <div className="position-relative">
            <MUIDataTable
              title={[
                <Typography variant="h5" key="user_list">
                  User Management
              </Typography>
              ]}
              data={this.getTableData()}
              columns={this.getColumns()}
              options={{
                customToolbar: () => {
                  return (<>
                  </>);
                },
                ...OPTS_TABLE,
                searchText: this.state.q,
                searchPlaceholder: 'Name',
                count: this.state.count,
                onColumnSortChange: this.onSortColumn
              }}
            />
            <ConfirmAlert
              open={this.state.alert}
              handleClose={() => { this.setState({ alert: false }) }}
              handleAction={this.onDelete}
              actionText={"Yes, delete it!"}
            />
            {!!fetching && (
              <div className="white-overlay">
                <LinearProgress />
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default withSnackbar(withRouter(List));