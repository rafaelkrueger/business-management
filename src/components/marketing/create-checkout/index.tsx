import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Grid,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Divider,
  useTheme
} from '@mui/material';
import {
  ArrowBack,
  AddShoppingCart,
  CheckCircle,
  Cancel,
  ArrowBackIos
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import PaymentService from '../../../services/payment.service.ts';
import ProductService from '../../../services/product.service.ts';
import useUser from '../../../hooks/useUser.ts';

const CreateCheckoutForm: React.FC<{ activeCompany: string; setModule: any }> = ({
  activeCompany,
  setModule
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const { userData } = useUser();
  const theme = useTheme();

  const [products, setProducts] = useState<any[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
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
    const productIds = selectedProducts.map(p => p.id);

    if (productIds.length === 0) {
      enqueueSnackbar(t('checkout.selectProductsError'), { variant: 'error' });
      return;
    }

    const payload: any = {
      productIds,
      userId: 'userData?._id',
      companyId: activeCompany,
      publicCheckout: publicCheckout,
    };

    if (!publicCheckout) {
      if (!customerName || !customerEmail) {
        enqueueSnackbar(t('checkout.customerInfoError'), { variant: 'error' });
        return;
      }
      payload.customerName = customerName;
      payload.customerEmail = customerEmail;
    }

    PaymentService.create(payload)
      .then(() => {
        enqueueSnackbar(t('checkout.createdSuccess'), { variant: 'success' });
        setModule('');
      })
      .catch(() => enqueueSnackbar(t('checkout.createError'), { variant: 'error' }));
  };

  const toggleProductSelection = (product: any) => {
    setSelectedProducts(prev =>
      prev.some(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{display:'flex'}}>
            <ArrowBackIos style={{cursor:'pointer', marginTop:'10px', marginRight:'20px'}} onClick={()=>{setModule('')}}/>
            <Typography variant="h4">
              {t('checkout.createTitle')}
            </Typography>
          </Box>
      </Box>
      <Paper elevation={0} sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper
      }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: theme.palette.text.primary }}>
          {t('checkout.productsTitle')}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {products.map((product) => {
            const isSelected = selectedProducts.some(p => p.id === product.id);
            return (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Paper
                  elevation={0}
                  onClick={() => toggleProductSelection(product)}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    cursor: 'pointer',
                    border: `2px solid ${isSelected
                      ? theme.palette.primary.main
                      : theme.palette.grey[200]}`,
                    backgroundColor: isSelected
                      ? theme.palette.primary.light + '22'
                      : theme.palette.background.paper,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: theme.shadows[3]
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={product.image}
                      sx={{
                        mr: 2,
                        bgcolor: theme.palette.grey[200],
                        width: 48,
                        height: 48
                      }}
                    >
                      <AddShoppingCart />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {product.price?.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

      <Paper elevation={0} sx={{
        p: 3,
        mb: 4,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper
      }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={publicCheckout}
              onChange={(e) => setPublicCheckout(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t('checkout.publicTitle')}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t('checkout.publicDescription')}
              </Typography>
            </Box>
          }
          sx={{ mb: 2 }}
        />

        {!publicCheckout && (
          <Box sx={{
            mt: 3,
            pt: 3,
            borderTop: `1px dashed ${theme.palette.divider}`
          }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {t('checkout.customerInfo')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('checkout.customerName')}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t('checkout.customerEmail')}
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  variant="outlined"
                  size="small"
                  type="email"
                />
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleCreate}
          startIcon={<CheckCircle />}
          sx={{
            px: 4,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: theme.shadows[2],
            '&:hover': {
              boxShadow: theme.shadows[4]
            }
          }}
        >
          {t('checkout.createButton')}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateCheckoutForm;