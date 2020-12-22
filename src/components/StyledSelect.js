import { InputLabel, MenuItem, Select } from '@material-ui/core';
import { map } from 'lodash';
import React from 'react';

import StyledFormControl from './StyledFormControl';

const StyledSelect = ({ label, options, handleChange, value }) => {
  return (
    <StyledFormControl required>
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={handleChange}>
        {map(options, ({ value, label }) => (
          <MenuItem value={value}>{label}</MenuItem>
        ))}
      </Select>
    </StyledFormControl>
  );
};

export default StyledSelect;
