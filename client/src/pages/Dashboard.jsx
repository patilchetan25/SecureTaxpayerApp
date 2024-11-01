import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import toast from 'react-hot-toast';
import { AppBar, Toolbar, Typography, IconButton, Avatar, Container, Box,  Tooltip} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import Dataactions from './Dataactions';

export default function Dashboard() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('user');
    toast.success('Logout Successful');
    navigate('/login');
  };

  const [data, setData] = useState([
    { id: 1, name: 'John Doe', ssn: '1231413', phone: '123456', email: 'JohnDoe@gmail.com', gender: 'Male' },
    { id: 2, name: 'Jane Smith', ssn: '41353', phone: '123456', email: 'JaneSmith@gmail.com', gender: 'Female' },
    { id: 3, name: 'Jim Brown', ssn: '21423423', phone: '123456', email: 'JimBrown@gmail.com', gender: 'Male' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '' });
  const [editingIndex, setEditingIndex] = useState(null);

  const columns = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <IconButton onClick={() => openModal(params.id)}>
        <EditIcon sx={{ color: '#005074' }} />
      </IconButton>
      ),
      sortable: false,
      align: 'center',
      headerAlign: 'center',
    },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'ssn', headerName: 'SSN', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'gender', headerName: 'Gender', flex: 1 },
  ];

  const openModal = (id = null) => {
    const record = data.find((item) => item.id === id) || { name: '', role: '' };
    setFormData(record);
    setEditingIndex(id);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (editingIndex !== null) {
      const updatedData = data.map((item) =>
        item.id === editingIndex ? { ...item, ...formData } : item
      );
      setData(updatedData);
      toast.success('Record updated');
    } else {
      const newRecord = { id: data.length + 1, ...formData };
      setData([...data, newRecord]);
      toast.success('New record created');
    }
    closeModal();
  };

  return (
    <div style={{ height: '95vh', display: 'flex', flexDirection: 'column' }}>
      {/* Barra Superior */}
      <AppBar position="static" sx={{ bgcolor: '#005074' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TaxPayer 
          </Typography>
          <Tooltip title="Log out" >
          <IconButton color="inherit" onClick={handleLogout} >
            <LogoutIcon />
          </IconButton>
          </Tooltip>
          <Avatar sx={{ bgcolor: 'white', color: '#005074', ml: 2 }}>
            {user?.name ? user.name[0] : "U"}
            </Avatar>

        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ flex: 1, mt: 4, display: 'flex', flexDirection: 'column' }}>
        {/* Tabla */}
        <Box sx={{ flex: 1 }}>
          <DataGrid rows={data} columns={columns} pageSize={5} rowsPerPageOptions={[5]} autoHeight={false} />
        </Box>
      </Container>

      {/* Modal para Crear/Editar */}
      <Dataactions
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        formData={formData}
        handleInputChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
        editing={editingIndex !== null}
      />
    </div>
  );
}
