import React from "react";
import { withRouter } from "react-router-dom";
import { LinearProgress, Typography, Switch, IconButton, Tooltip } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import api from "app/api";
import { UserContext } from "app/contexts";
import { API_SUBJECT, API_SUBJECT_STATUS } from "app/api/endpoints";
import { withSnackbar } from "notistack"
import AddDialog from "app/components/pages/subjects/AddDialog";
import AddChapterDialog from "app/components/pages/chapters/AddDialog";
import _ from "lodash";
import ConfirmAlert from 'app/components/common/confirmAlert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const NO_FILTER_WITH_SORTING = { options: { sort: true, filter: false } };
const FILTER_WITH_SORTING = { options: { sort: true, filter: true } };

const OPTS_TABLE = {
  filter: true,
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
        courseName: "Course1",
        subjectId: 1,
        subjectCode: "subjectCode1",
        subjectName: "subjectName1",
        subjectIcon: "https://i.picsum.photos/id/283/200/200.jpg?hmac=Qyx_FaWqQPrmQrGhQNKh2t2FUuwTiMNTS1VCkc86YrM",
        isActive: true
      },
      {
        courseName: "Course2",
        subjectId: 2,
        subjectCode: "subjectCode2",
        subjectName: "subjectName2",
        subjectIcon: "https://i.picsum.photos/id/461/200/200.jpg?hmac=OfKixfjCbSjC-h3P78PbMNsJqVCnAClKqNmrUCONSw4",
        isActive: false
      },
    ],
    alert: null,
    selectedSubject: null,
    openDialog: false,
    openChapterDialog: false
  };

  COLUMNS = [
    { name: "#", ...NO_FILTER_WITH_SORTING },
    { name: "Course Name", ...FILTER_WITH_SORTING },
    {
      name: "Icon",
      options: {
        sort: false,
        filter: false,
        customBodyRender: (icon) => {
          return (<img style={{ height: '50px', width: '50px' }} src={icon} alt="icon" />)
        }
      }
    },
    { name: "Code", ...NO_FILTER_WITH_SORTING },
    { name: "Name", ...NO_FILTER_WITH_SORTING },
    {
      name: "Status",
      options: {
        sort: false,
        filter: false,
        customBodyRender: (id) => {
          let subject = _.find(this.state.list, { subjectId: id });
          return (
            <>
              <Tooltip title={subject.isActive ? "Click to Deactivate" : "Click to Activate"}><Switch
                checked={subject.isActive}
                onChange={() => this.updateStatus(id, !subject.isActive)}
                color="primary"
              /></Tooltip>
            </>
          )
        }
      }
    },
    {
      name: "Action",
      options: {
        sort: false,
        filter: false,
        customBodyRender: (id) => {
          let subject = _.find(this.state.list, { subjectId: id });
          return (
            <>
              <Tooltip title="Edit Subject"><IconButton style={{ color: "green" }} onClick={() => {
                this.setState({ selectedSubject: subject, openDialog: true })
              }}>
                <EditIcon />
              </IconButton></Tooltip>
              <Tooltip title="Delete Subject"><IconButton style={{ color: "red" }} onClick={() => this.setState({ selectedSubject: subject, alert: true })} >
                <DeleteIcon />
              </IconButton></Tooltip>
              <Tooltip title="Add Chapter"><IconButton style={{ color: "green" }} onClick={() => {
                this.setState({ selectedSubject: subject, openChapterDialog: true })
              }}>
                <AddCircleIcon />
              </IconButton></Tooltip>
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
    this.props.onSubjectClientUpdate(e.target.value);
  }

  fetchData = () => {
    let { fetching } = this.state;
    if (!fetching) {
      this.setState({ fetching: true });
      api.sessionAuth
        .get(API_SUBJECT).then(({ data }) => {
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
        .put(API_SUBJECT_STATUS, { subjectId: id, isActive: isActive }).then(({ data }) => {
          let message = "Subject deactivated successfully";
          if (isActive) {
            message = "Subject activated successfully";
          }
          let stateObj = { ...this.state };
          let list = stateObj.list.map((subject) => {
            if (subject.subjectId === id) {
              subject.isActive = isActive;
            }
            return subject;
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
    let { fetching, selectedSubject } = this.state;
    if (!fetching) {
      this.setState({ fetching: true, alert: false });
      api.sessionAuth
        .put(API_SUBJECT, { subjectId: selectedSubject.subjectId }).then(({ data }) => {
          this.fetchData();
          let message = "Subject deleted successfully";
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
      data.courseName,
      data.subjectIcon,
      data.subjectCode,
      data.subjectName,
      data.subjectId,
      data.subjectId
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
                <Typography variant="h5" key="subject_list">
                  Subject Management
              </Typography>
              ]}
              data={this.getTableData()}
              columns={this.getColumns()}
              options={{
                ...OPTS_TABLE,
                searchText: this.state.q,
                searchPlaceholder: 'Name',
                count: this.state.count,
                onColumnSortChange: this.onSortColumn
              }}
            />
            <AddDialog
              subjectId={this.props.subjectId}
              open={this.state.openDialog}
              title={'Update Subject'}
              buttonTxt={'Update'}
              data={this.state.selectedSubject}
              onSuccess={() => this.fetchData()}
              onClose={() => { this.setState({ openDialog: false }) }}
            />
            <AddChapterDialog
              open={this.state.openChapterDialog}
              title={'Add Chapter'}
              buttonTxt={'Add'}
              parentId={_.get(this.state.selectedSubject, 'subjectId', '')}
              onClose={() => { this.setState({ openChapterDialog: false }) }}
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