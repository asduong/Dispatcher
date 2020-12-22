import 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import './App.css';

import { clone, each, filter, flatMap, remove } from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { CSVLink } from 'react-csv';

import AlertDialog from './components/AlertDialog';
import DriverFilter from './components/DriverFilter';
import StyledModal from './components/StyledModal';
import TaskForm from './components/TaskForm';
import hasOverlap from './utils/overlap';

const localizer = momentLocalizer(moment);

function idGen(init) {
  return function () {
    return init++;
  };
}

const nextId = idGen(0);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredDriverId: null,
      events: [],
      isModalOpen: false,
      isEdit: false,
      isAlertDialogOpen: false,
      overlapRanges: [],
      hasError: false,
    };
  }

  toggleModal = (event) => {
    this.setState({
      isEdit: !!event.driverId,
      currentEvent: {
        ...event,
        driverId: this.state.filteredDriverId || event.driverId,
      },
      isModalOpen: !this.state.isModalOpen,
    });
  };

  closeAlertDialog = () => {
    this.setState({
      isAlertDialogOpen: false,
      hasError: false,
      overlapRanges: [],
    });
  };

  handleEventChange = (field) => (e) => {
    this.setState({
      currentEvent: { ...this.state.currentEvent, [field]: e.target.value },
    });
  };

  handleDateChange = (field) => (date) => {
    this.setState({
      currentEvent: { ...this.state.currentEvent, [field]: date },
    });
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
      currentEvent: null,
      events: clondedEvents,
    });
  };

  handleSubmit = () => {
    const { events, currentEvent, isEdit, isModalOpen } = this.state;
    const { driverId, description, location, task, start, end } = currentEvent;

    if (!(driverId && task && description && location && start && end)) {
      return this.setState({ hasError: true });
    }

    const clondedEvents = clone(events);

    if (isEdit) {
      remove(clondedEvents, {
        id: currentEvent.id,
      });
    }

    const updatedEvents = [
      ...clondedEvents,
      {
        id: nextId(),
        ...currentEvent,
        title: `${driverId} - ${task} - ${description} @ ${location}`,
      },
    ];

    const { overlap, ranges } = hasOverlap(
      filter(updatedEvents, { driverId: currentEvent.driverId })
    );

    if (overlap) {
      const overlapRanges = flatMap(ranges, ({ previous, current }) => [
        previous,
        current,
      ]);

      return this.setState({
        isAlertDialogOpen: true,
        overlapRanges,
      });
    }

    this.setState({
      isModalOpen: !isModalOpen,
      currentEvent: null,
      events: updatedEvents,
    });
  };

  handleOverwrite = () => {
    const { overlapRanges, events, currentEvent } = this.state;
    const { driverId, task, description, location } = currentEvent;
    const clondedEvents = clone(events);
    each(overlapRanges, ({ id }) => {
      remove(clondedEvents, {
        id,
      });
    });

    const updatedEvents = [
      ...clondedEvents,
      {
        id: nextId(),
        ...currentEvent,
        title: `${driverId} - ${task} - ${description} @ ${location}`,
      },
    ];

    this.setState({
      isAlertDialogOpen: !this.state.isAlertDialogOpen,
      isModalOpen: !this.state.isModalOpen,
      events: updatedEvents,
    });
  };

  render() {
    const {
      isModalOpen,
      events,
      isEdit,
      filteredDriverId,
      currentEvent,
      isAlertDialogOpen,
      hasError,
    } = this.state;

    let filteredEvents = events;
    if (filteredDriverId) {
      filteredEvents = filter(events, { driverId: filteredDriverId });
    }

    console.log(filteredEvents);

    const drivers = [
      { value: 'Driver 1', label: 'Driver 1' },
      { value: 'Driver 2', label: 'Driver 2' },
      { value: 'Driver 3', label: 'Driver 3' },
    ];
    const driverFilter = [{ value: '', label: 'All Drivers' }, ...drivers];

    const headers = [
      { label: 'Driver', key: 'driverId' },
      { label: 'Task', key: 'task' },
      { label: 'Description', key: 'description' },
      { label: 'Location', key: 'location' },
    ];

    return (
      <div className="App">
        <AlertDialog
          id="overwrite-dialog"
          open={isAlertDialogOpen}
          title={'Overwrite existing event?'}
          content={'Overwrite existing event?'}
          handleClose={this.closeAlertDialog}
          handleOK={this.handleOverwrite}
        />
        <AlertDialog
          id="error-dialog"
          open={hasError}
          title={'Missing required fields'}
          content={'Please fill out all the fields'}
          handleClose={this.closeAlertDialog}
        />
        <DriverFilter
          drivers={driverFilter}
          handleChange={this.handleDriverFilter}
        />
        <CSVLink
          className="csv-export"
          filename={`task-export-${filteredDriverId || 'all'}.csv`}
          data={filteredEvents}
          headers={headers}
        >
          Download Schedule
        </CSVLink>
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="week"
          events={filteredEvents}
          selectable={true}
          onSelectSlot={this.toggleModal}
          onSelectEvent={this.toggleModal}
          views={['week']}
          step={60}
          timeslots={1}
          style={{ height: '100vh' }}
        />
        <StyledModal open={isModalOpen} onClose={this.toggleModal}>
          <TaskForm
            drivers={drivers}
            filteredDriverId={filteredDriverId}
            currentEvent={currentEvent}
            isEdit={isEdit}
            handleSubmit={this.handleSubmit}
            handleEventChange={this.handleEventChange}
            handleDateChange={this.handleDateChange}
            handleDelete={this.handleDelete}
          />
        </StyledModal>
      </div>
    );
  }
}

export default App;
