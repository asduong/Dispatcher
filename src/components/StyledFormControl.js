import { FormControl, makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
    minWidth: '400px',
  },
}));

const StyledFormControl = (props) => {
  const classes = useStyles();
  return <FormControl {...props} className={classes.formControl} />;
};

export default StyledFormControl;
