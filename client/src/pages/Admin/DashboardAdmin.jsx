import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import toast from 'react-hot-toast';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Container, Box, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import Dataactions from './DataactionsAdmin';
import { getUsers, updateUser, fetchFiles, downloadFile } from '../../Services/adminservice'; 
import DescriptionIcon from '@mui/icons-material/Description';
import DocumentActions from './DocumentactionsAdmin';

export default function DashboardAdmin() {
  const { isAuthenticated, logout , userInfo} = useAuth();
  const navigate = useNavigate();
  const user = userInfo

  const [data, setData] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '' });
  const [editingIndex, setEditingIndex] = useState(null);

  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]); // List of documents for the user

  // Service call to get users when mounting component
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        setData(users); // Update the state with the users obtained
      } catch (error) {
        toast.error('Failed to fetch users');
      }
    };

    fetchUsers();
  }, []);

  const columns = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      renderCell: (params) => (
        <>
        <IconButton color="primary" onClick={() => openModal(params.id)}>
          <EditIcon sx={{ color: '#005074' }} />
        </IconButton>
        <IconButton color="secondary" onClick={() => openDocumentModal(params.id)}>
        <DescriptionIcon sx={{ color: '#6c757d' }} />
        </IconButton>
      </>
      ),
      sortable: false,
      align: 'center',
      headerAlign: 'center',
    },
    { field: 'firstName', headerName: 'Name', flex: 1 },
    { field: 'lastName', headerName: 'Last Name', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'ssn', headerName: 'SSN', flex: 1 },
    { field: 'phoneNumber', headerName: 'Phone', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 250},
  ];

  const openModal = (id = null) => {
    const record = data.find((item) => item._id === id);
    setFormData(record);
    setEditingIndex(id);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSave = async () => {
    if (editingIndex !== null) {
      const updatedUser = await updateUser(editingIndex, formData);
      setData((prevData) =>
        prevData.map((item) => (item._id === editingIndex ? updatedUser : item))
      );
      toast.success('User updated successfully');
    } 
    
    /*else {
      const newRecord = { id: data.length + 1, ...formData };
      setData([...data, newRecord]);
      toast.success('New record created');
    }*/
    closeModal();
  };


  // modal documents
  const openDocumentModal = async (id) => {
    // upload the documents associated with this user
    const userEmail = data.find((item) => item._id === id)?.email;
    if (!userEmail) {
      toast.error('User email not found');
      return;
    }

    // Call the service to get the files
    const documents = await fetchFiles(userEmail);
    setSelectedDocuments(documents);
    setIsDocumentModalOpen(true);
  };
  
  const closeDocumentModal = () => {
    setIsDocumentModalOpen(false);
    setSelectedDocuments([]);
  };

  const onDownload = async (doc) => {
    try {
      await downloadFile(doc.userEmail, doc.filename, doc.originalname);
      toast.success('File downloaded successfully');
    } catch (error) {
      toast.error('Failed to download the file');
    }
  };

  // end modal documents

  return (
    <div style={{ height: '95vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ flex: 1, mt: 4, display: 'flex', flexDirection: 'column' }}>
        {/* Tabla */}
        <Box sx={{ flex: 1, maxHeight: '90%' }}>
          <DataGrid
    rows={data}
    columns={columns}
    pageSize={5}
    rowsPerPageOptions={[5]}
    disableColumnResize={false} 
    sx={{
      minWidth: '1000px',
      width: '100%',
      '& .MuiDataGrid-cell': {
        backgroundColor: 'white', 
        whiteSpace: 'normal', 
        wordWrap: 'break-word', 
        lineHeight: '1.5', 
      },
      '& .MuiDataGrid-columnHeaders': {
        backgroundColor: 'white', 
      },
      '& .MuiDataGrid-footerContainer': {
        backgroundColor: 'white', 
      },
      '& .MuiDataGrid-virtualScroller': {
        backgroundColor: 'white', 
        overflowX: 'auto', 
      },
    }}
    getRowId={(row) => row._id}/>   
    </Box>

      </Container>

      {/* Modal to Create/Edit */}
      <Dataactions
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        formData={formData}
        handleInputChange={(updatedField) =>
          setFormData((prevFormData) => ({
            ...prevFormData,
            ...updatedField,
          }))
        }
        editing={editingIndex !== null}
      />


      {/* Modal to document view  */}
      <DocumentActions
      isOpen={isDocumentModalOpen}
      onClose={closeDocumentModal}
      documents={selectedDocuments}
      onDownload={onDownload}
       
      />
    </div>
  );
}
