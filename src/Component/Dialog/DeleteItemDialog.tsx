import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DeleteItemDialogProps } from '../../types';

const DeleteItemDialog: React.FC<DeleteItemDialogProps> = (props) => {
  const { open: openProp, onClose, callback, errorMessage } = props;
  const [open, setOpen] = useState(openProp);

  useEffect(() => {
    setOpen(openProp);
  }, [openProp]);

  return (
    <div>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>Deleting Item</DialogTitle>
        <DialogContent>
          {errorMessage ? errorMessage : 'Is that really ok?'}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button onClick={callback}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteItemDialog;
