import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { customerApi } from '../services/api';
import type { Customer } from '../types';

export default function CustomerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await customerApi.getOne(id);
        setCustomer(data);
      } catch (error) {
        toast.error('Failed to fetch customer details');
        console.error(error);
        navigate('/customers');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!customer) {
    return null;
  }

  const InfoRow = ({ label, value, icon }: { label: string; value?: string; icon?: React.ReactNode }) => (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={4} sm={3}>
        <Box display="flex" alignItems="center" gap={1}>
          {icon}
          <Typography variant="body2" color="text.secondary" fontWeight="bold">
            {label}:
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={8} sm={9}>
        <Typography variant="body1">{value || '-'}</Typography>
      </Grid>
    </Grid>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/customers')}
            sx={{ mb: 2 }}
          >
            Back to Customers
          </Button>
          <Typography variant="h4">
            {customer.firstName} {customer.lastName}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate('/customers')}
          >
            Edit
          </Button>
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          <InfoRow label="First Name" value={customer.firstName} />
          <InfoRow label="Last Name" value={customer.lastName} />
          <InfoRow label="Email" value={customer.email} icon={<EmailIcon fontSize="small" />} />
          <InfoRow label="Phone" value={customer.phoneNumber} icon={<PhoneIcon fontSize="small" />} />

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Address Information
          </Typography>
          <InfoRow label="Address" value={customer.address} icon={<LocationIcon fontSize="small" />} />
          <InfoRow label="City" value={customer.city} />
          <InfoRow label="State" value={customer.state?.name} />
          <InfoRow label="Country" value={customer.country?.name} icon={<PublicIcon fontSize="small" />} />

          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Other Information
          </Typography>
          <InfoRow
            label="Date Created"
            value={new Date(customer.dateCreated).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
