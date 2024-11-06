import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Button, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export default function DocumentActions({ isOpen, onClose, documents, onDownload }) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          width: '200', // Set the width relative to the viewport
          maxHeight: '90vh', // Custom maximum height
        },
      }}
      >
      <DialogTitle>Uploaded Files</DialogTitle>
      <DialogContent>
      <List>
          {documents && documents.length > 0 ? (
            documents.map((doc, index) => (
              <ListItem key={index} secondaryAction={
                <IconButton edge="end" aria-label="download" onClick={() => onDownload(doc)}>
                    <DownloadIcon /> 
                </IconButton>
              }>
                <ListItemText
                  primary={doc.originalname}
                  secondary={new Date(doc.createdAt).toLocaleString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No documents available" />
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose} 
          sx={{ color: '#005074', '&:hover': { backgroundColor: '#f0f4f8' } }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
