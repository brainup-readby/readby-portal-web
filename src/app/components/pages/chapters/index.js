import React from "react";
import { withRouter } from "react-router-dom";
import { LinearProgress, Typography, Switch, IconButton, Tooltip } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import api from "app/api";
import { UserContext } from "app/contexts";
import { API_CHAPTER } from "app/api/endpoints";
import { withSnackbar } from "notistack"
import AddDialog from "app/components/pages/chapters/AddDialog";
import AddTopicDialog from "app/components/pages/topics/AddDialog";
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
        subjectName: "Subject1",
        chapterId: 1,
        chapterCode: "chapterCode1",
        chapterName: "chapterName1",
        chapterIcon: "https://i.picsum.photos/id/283/200/200.jpg?hmac=Qyx_FaWqQPrmQrGhQNKh2t2FUuwTiMNTS1VCkc86YrM",
        isActive: true
      },
      {
        subjectName: "Subject2",
        chapterId: 2,
        chapterCode: "chapterCode2",
        chapterName: "chapterName2",
        chapterIcon: "https://i.picsum.photos/id/104/200/200.jpg?hmac=3XxEVXVjwoI45-6sum_iMwNZ52GT-SJacVWr4fh4hqI",
        isActive: false
      },
    ],
    alert: null,
    selectedChapter: null,
    openDialog: false,
    openTopicDialog: false
  };

  COLUMNS = [
    { name: "#", ...NO_FILTER_WITH_SORTING },
    { name: "Subject Name", ...FILTER_WITH_SORTING },
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
          let chapter = _.find(this.state.list, { chapterId: id });
          return (
            <>
              <Tooltip title={chapter.isActive ? "Click to Deactivate" : "Click to Activate"}><Switch
                checked={chapter.isActive}
                onChange={() => this.updateStatus(id, !chapter.isActive)}
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
          let chapter = _.find(this.state.list, { chapterId: id });
          return (
            <>
              <Tooltip title="Edit Chapter"><IconButton style={{ color: "green" }} onClick={() => {
                this.setState({ selectedChapter: chapter, openDialog: true })
              }}>
                <EditIcon />
              </IconButton></Tooltip>
              <Tooltip title="Delete Chapter"><IconButton style={{ color: "red" }} onClick={() => this.setState({ selectedChapter: chapter, alert: true })} >
                <DeleteIcon />
              </IconButton></Tooltip>
              <Tooltip title="Add Topic"><IconButton style={{ color: "green" }} onClick={() => {
                this.setState({ selectedChapter: chapter, openTopicDialog: true })
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
    this.props.onChapterClientUpdate(e.target.value);
  }

  fetchData = () => {
    let { fetching } = this.state;
    if (!fetching) {
      this.setState({ fetching: true });
      api.sessionAuth
        .get(API_CHAPTER).then(({ data }) => {
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
        .put(API_CHAPTER, { chapterId: id, isActive: isActive }).then(({ data }) => {
          let message = "Chapter deactivated successfully";
          if (isActive) {
            message = "Chapter activated successfully";
          }
          let stateObj = { ...this.state };
          let list = stateObj.list.map((chapter) => {
            if (chapter.chapterId === id) {
              chapter.isActive = isActive;
            }
            return chapter;
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
    let { fetching, selectedChapter } = this.state;
    if (!fetching) {
      this.setState({ fetching: true, alert: false });
      api.sessionAuth
        .put(API_CHAPTER, { chapterId: selectedChapter.chapterId }).then(({ data }) => {
          this.fetchData();
          let message = "Chapter deleted successfully";
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
      data.subjectName,
      data.chapterIcon,
      data.chapterCode,
      data.chapterName,
      data.chapterId,
      data.chapterId
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
                <Typography variant="h5" key="chapter_list">
                  Chapter Management
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
              chapterId={this.props.chapterId}
              open={this.state.openDialog}
              title={'Update Chapter'}
              buttonTxt={'Update'}
              data={this.state.selectedChapter}
              onSuccess={() => this.fetchData()}
              onClose={() => { this.setState({ openDialog: false }) }}
            />
            <AddTopicDialog
              open={this.state.openTopicDialog}
              title={'Add Topic'}
              buttonTxt={'Add'}
              parentId={_.get(this.state.selectedChapter, 'chapterId', '')}
              onClose={() => { this.setState({ openTopicDialog: false }) }}
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