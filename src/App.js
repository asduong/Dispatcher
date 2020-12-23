import 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import './App.css';

import { Button } from '@material-ui/core';
import { clone, countBy, each, filter, flatMap, map, remove } from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { CSVLink } from 'react-csv';

import AlertDialog from './components/AlertDialog';
import StyledFilter from './components/StyledFilter';
import StyledModal from './components/StyledModal';
import StyledSelect from './components/StyledSelect';
import TaskForm from './components/TaskForm';
import hasOverlap from './utils/overlap';

const localizer = momentLocalizer(moment);

function idGen(init) {
  return function () {
    return init++;
  };
}

const nextId = idGen(0);

const drivers = [
  { value: 'Driver 1', label: 'Driver 1' },
  { value: 'Driver 2', label: 'Driver 2' },
  { value: 'Driver 3', label: 'Driver 3' },
];
const driverFilter = [{ value: '', label: 'All Drivers' }, ...drivers];
const dateDivisions = [
  { value: 2, label: '2 Days' },
  { value: 4, label: '4 Days' },
  { value: 7, label: '7 Days' },
  { value: 14, label: '14 Days' },
  { value: 28, label: '28 Days' },
];

const headers = [
  { label: 'Time-Frame', key: 'key' },
  { label: 'Pickup', key: 'Pickup' },
  { label: 'Drop-off', key: 'Drop-off' },
  { label: 'Other', key: 'Other' },
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredDriverId: '',
      downloadDriverId: '',
      dateDivision: '',
      events: [],
      isTaskModalOpen: false,
      isDownloadModalOpen: false,
      isEdit: false,
      isAlertDialogOpen: false,
      overlapRanges: [],
      hasError: false,
    };
  }

  toggleDownloadModal = (event) => {
    this.setState({
      isDownloadModalOpen: !this.state.isDownloadModalOpen,
    });
  };

  toggleTaskModal = (event) => {
    this.setState({
      isEdit: !!event.driverId,
      currentEvent: {
        ...event,
        driverId: this.state.filteredDriverId || event.driverId,
      },
      isTaskModalOpen: !this.state.isTaskModalOpen,
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
    this.setState({
      filteredDriverId: value,
      driverId: value,
      downloadDriverId: value,
    });
  };

  handleDownloadDriverChange = (e) => {
    const value = e.target.value;
    this.setState({ downloadDriverId: value });
  };

  handleDateDivisionChange = (e) => {
    const value = e.target.value;
    this.setState({ dateDivision: value });
  };

  handleDelete = () => {
    const { events, currentEvent, isEdit, isTaskModalOpen } = this.state;

    const clondedEvents = clone(events);

    if (isEdit) {
      remove(clondedEvents, {
        id: currentEvent.id,
      });
    }

    this.setState({
      isTaskModalOpen: !isTaskModalOpen,
      currentEvent: null,
      events: clondedEvents,
    });
  };

  handleSubmit = () => {
    const { events, currentEvent, isEdit, isTaskModalOpen } = this.state;
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
      isTaskModalOpen: !isTaskModalOpen,
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
      isTaskModalOpen: !this.state.isTaskModalOpen,
      events: updatedEvents,
    });
  };

  render() {
    const {
      isTaskModalOpen,
      isDownloadModalOpen,
      events,
      isEdit,
      filteredDriverId,
      downloadDriverId,
      dateDivision,
      currentEvent,
      isAlertDialogOpen,
      hasError,
    } = this.state;

    let filteredEvents = events;
    if (filteredDriverId) {
      filteredEvents = filter(events, { driverId: filteredDriverId });
    }

    let downloadData = [];
    if (dateDivision && downloadDriverId) {
      const filteredData = filter(events, { driverId: downloadDriverId });
      let groupEvents = {};
      each(filteredData, (e) => {
        // group key
        // example:
        // number of days (2020-12-20).timestamp - (2020-01-01).timestamp
        // number of days difference / dateDivision in seconds
        // to get group key
        // 0 or 1 / 2 = 0
        // 2 or 3 / 2 = 1
        // 4 or 5 / 2 = 2
        let group = Math.floor(
          (moment(e.start).startOf('day').unix() -
            moment().startOf('year').unix()) /
            (24 * 3600 * dateDivision)
        );

        groupEvents[group] = groupEvents[group] || [];
        groupEvents[group].push(e);
      });

      // Grouped by tasks
      downloadData = map(groupEvents, (events, k) => {
        let groupedCount = countBy(events, 'task');
        const group = parseInt(k, 10);

        return {
          key: `Day ${group * dateDivision + 1} - Day ${
            group * dateDivision + dateDivision
          }`,
          ...groupedCount,
        };
      });
    }

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
        <StyledFilter
          label={'Filter Drivers: '}
          value={filteredDriverId}
          options={driverFilter}
          handleChange={this.handleDriverFilter}
        />
        <Button onClick={this.toggleDownloadModal} color="primary">
          Download Schedule
        </Button>
        <StyledModal
          open={isDownloadModalOpen}
          onClose={this.toggleDownloadModal}
        >
          <StyledSelect
            label={'Select driver: '}
            value={downloadDriverId}
            options={drivers}
            handleChange={this.handleDownloadDriverChange}
          />
          <StyledSelect
            label={'Select date division: '}
            value={dateDivision}
            options={dateDivisions}
            handleChange={this.handleDateDivisionChange}
          />
          <CSVLink
            className="csv-export"
            filename={`task-export-${downloadDriverId || 'all'}.csv`}
            data={downloadData}
            headers={headers}
          >
            Download
          </CSVLink>
        </StyledModal>
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="week"
          events={filteredEvents}
          selectable={true}
          onSelectSlot={this.toggleTaskModal}
          onSelectEvent={this.toggleTaskModal}
          views={['week']}
          step={60}
          timeslots={1}
          style={{ height: '100vh' }}
        />
        <StyledModal open={isTaskModalOpen} onClose={this.toggleTaskModal}>
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
