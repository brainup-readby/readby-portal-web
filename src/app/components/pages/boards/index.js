import React from "react";
import { withRouter } from "react-router-dom";
import { LinearProgress, Typography, Switch, IconButton, Tooltip } from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import api from "app/api";
import { UserContext } from "app/contexts";
import { API_TOPIC } from "app/api/endpoints";
import { withSnackbar } from "notistack"
import AddDialog from "app/components/pages/boards/AddDialog";
import _ from "lodash";
import { ClrdButton } from "app/components/common/formFields";
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
        boardId: 1,
        boardCode: "boardCode1",
        boardName: "boardName1",
        isActive: true
      },
      {
        boardId: 2,
        boardCode: "boardCode2",
        boardName: "boardName2",
        isActive: false
      },
    ],
    alert: null,
    selectedBoard: null,
    openDialog: false,
  };

  COLUMNS = [
    { name: "#", ...NO_FILTER_WITH_SORTING },
    { name: "Code", ...NO_FILTER_WITH_SORTING },
    { name: "Name", ...NO_FILTER_WITH_SORTING },
    {
      name: "Status",
      options: {
        sort: false,
        filter: false,
        customBodyRender: (id) => {
          let board = _.find(this.state.list, { boardId: id });
          return (
            <>
              <Tooltip title={board.isActive ? "Click to Deactivate" : "Click to Activate"}><Switch
                checked={board.isActive}
                onChange={() => this.updateStatus(id, !board.isActive)}
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
          let board = _.find(this.state.list, { boardId: id });
          return (
            <>
              <Tooltip title="Edit Board"><IconButton style={{ color: "green" }} onClick={() => {
                this.setState({ selectedBoard: board, openDialog: true })
              }}>
                <EditIcon />
              </IconButton></Tooltip>
              <Tooltip title="Delete Board"><IconButton style={{ color: "red" }} onClick={() => this.setState({ selectedBoard: board, alert: true })} >
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
    this.props.onBoardClientUpdate(e.target.value);
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
        .put(API_TOPIC, { boardId: id, isActive: isActive }).then(({ data }) => {
          let message = "Board deactivated successfully";
          if (isActive) {
            message = "Board activated successfully";
          }
          let stateObj = { ...this.state };
          let list = stateObj.list.map((board) => {
            if (board.boardId === id) {
              board.isActive = isActive;
            }
            return board;
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
    let { fetching, selectedBoard } = this.state;
    if (!fetching) {
      this.setState({ fetching: true, alert: false });
      api.sessionAuth
        .put(API_TOPIC, { boardId: selectedBoard.boardId }).then(({ data }) => {
          this.fetchData();
          let message = "Board deleted successfully";
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
      data.boardCode,
      data.boardName,
      data.boardId,
      data.boardId
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
                <Typography variant="h5" key="board_list">
                  Board Management
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
                          this.setState({ selectedBoard: null, openDialog: true })
                        }}>
                        Add Board
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
            <AddDialog
              boardId={this.props.boardId}
              open={this.state.openDialog}
              title={this.state.selectedBoard ? 'Update Board' : 'Add Board'}
              buttonTxt={this.state.selectedBoard ? 'Update' : 'Add'}
              data={this.state.selectedBoard}
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