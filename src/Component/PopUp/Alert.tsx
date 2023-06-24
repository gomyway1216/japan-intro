import React, { useState, forwardRef, useEffect, SyntheticEvent } from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import MuiAlert, { AlertProps as MuiAlertProps } from '@mui/material/Alert';
import { InstantMessageProps } from '../../types';

const ALERT_DURATION = 5000;

const Alert = forwardRef<HTMLDivElement, MuiAlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const InstantMessage: React.FC<InstantMessageProps> = ({ message, onClose }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, [message]);

  const handleCloseForSnackbar = (event: SyntheticEvent<any, Event> | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
    setOpen(false);
  };

  const handleCloseForAlert = () => {
    onClose();
    setOpen(false);
  };

  return (
    <Snackbar open={open} autoHideDuration={ALERT_DURATION} onClose={handleCloseForSnackbar}>
      <Alert onClose={handleCloseForAlert} severity="error">{message}</Alert>
    </Snackbar>
  );
};

export default InstantMessage;
