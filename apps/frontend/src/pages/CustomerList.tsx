import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { customerApi } from '../services/api';
import type { Customer } from '../types';
import CustomerFormModal from '../components/CustomerFormModal';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';

export default function CustomerList() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);
  const [search, setSearch] = useState('');
  const [searchDebounce, setSearchDebounce] = useState('');

  // Modal states
  const [openForm, setOpenForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch customers
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await customerApi.getAll({
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search: searchDebounce || undefined,
      });
      setCustomers(response.data);
      setRowCount(response.meta.total);
    } catch (error) {
      toast.error('Failed to fetch customers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [paginationModel, searchDebounce]);

  const handleCreate = () => {
    setEditingCustomer(null);
    setOpenForm(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setOpenForm(true);
  };

  const handleView = (id: string) => {
    navigate(`/customers/${id}`);
  };

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!customerToDelete) return;

    try {
      await customerApi.delete(customerToDelete.id);
      toast.success('Customer deleted successfully');
      fetchCustomers();
    } catch (error) {
      toast.error('Failed to delete customer');
      console.error(error);
    } finally {
      setDeleteDialogOpen(false);
      setCustomerToDelete(null);
    }
  };

  const handleFormClose = (refresh?: boolean) => {
    setOpenForm(false);
    setEditingCustomer(null);
    if (refresh) {
      fetchCustomers();
    }
  };

  const columns: GridColDef[] = [
    { field: 'firstName', headerName: 'First Name', flex: 1, minWidth: 120 },
    { field: 'lastName', headerName: 'Last Name', flex: 1, minWidth: 120 },
    { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 200 },
    { field: 'phoneNumber', headerName: 'Phone', flex: 1, minWidth: 130 },
    {
      field: 'country',
      headerName: 'Country',
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => params.row.country?.name || '-',
    },
    {
      field: 'state',
      headerName: 'State',
      flex: 1,
      minWidth: 120,
      valueGetter: (params) => params.row.state?.name || '-',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<ViewIcon />}
          label="View"
          onClick={() => handleView(params.row.id)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteClick(params.row)}
        />,
      ],
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Customers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Add Customer
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search customers"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 300 }}
        />
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={customers}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 25, 50]}
          paginationModel={paginationModel}
          paginationMode="server"
          onPaginationModelChange={setPaginationModel}
          rowCount={rowCount}
          disableRowSelectionOnClick
        />
      </Box>

      <CustomerFormModal
        open={openForm}
        customer={editingCustomer}
        onClose={handleFormClose}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        title="Delete Customer"
        message={`Are you sure you want to delete ${customerToDelete?.firstName} ${customerToDelete?.lastName}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setCustomerToDelete(null);
        }}
      />
    </Box>
  );
}
