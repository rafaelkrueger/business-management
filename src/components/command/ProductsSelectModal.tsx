import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  Box,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Typography,
  Tooltip
} from '@mui/material';
import { CheckCircleOutline, RadioButtonUnchecked, InfoOutlined, ImageOutlined } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import ProductService from '../../services/product.service.ts';
import OrdersService from '../../services/orders.service.ts';
import { useSnackbar } from 'notistack';

interface Product {
  id: string;
  name: string;
  description: string;
  images?: string[];
  instruction?: string;
  price?: number;
}

interface ProductsSelectModalProps {
  open: boolean;
  onClose: () => void;
  companyId: string;
  orderId: string;
  onProductsAdded?: () => void;
}

const ProductsSelectModal: React.FC<ProductsSelectModalProps> = ({
  open,
  onClose,
  companyId,
  orderId,
  onProductsAdded
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (open && companyId) {
      ProductService.get(companyId)
        .then((res) => setProducts(res.data || []))
        .catch(() => setProducts([]));
    }
    if (!open) {
      setSelected([]);
    }
  }, [open, companyId]);

  const handleToggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleConfirm = async () => {
    try {
      await Promise.all(
        selected.map((pid) =>
          OrdersService.addProduct({ companyId, orderId, productId: pid })
        )
      );
      enqueueSnackbar(t('orders.productAdded', 'Product added!'), { variant: 'success' });
      if (onProductsAdded) {
        await onProductsAdded();
      }
      setSelected([]);
      onClose();
    } catch (error) {
      enqueueSnackbar(t('orders.addProductError', 'Error adding product'), { variant: 'error' });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle
        sx={{
          py: 2,
          px: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {t('orders.selectProducts', 'Products')}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'inherit' }}>
          <Box component="span" fontSize="1.5rem">&times;</Box>
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {products.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <Typography variant="body1" color="textSecondary">
              {t('products.noProducts', 'No products available')}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ p: 2 }}>
            {products.map((product) => {
              const isSelected = selected.includes(product.id);
              return (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Paper
                    elevation={isSelected ? 6 : 1}
                    onClick={() => handleToggle(product.id)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: `2px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
                      transition: 'all 0.3s ease',
                      height: '100%',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[6],
                        borderColor: isSelected ? theme.palette.primary.dark : theme.palette.divider
                      }
                    }}
                  >
                    <Box display="flex" flexDirection="column" height="100%">
                      <Box position="relative" height={140} bgcolor="action.hover">
                        {product.images?.[0] ? (
                          <Box component="img" src={product.images[0]} alt={product.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Box display="flex" justifyContent="center" alignItems="center" height="100%" color="text.secondary">
                            <ImageOutlined fontSize="large" />
                          </Box>
                        )}
                        <Box position="absolute" top={10} right={10} bgcolor="background.paper" borderRadius="50%">
                          <Checkbox
                            icon={<RadioButtonUnchecked />}
                            checkedIcon={<CheckCircleOutline sx={{ color: theme.palette.primary.main }} />}
                            checked={isSelected}
                            sx={{ p: 0, '&:hover': { bgcolor: 'transparent' } }}
                          />
                        </Box>
                      </Box>
                      <Box p={2} flexGrow={1}>
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {product.name}
                          {product.instruction && (
                            <Tooltip title={product.instruction} placement="top">
                              <InfoOutlined fontSize="small" color="primary" />
                            </Tooltip>
                          )}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 3, overflow: 'hidden', textOverflow: 'ellipsis' }}
                        >
                          {product.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t('products.price')}: {product.price}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button variant="outlined" onClick={onClose} sx={{ minWidth: 120, borderRadius: 2 }}>
          {t('sidepanel.cancel', 'Cancel')}
        </Button>
        <Button variant="contained" onClick={handleConfirm} sx={{ minWidth: 120, borderRadius: 2 }}>
          {t('sidepanel.confirm', 'Confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductsSelectModal;
