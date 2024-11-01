// Dataactions.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

export default function Dataactions({ isOpen, onClose, onSave, formData, handleInputChange, editing }) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{editing ? 'Edit data' : 'Create data'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          value={formData.name}
          onChange={(e) => handleInputChange({ ...formData, name: e.target.value })}
        />
        <TextField
          margin="dense"
          label="SSN"
          type="text"
          fullWidth
          value={formData.ssn}
          onChange={(e) => handleInputChange({ ...formData, role: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Phone"
          type="text"
          fullWidth
          value={formData.phone}
          onChange={(e) => handleInputChange({ ...formData, role: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Email"
          type="text"
          fullWidth
          value={formData.email}
          onChange={(e) => handleInputChange({ ...formData, role: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Gender"
          type="text"
          fullWidth
          value={formData.gender}
          onChange={(e) => handleInputChange({ ...formData, role: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
      <Button onClick={onClose} sx={{ color: '#005074' }}>
        Cancel
        </Button>
        <Button onClick={onSave} 
        variant="contained" 
        sx={{ bgcolor: '#005074', color: 'white', '&:hover': { bgcolor: '#004064' } }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
