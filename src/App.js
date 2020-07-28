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
      isModalOpen: false,
      isEdit: false,
    };
  }

  toggleModal = (event) => {
    this.setState({
      isEdit: !!event.driverId,
      currentEvent: event,
      task: event.task,
      driverId: event.driverId,
      isModalOpen: !this.state.isModalOpen,
    });
  };

  handleChange = (e) => {
    this.setState({ task: e.target.value });
  };

  handleDriverChange = (e) => {
    this.setState({ driverId: e.target.value });
  };

  handleEdit = () => {
    const {
      events,
      currentEvent,
      isEdit,
      isModalOpen,
      driverId,
      task,
    } = this.state;
    const clondedEvents = clone(events);

    if (isEdit) {
      remove(clondedEvents, {
        id: currentEvent.id,
      });
    }

    this.setState({
      isModalOpen: !isModalOpen,
      task: null,
      driverId: null,
      events: [
        ...clondedEvents,
        {
          id: nextId(),
          start: currentEvent.start,
          end: currentEvent.end,
          title: driverId + " - " + task,
          task: task,
          driverId: driverId,
        },
      ],
    });
  };

  render() {
    const { isModalOpen, events, task, driverId, isEdit } = this.state;

    // const filteredEvents = filter(events, {driverId: "Driver 2"})

    return (
      <div className="App">
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="week"
          events={events}
          selectable={true}
          onSelectSlot={this.toggleModal}
          onSelectEvent={this.toggleModal}
          views={["week"]}
          step={60}
          timeslots={1}
          style={{ height: "100vh" }}
        />
        <StyledModal open={isModalOpen} onClose={this.toggleModal}>
          <DriverSelect
            value={driverId}
            handleChange={this.handleDriverChange}
          />
          <TaskSelect value={task} handleChange={this.handleChange} />
          <Button color="primary" onClick={this.handleEdit}>
            {isEdit ? "Edit" : "Add"}
          </Button>
        </StyledModal>
      </div>
    );
  }
}

export default App;
