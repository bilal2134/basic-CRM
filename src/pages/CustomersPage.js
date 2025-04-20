import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import {
  Box, Paper, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, Stack, AppBar, Toolbar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import TablePagination from '@mui/material/TablePagination';

function CustomersPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phoneNumber: '' });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [dialog, setDialog] = useState({ open: false, type: null }); // type: 'add' | 'edit' | 'delete'
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchCustomers();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line
  }, [page, rowsPerPage, search]);

  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/customer', {
        params: {
          page: page + 1,
          pageSize: rowsPerPage,
          search: search || undefined
        }
      });
      setCustomers(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      setError('Failed to fetch customers');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openDialog = (type, customer = null) => {
    setDialog({ open: true, type });
    if (type === 'edit' && customer) {
      setSelectedCustomer(customer);
      setForm({ name: customer.name, email: customer.email, phoneNumber: customer.phoneNumber });
    } else if (type === 'delete' && customer) {
      setSelectedCustomer(customer);
    } else if (type === 'add') {
      setForm({ name: '', email: '', phoneNumber: '' });
      setSelectedCustomer(null);
    }
  };

  const closeDialog = () => {
    setDialog({ open: false, type: null });
    setForm({ name: '', email: '', phoneNumber: '' });
    setSelectedCustomer(null);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/api/customer', form);
      enqueueSnackbar('Customer added successfully!', { variant: 'success' });
      closeDialog();
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data || 'Add failed');
      enqueueSnackbar('Failed to add customer', { variant: 'error' });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const updateDto = {};
      if (form.name !== '') updateDto.name = form.name;
      if (form.email !== '') updateDto.email = form.email;
      if (form.phoneNumber !== '') updateDto.phoneNumber = form.phoneNumber;
      await axios.put(`/api/customer/${selectedCustomer.id}`, updateDto);
      enqueueSnackbar('Customer updated successfully!', { variant: 'success' });
      closeDialog();
      fetchCustomers();
    } catch (err) {
      setError(err.response?.data || 'Update failed');
      enqueueSnackbar('Failed to update customer', { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    setError('');
    try {
      await axios.delete(`/api/customer/${selectedCustomer.id}`);
      enqueueSnackbar('Customer deleted successfully!', { variant: 'success' });
      closeDialog();
      fetchCustomers();
    } catch (err) {
      setError('Delete failed');
      enqueueSnackbar('Failed to delete customer', { variant: 'error' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fbff 0%, #e3f0ff 100%)', p: 0 }}>
      <AppBar position="static" color="primary" elevation={6} sx={{ borderRadius: 0, mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            CRM Customers
          </Typography>
          <Button color="inherit" onClick={handleLogout} sx={{ fontWeight: 600, borderRadius: 2 }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={6} sx={{ p: 4, mb: 4, width: '100%', maxWidth: 900, borderRadius: 4 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Customers
          </Typography>
          <TextField
            placeholder="Search by name, email, or phone"
            value={search}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            sx={{ mb: 2, width: 300 }}
          />
          <Button onClick={() => openDialog('add')} variant="contained" color="primary" sx={{ mb: 2, ml: 2, borderRadius: 3, boxShadow: 3 }}>
            Add Customer
          </Button>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {loading ? (
            <Typography>Loading...</Typography>
          ) : (
            <>
              <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Avatar</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {customers.map((c) => (
                      <TableRow key={c.id} hover sx={{ transition: '0.2s', boxShadow: 2 }}>
                        <TableCell>
                          <Avatar sx={{ bgcolor: '#1976d2', color: '#fff' }}>{c.name ? c.name.charAt(0).toUpperCase() : '?'}</Avatar>
                        </TableCell>
                        <TableCell>{c.name}</TableCell>
                        <TableCell>{c.email}</TableCell>
                        <TableCell>{c.phoneNumber}</TableCell>
                        <TableCell>
                          <Button onClick={() => openDialog('edit', c)} variant="outlined" color="primary" size="small" sx={{ mr: 1, borderRadius: 2 }}>
                            Edit
                          </Button>
                          <Button onClick={() => openDialog('delete', c)} variant="outlined" color="error" size="small" sx={{ borderRadius: 2 }}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </>
          )}
        </Paper>
      </Box>
      {/* Add Dialog */}
      <Dialog open={dialog.open && dialog.type === 'add'} onClose={closeDialog}>
        <DialogTitle>Add Customer</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleAdd} sx={{ mt: 1 }}>
            <Stack spacing={2}>
              <TextField name="name" label="Name" value={form.name} onChange={handleChange} required fullWidth />
              <TextField name="email" label="Email" value={form.email} onChange={handleChange} required fullWidth />
              <TextField name="phoneNumber" label="Phone Number" value={form.phoneNumber} onChange={handleChange} required fullWidth />
              <DialogActions>
                <Button onClick={closeDialog} color="secondary">Cancel</Button>
                <Button type="submit" variant="contained" color="primary">Add</Button>
              </DialogActions>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
      {/* Edit Dialog */}
      <Dialog open={dialog.open && dialog.type === 'edit'} onClose={closeDialog}>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleUpdate} sx={{ mt: 1 }}>
            <Stack spacing={2}>
              <TextField name="name" label="Name" value={form.name} onChange={handleChange} required fullWidth />
              <TextField name="email" label="Email" value={form.email} onChange={handleChange} required fullWidth />
              <TextField name="phoneNumber" label="Phone Number" value={form.phoneNumber} onChange={handleChange} required fullWidth />
              <DialogActions>
                <Button onClick={closeDialog} color="secondary">Cancel</Button>
                <Button type="submit" variant="contained" color="primary">Update</Button>
              </DialogActions>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={dialog.open && dialog.type === 'delete'} onClose={closeDialog}>
        <DialogTitle>Delete Customer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedCustomer ? `Are you sure you want to delete ${selectedCustomer.name}?` : 'Loading...'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="secondary">Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CustomersPage;