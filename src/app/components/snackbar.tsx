'use client'
import * as React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert'; 

interface AutohideProps {
  opened: boolean;
  onClose: () => void;
  notif: string;
  autoHideDuration?: number;
  severity?: 'success' | 'info' | 'warning' | 'error'; 
}

export default function AutohideSnackbar({
  opened,
  onClose,
  notif,
  autoHideDuration = 5000,
  severity = 'success'
}: AutohideProps) {
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  return (
    <Snackbar
      open={opened}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
    >

      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {notif}
      </Alert>
    </Snackbar>
  );
}