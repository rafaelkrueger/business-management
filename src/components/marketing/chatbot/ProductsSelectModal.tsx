import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Box
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ProductService from '../../../services/product.service.ts';

interface Product {
  id: string;
  name: string;
  description: string;
  images?: string[];
  instruction?: string;
}

interface ProductsSelectModalProps {
  open: boolean;
  onClose: () => void;
  companyId: string;
  selected: string[];
  onChange: (ids: string[]) => void;
}

const ProductsSelectModal: React.FC<ProductsSelectModalProps> = ({ open, onClose, companyId, selected, onChange }) => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (open && companyId) {
      ProductService.get(companyId)
        .then((res) => setProducts(res.data || []))
        .catch(() => setProducts([]));
    }
  }, [open, companyId]);

  const handleToggle = (id: string) => {
    const exists = selected.includes(id);
    if (exists) {
      onChange(selected.filter((p) => p !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('products.selectProducts', 'Select Products')}</DialogTitle>
      <DialogContent dividers>
        {products.length === 0 ? (
          <Typography variant="body2">{t('products.noProducts', 'No products')}</Typography>
        ) : (
          <List>
            {products.map((product) => (
              <ListItem key={product.id} alignItems="flex-start">
                <Checkbox
                  checked={selected.includes(product.id)}
                  onChange={() => handleToggle(product.id)}
                />
                <ListItemAvatar>
                  <Avatar src={product.images?.[0]} />
                </ListItemAvatar>
                <ListItemText
                  primary={product.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {product.description}
                      </Typography>
                      {product.instruction && (
                        <Typography variant="caption" display="block">
                          {product.instruction}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('sidepanel.close', 'Close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductsSelectModal;
