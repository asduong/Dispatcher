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
  handleDriverChange,
  handleChange,
  handleEdit,
  isEdit,
}) => {
  const classes = useStyles();
  return (
    <form>
      <DriverSelect
        classes={classes}
        disabled={!!filteredDriverId}
        drivers={drivers}
        value={driverId}
      />
      <TaskSelect value={task} classes={classes} />
      <FormControl className={classes.formControl}>
        <InputLabel>Description</InputLabel>
        <Input value={""}></Input>
      </FormControl>
      <FormControl className={classes.formControl} required>
        <InputLabel>Location</InputLabel>
        <Input value={""}></Input>
      </FormControl>
      <Button color="primary" type="submit" onClick={handleEdit}>
        {isEdit ? "Edit" : "Add"}
      </Button>
    </form>
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
      isModalOpen: !this.state.isModalOpen,
    });
  };

  handleChange = (e) => {
    this.setState({ task: e.target.value });
  };

  handleDriverChange = (e) => {
    this.setState({ driverId: e.target.value });
  };

  handleDriverFilter = (e) => {
    const value = e.target.value;
    this.setState({ filteredDriverId: value, driverId: value });
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

    if (!(driverId && task)) {
      alert("fill out the data");
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
    const {
      isModalOpen,
      events,
      task,
      driverId,
      isEdit,
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

    return (
      <div className="App">
        <DriverFilter
          drivers={driverFilter}
          handleChange={this.handleDriverFilter}
        />
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
            handleEdit={this.handleEdit}
          />
        </StyledModal>
      </div>
    );
  }
}

export default App;
