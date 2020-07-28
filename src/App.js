import React, { Component } from "react";
import moment from "moment";
import {
  Button,
  Select,
  MenuItem,
  makeStyles,
  InputLabel,
} from "@material-ui/core";
import { Calendar, momentLocalizer } from "react-big-calendar";

import { remove, clone } from "lodash";

import StyledModal from "./components/StyledModal";

import "./App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function idGen(init) {
  return function () {
    return init++;
  };
}

const nextId = idGen(0);

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    minWidth: "100%",
  },
}));

const TaskSelect = ({ handleChange, value }) => {
  const classes = useStyles();
  return (
    <>
      <InputLabel>Task</InputLabel>
      <Select
        className={classes.formControl}
        value={value}
        onChange={handleChange}
      >
        <MenuItem value="Pick Up">Pick Up</MenuItem>
        <MenuItem value="Drop Off">Drop Off</MenuItem>
        <MenuItem value="Other">Other</MenuItem>
      </Select>
    </>
  );
};

const DriverSelect = ({ handleChange, value }) => {
  const classes = useStyles();
  return (
    <>
      <InputLabel>Driver</InputLabel>
      <Select
        className={classes.formControl}
        value={value}
        onChange={handleChange}
      >
        <MenuItem value="Driver 1">Driver 1</MenuItem>
        <MenuItem value="Driver 2">Driver 2</MenuItem>
        <MenuItem value="Driver 3">Driver 3</MenuItem>
      </Select>
    </>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      isAddModalOpen: false,
      isEditModalOpen: false,
    };
  }

  toggleAddModal = (event) => {
    if (!this.state.isEditModalOpen) {
      this.setState({
        currentEvent: event,
        isAddModalOpen: !this.state.isAddModalOpen,
      });
    }
  };

  toggleEditModal = (event) => {
    if (!this.state.isAddModalOpen) {
      this.setState({
        currentEvent: event,
        task: event.task,
        driverId: event.driverId,
        isEditModalOpen: !this.state.isEditModalOpen,
      });
    }
  };

  handleChange = (e) => {
    this.setState({ task: e.target.value });
  };

  handleDriverChange = (e) => {
    this.setState({ driverId: e.target.value });
  };

  insertEvent = (events) => ({
    events: [
      ...events,
      {
        id: nextId(),
        start: this.state.currentEvent.start,
        end: this.state.currentEvent.end,
        title: this.state.driverId + " - " + this.state.task,
        task: this.state.task,
        driverId: this.state.driverId,
      },
    ],
  });

  handleAdd = () => {
    this.setState({
      isAddModalOpen: !this.state.isAddModalOpen,
      ...this.insertEvent(this.state.events),
      task: null,
      driverId: null,
    });
  };

  handleEdit = () => {
    const events = clone(this.state.events);
    remove(events, {
      id: this.state.currentEvent.id,
    });

    this.setState({
      isEditModalOpen: !this.state.isEditModalOpen,
      task: null,
      driverId: null,
      ...this.insertEvent(events),
    });
  };

  render() {
    const {
      isEditModalOpen,
      isAddModalOpen,
      currentEvent,
      events,
      task,
      driverId,
    } = this.state;

    // const filteredEvents = filter(events, {driverId: "Driver 2"})

    return (
      <div className="App">
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="week"
          events={events}
          selectable={true}
          onSelectSlot={this.toggleAddModal}
          onSelectEvent={this.toggleEditModal}
          views={["week"]}
          step={60}
          timeslots={1}
          style={{ height: "100vh" }}
        />
        <StyledModal open={isAddModalOpen} onClose={this.toggleAddModal}>
          <DriverSelect handleChange={this.handleDriverChange} />
          <TaskSelect handleChange={this.handleChange} />
          <Button color="primary" onClick={this.handleAdd}>
            Create
          </Button>
        </StyledModal>
        <StyledModal open={isEditModalOpen} onClose={this.toggleEditModal}>
          <DriverSelect
            value={driverId}
            handleChange={this.handleDriverChange}
          />
          <TaskSelect value={task} handleChange={this.handleChange} />
          <Button color="primary" onClick={this.handleEdit}>
            Edit
          </Button>
        </StyledModal>
      </div>
    );
  }
}

export default App;
