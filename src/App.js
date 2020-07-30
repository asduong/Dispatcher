import React, { Component } from "react";
import moment from "moment";
import {
  makeStyles,
  Button,
  Select,
  MenuItem,
  Input,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { CSVLink } from "react-csv";

import { remove, clone, filter, map } from "lodash";

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
    minWidth: "400px",
  },

  filterLabel: {
    display: "inline-block",
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(4),
    marginLeft: theme.spacing(2),
    textAlign: "bottom",
  },
}));

const TaskSelect = ({ handleChange, value, classes }) => {
  return (
    <FormControl required className={classes.formControl}>
      <InputLabel>Task</InputLabel>
      <Select value={value} onChange={handleChange}>
        <MenuItem value="Pick Up">Pick Up</MenuItem>
        <MenuItem value="Drop Off">Drop Off</MenuItem>
        <MenuItem value="Other">Other</MenuItem>
      </Select>
    </FormControl>
  );
};

const DriverFilter = (props) => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.filterLabel}>
        <label>Filter Drivers: </label>
      </div>
      <DriverSelect classes={classes} {...props} />
    </>
  );
};

const DriverSelect = ({ drivers, handleChange, value, disabled, classes }) => {
  return (
    <FormControl disabled={disabled} required className={classes.formControl}>
      <InputLabel>Driver</InputLabel>
      <Select value={value} onChange={handleChange}>
        {map(drivers, ({ value, display }) => (
          <MenuItem value={value}>{display}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const StyledForm = ({
  drivers,
  driverId,
  task,
  filteredDriverId,
  handleSubmit,
  handleTaskChange,
  handleDriverChange,
  handleDescriptionChange,
  handleLocationChange,
  handleDelete,
  isEdit,
  description,
  location,
}) => {
  const classes = useStyles();
  return (
    <>
      <DriverSelect
        classes={classes}
        disabled={!!filteredDriverId}
        drivers={drivers}
        value={driverId}
        handleChange={handleDriverChange}
      />
      <TaskSelect
        value={task}
        classes={classes}
        handleChange={handleTaskChange}
      />
      <FormControl className={classes.formControl} required>
        <InputLabel>Description</InputLabel>
        <Input value={description} onChange={handleDescriptionChange}></Input>
      </FormControl>
      <FormControl className={classes.formControl} required>
        <InputLabel>Location</InputLabel>
        <Input value={location} onChange={handleLocationChange}></Input>
      </FormControl>
      <Button color="primary" onClick={handleSubmit}>
        {isEdit ? "Edit" : "Add"}
      </Button>
      {isEdit && (
        <Button color="secondary" onClick={handleDelete}>
          Delete
        </Button>
      )}
    </>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredDriverId: null,
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
      driverId: this.state.filteredDriverId || event.driverId,
      description: event.description,
      location: event.location,
      isModalOpen: !this.state.isModalOpen,
    });
  };

  handleTaskChange = (e) => {
    this.setState({ task: e.target.value });
  };

  handleDriverChange = (e) => {
    this.setState({ driverId: e.target.value });
  };

  handleDescriptionChange = (e) => {
    this.setState({ description: e.target.value });
  };

  handleLocationChange = (e) => {
    this.setState({ location: e.target.value });
  };

  handleDriverFilter = (e) => {
    const value = e.target.value;
    this.setState({ filteredDriverId: value, driverId: value });
  };

  handleDelete = () => {
    const { events, currentEvent, isEdit, isModalOpen } = this.state;

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
      description: null,
      location: null,
      events: clondedEvents,
    });
  };

  handleSubmit = () => {
    const {
      events,
      currentEvent,
      isEdit,
      isModalOpen,
      driverId,
      description,
      location,
      task,
    } = this.state;

    if (!(driverId && task && description && location)) {
      alert("fill out the fields");
      return;
    }

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
      description: null,
      location: null,
      events: [
        ...clondedEvents,
        {
          id: nextId(),
          start: currentEvent.start,
          end: currentEvent.end,
          title: driverId + " - " + task,
          task,
          description,
          driverId,
          location,
        },
      ],
    });
  };

  render() {
    const {
      isModalOpen,
      events,
      task,
      driverId,
      isEdit,
      description,
      location,
      filteredDriverId,
    } = this.state;

    let filteredEvents = events;
    if (filteredDriverId) {
      filteredEvents = filter(events, { driverId: filteredDriverId });
    }

    const drivers = [
      { value: "Driver 1", display: "Driver 1" },
      { value: "Driver 2", display: "Driver 2" },
      { value: "Driver 3", display: "Driver 3" },
    ];
    const driverFilter = [{ value: "", display: "All Drivers" }, ...drivers];

    const headers = [
      { label: "Driver", key: "driverId" },
      { label: "Task", key: "task" },
      { label: "Description", key: "description" },
      { label: "Location", key: "location" },
    ];

    return (
      <div className="App">
        <DriverFilter
          drivers={driverFilter}
          handleChange={this.handleDriverFilter}
        />
        <CSVLink
          className="csv-export"
          filename={`task-export-${filteredDriverId || "all"}.csv`}
          data={filteredEvents}
          headers={headers}
        >
          Export CSV
        </CSVLink>
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="week"
          events={filteredEvents}
          selectable={true}
          onSelectSlot={this.toggleModal}
          onSelectEvent={this.toggleModal}
          views={["week"]}
          step={60}
          timeslots={1}
          style={{ height: "100vh" }}
        />
        <StyledModal open={isModalOpen} onClose={this.toggleModal}>
          <StyledForm
            drivers={drivers}
            filteredDriverId={filteredDriverId}
            task={task}
            driverId={driverId}
            isEdit={isEdit}
            description={description}
            location={location}
            handleSubmit={this.handleSubmit}
            handleTaskChange={this.handleTaskChange}
            handleDriverChange={this.handleDriverChange}
            handleDescriptionChange={this.handleDescriptionChange}
            handleLocationChange={this.handleLocationChange}
            handleDelete={this.handleDelete}
          />
        </StyledModal>
      </div>
    );
  }
}

export default App;
