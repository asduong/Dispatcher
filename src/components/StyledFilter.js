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

// Similar to styledSelect, just have the label outside of the form control
const StyledFilter = ({ label, ...otherProps }) => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.filterLabel}>
        <label>{label}</label>
      </div>
      <StyledSelect {...otherProps} />
    </>
  );
};

export default StyledFilter;
