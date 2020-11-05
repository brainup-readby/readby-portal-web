import React from "react";
import { withRouter } from "react-router-dom";
import { LinearProgress, Typography, Switch, IconButton, Tooltip } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import api from "app/api";
import { UserContext } from "app/contexts";
import { API_TOPIC } from "app/api/endpoints";
import { withSnackbar } from "notistack"
import AddDialog from "app/components/pages/topics/AddDialog";
import _ from "lodash";
import ConfirmAlert from 'app/components/common/confirmAlert';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

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
        chapterName: "Chapter1",
        topicId: 1,
        topicCode: "topicCode1",
        topicName: "topicName1",
        topicIcon: "https://i.picsum.photos/id/255/200/200.jpg?hmac=IYQV36UT5-F1dbK_CQXF7PDfLfwcnwKijqeBCo3yMlc",
        isActive: true
      },
      {
        chapterName: "Chapter2",
        topicId: 2,
        topicCode: "topicCode2",
        topicName: "topicName2",
        topicIcon: "https://i.picsum.photos/id/488/200/200.jpg?hmac=V8mvdG1ON09kNw80-qS00BSFq5gGhqRYoYPJftrsYA8",
        isActive: false
      },
    ],
    alert: null,
    selectedTopic: null,
    openDialog: false,
    openTopicDialog: false
  };

  COLUMNS = [
    { name: "#", ...NO_FILTER_WITH_SORTING },
    { name: "Chapter Name", ...FILTER_WITH_SORTING },
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
          let topic = _.find(this.state.list, { topicId: id });
          return (
            <>
              <Tooltip title={topic.isActive ? "Click to Deactivate" : "Click to Activate"}><Switch
                checked={topic.isActive}
                onChange={() => this.updateStatus(id, !topic.isActive)}
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
          let topic = _.find(this.state.list, { topicId: id });
          return (
            <>
              <Tooltip title="Edit Topic"><IconButton style={{ color: "green" }} onClick={() => {
                this.setState({ selectedTopic: topic, openDialog: true })
              }}>
                <EditIcon />
              </IconButton></Tooltip>
              <Tooltip title="Delete Topic"><IconButton style={{ color: "red" }} onClick={() => this.setState({ selectedTopic: topic, alert: true })} >
                <DeleteIcon />
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
    this.props.onTopicClientUpdate(e.target.value);
  }

  fetchData = () => {
    let { fetching } = this.state;
    if (!fetching) {
      this.setState({ fetching: true });
      api.sessionAuth
        .get(API_TOPIC).then(({ data }) => {
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
        .put(API_TOPIC, { topicId: id, isActive: isActive }).then(({ data }) => {
          let message = "Topic deactivated successfully";
          if (isActive) {
            message = "Topic activated successfully";
          }
          let stateObj = { ...this.state };
          let list = stateObj.list.map((topic) => {
            if (topic.topicId === id) {
              topic.isActive = isActive;
            }
            return topic;
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
    let { fetching, selectedTopic } = this.state;
    if (!fetching) {
      this.setState({ fetching: true, alert: false });
      api.sessionAuth
        .put(API_TOPIC, { topicId: selectedTopic.topicId }).then(({ data }) => {
          this.fetchData();
          let message = "Topic deleted successfully";
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
      data.chapterName,
      data.topicIcon,
      data.topicCode,
      data.topicName,
      data.topicId,
      data.topicId
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
                <Typography variant="h5" key="topic_list">
                  Topic Management
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
              topicId={this.props.topicId}
              open={this.state.openDialog}
              title={'Update Topic'}
              buttonTxt={'Update'}
              data={this.state.selectedTopic}
              onSuccess={() => this.fetchData()}
              onClose={() => { this.setState({ openDialog: false }) }}
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