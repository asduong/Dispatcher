import DateFnsUtils from '@date-io/date-fns';
import { Button, Input, InputLabel } from '@material-ui/core';
import {
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import React from 'react';

import StyledFormControl from './StyledFormControl';
import StyledSelect from './StyledSelect';

const TaskForm = ({
  drivers,
  filteredDriverId,
  handleSubmit,
  handleEventChange,
  handleDateChange,
  handleDelete,
  isEdit,
  currentEvent,
}) => {
  const { driverId, task, start, end, location, description } = currentEvent;
  const taskOptions = [
    { value: 'Pick up', label: 'Pick up' },
    { value: 'Drop off', label: 'Drop off' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardTimePicker
          margin="normal"
          value={start}
          minutesStep={60}
          onChange={handleDateChange('start')}
        />
        <KeyboardTimePicker
          margin="normal"
          value={end}
          minutesStep={60}
          onChange={handleDateChange('end')}
        />
      </MuiPickersUtilsProvider>
      <StyledSelect
        label="Driver"
        disabled={!!filteredDriverId}
        value={driverId}
        handleChange={handleEventChange('driverId')}
        options={drivers}
      />
      <StyledSelect
        label="Task"
        value={task}
        handleChange={handleEventChange('task')}
        options={taskOptions}
      />
      <StyledFormControl>
        <InputLabel>Description</InputLabel>
        <Input
          value={description}
          onChange={handleEventChange('description')}
        ></Input>
      </StyledFormControl>
      <StyledFormControl>
        <InputLabel>Location</InputLabel>
        <Input
          value={location}
          onChange={handleEventChange('location')}
        ></Input>
      </StyledFormControl>
      <Button color="primary" onClick={handleSubmit}>
        {isEdit ? 'Update' : 'Add'}
      </Button>
      {isEdit && (
        <Button color="secondary" onClick={handleDelete}>
          Delete
        </Button>
      )}
    </>
  );
};

export default TaskForm;
