import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import PaymentService from '../../../services/payment.service.ts';
import ProductService from '../../../services/product.service.ts';
import useUser from '../../../hooks/useUser.ts';

const CreateCheckoutForm: React.FC<{ activeCompany: string; setModule: any }> = ({ activeCompany, setModule }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { userData } = useUser();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [publicCheckout, setPublicCheckout] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    if (activeCompany) {
      ProductService.get(activeCompany)
        .then((res) => setProducts(res.data))
        .catch(console.error);
    }
  }, [activeCompany]);

  const handleCreate = () => {
    const payload: any = {
      productIds: selectedProducts,
      userId: userData?._id,
      companyId: activeCompany,
    };
    if (!publicCheckout) {
      payload.customerName = customerName;
      payload.customerEmail = customerEmail;
    }
    PaymentService.create(payload)
      .then(() => {
        enqueueSnackbar('Checkout created', { variant: 'success' });
        setModule('');
      })
      .catch(() => enqueueSnackbar('Error creating checkout', { variant: 'error' }));
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <ArrowBackIos style={{ cursor: 'pointer' }} onClick={() => setModule('')} />
        <Typography variant="h5" sx={{ ml: 1 }}>
          {t('leads.createFormTitle')}
        </Typography>
      </Box>
      <TextField
        fullWidth
        label={t('leads.formTitle')}
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label={t('leads.description')}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>{t('products.title')}</InputLabel>
        <Select
          multiple
          value={selectedProducts}
          label={t('products.title')}
          onChange={(e) => setSelectedProducts(e.target.value as string[])}
        >
          {products.map((p) => (
            <MenuItem key={p.id} value={p.id}>
              {p.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControlLabel
        control={<Checkbox checked={publicCheckout} onChange={(e) => setPublicCheckout(e.target.checked)} />}
        label="Public Checkout"
      />
      {!publicCheckout && (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Customer Email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Box>
      )}
      <Button variant="contained" color="primary" onClick={handleCreate}>
        {t('marketing.capturePages.createPageForm')}
      </Button>
    </Box>
  );
};

export default CreateCheckoutForm;
