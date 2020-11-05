import React from "react";
import { withRouter } from "react-router-dom";
import { LinearProgress, Typography, Switch, IconButton, Tooltip } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import api from "app/api";
import { UserContext } from "app/contexts";
import { API_COURSE, API_COURSE_STATUS } from "app/api/endpoints";
import { withSnackbar } from "notistack"
import { ClrdButton } from "app/components/common/formFields";
import AddCourse from "app/components/pages/courses/AddDialog";
import AddSubject from "app/components/pages/subjects/AddDialog";
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
        courseId: 1,
        courseCode: "courseCode1",
        courseName: "MBA",
        courseYear: "1",
        courseStream: "HR",
        courseType: "Academic",
        isActive: true
      },
      {
        courseId: 2,
        courseCode: "courseCode2",
        courseName: "MBA",
        courseYear: "2",
        courseStream: "Finance",
        courseType: "Compitative",
        isActive: false
      },
    ],
    alert: null,
    selectedCourse: null,
    openDialog: false,
    openSubjectDialog: false
  };

  COLUMNS = [
    { name: "#", ...NO_FILTER_WITH_SORTING },
    { name: "Code", ...NO_FILTER_WITH_SORTING },
    { name: "Name", ...NO_FILTER_WITH_SORTING },
    { name: "Year", ...NO_FILTER_WITH_SORTING },
    { name: "Stream", ...NO_FILTER_WITH_SORTING },
    { name: "Type", ...FILTER_WITH_SORTING },
    {
      name: "Status",
      options: {
        sort: false,
        filter: false,
        customBodyRender: (id) => {
          let course = _.find(this.state.list, { courseId: id });
          return (
            <>
              <Tooltip title={course.isActive ? "Click to Deactivate" : "Click to Activate"}><Switch
                checked={course.isActive}
                onChange={() => this.updateStatus(id, !course.isActive)}
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
          let course = _.find(this.state.list, { courseId: id });
          return (
            <>
              <Tooltip title="Edit Course"><IconButton size="small" style={{ color: "green" }} onClick={() => {
                this.setState({ selectedCourse: course, openDialog: true })
              }}>
                <EditIcon />
              </IconButton></Tooltip>
              <Tooltip title="Delete Course"><IconButton size="small" style={{ color: "red" }} onClick={() => this.setState({ selectedCourse: course, alert: true })}>
                <DeleteIcon />
              </IconButton></Tooltip>
              <Tooltip title="Add Subjects"><IconButton size="small" style={{ color: "green" }} onClick={() => {
                this.setState({ selectedCourse: course, openSubjectDialog: true })
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
    this.props.onCourseClientUpdate(e.target.value);
  }

  fetchData = () => {
    let { fetching } = this.state;
    if (!fetching) {
      this.setState({ fetching: true });
      api.sessionAuth
        .get(API_COURSE).then(({ data }) => {
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
        .put(API_COURSE_STATUS, { courseId: id, isActive: isActive }).then(({ data }) => {
          let message = "Course deactivated successfully";
          if (isActive) {
            message = "Course activated successfully";
          }
          let stateObj = { ...this.state };
          let list = stateObj.list.map((course) => {
            if (course.courseId === id) {
              course.isActive = isActive;
            }
            return course;
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
    let { fetching, selectedCourse } = this.state;
    if (!fetching) {
      this.setState({ fetching: true, alert: false });
      api.sessionAuth
        .put(API_COURSE, { courseId: selectedCourse.courseId }).then(({ data }) => {
          this.fetchData();
          let message = "Course deleted successfully";
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
      data.courseCode,
      data.courseName,
      data.courseYear,
      data.courseStream,
      data.courseType,
      data.courseId,
      data.courseId
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
                <Typography variant="h5" key="course_list">
                  Course Management
              </Typography>
              ]}
              data={this.getTableData()}
              columns={this.getColumns()}
              options={{
                customToolbar: () => {
                  return (
                    <>
                      <ClrdButton variant="contained" color="primary" className="mx-1 m-1 text-white float-right"
                        onClick={() => {
                          this.setState({ selectedCourse: null, openDialog: true })
                        }}>
                        Add Course
                      </ClrdButton>
                    </>
                  );
                },
                ...OPTS_TABLE,
                searchText: this.state.q,
                searchPlaceholder: 'Name',
                count: this.state.count,
                onColumnSortChange: this.onSortColumn
              }}
            />
            <AddCourse
              open={this.state.openDialog}
              title={this.state.selectedCourse ? 'Update Course' : 'Add Course'}
              buttonTxt={this.state.selectedCourse ? 'Update' : 'Add'}
              data={this.state.selectedCourse}
              onSuccess={() => this.fetchData()}
              onClose={() => { this.setState({ openDialog: false }) }}
            />
            <AddSubject
              open={this.state.openSubjectDialog}
              title={'Add Subject'}
              buttonTxt={'Add'}
              parentId={_.get(this.state.selectedCourse, 'courseId', '')}
              onClose={() => { this.setState({ openSubjectDialog: false }) }}
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