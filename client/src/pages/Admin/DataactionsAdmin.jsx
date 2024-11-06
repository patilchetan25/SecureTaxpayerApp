import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

export default function Dataactions({ isOpen, onClose, onSave, formData, handleInputChange, editing }) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{editing ? 'Edit Data' : 'Create Data'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="First Name"
          type="text"
          fullWidth
          value={formData.firstName || ''}
          onChange={(e) => handleInputChange({ ...formData, firstName: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Last Name"
          type="text"
          fullWidth
          value={formData.lastName || ''}
          onChange={(e) => handleInputChange({ ...formData, lastName: e.target.value })}
        />
        <TextField
          margin="dense"
          label="SSN"
          type="text"
          fullWidth
          value={formData.ssn || ''}
          onChange={(e) => handleInputChange({ ...formData, ssn: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Phone"
          type="text"
          fullWidth
          value={formData.phoneNumber || ''}
          onChange={(e) => handleInputChange({ ...formData, phoneNumber: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Email"
          type="text"
          fullWidth
          value={formData.email || ''}
          onChange={(e) => handleInputChange({ ...formData, email: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Gender"
          type="text"
          fullWidth
          value={formData.gender || ''}
          onChange={(e) => handleInputChange({ ...formData, gender: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          sx={{ color: '#005074', '&:hover': { backgroundColor: '#f0f4f8' } }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onSave} 
          variant="contained" 
          sx={{ backgroundColor: '#005074', color: 'white', '&:hover': { backgroundColor: '#003f5a' } }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
