import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import React from 'react';

const AlertDialog = ({ open, handleClose, handleOK, title, content }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{handleOK ? 'Cancel' : 'OK'}</Button>
        {handleOK && (
          <Button onClick={handleOK} color="primary" autoFocus>
            OK
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
