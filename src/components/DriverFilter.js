import { makeStyles } from '@material-ui/core';
import React from 'react';

import StyledSelect from './StyledSelect';

const useStyles = makeStyles((theme) => ({
  filterLabel: {
    display: 'inline-block',
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(4),
    marginLeft: theme.spacing(2),
    textAlign: 'bottom',
  },
}));

const DriverFilter = (props) => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.filterLabel}>
        <label>Filter Drivers: </label>
      </div>
      <StyledSelect {...props} />
    </>
  );
};

export default DriverFilter;
