// CustomerModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import CustomerService from '../../../services/customer.service.ts';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';

interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  onCustomerUpdated: () => void;
  enterpriseId: string;
  // Se existir, estamos em modo de atualização.
  customer?: any;
}

const CustomerModal: React.FC<CustomerModalProps> = ({
  open,
  onClose,
  onCustomerUpdated,
  enterpriseId,
  customer,
}) => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    enterpriseId: enterpriseId,
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: 'Masculine',
    active: true,
    userId: '',
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        enterpriseId: customer.enterpriseId || enterpriseId,
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        birthDate: customer.birthDate
          ? new Date(customer.birthDate).toISOString().substring(0, 10)
          : '',
        gender: customer.gender || 'Masculine',
        active: customer.active !== undefined ? customer.active : true,
        userId: customer.id || '',
      });
    } else {
      setFormData({
        enterpriseId: enterpriseId,
        name: '',
        email: '',
        phone: '',
        birthDate: '',
        gender: 'Masculine',
        active: true,
        userId: '',
      });
    }
  }, [customer, enterpriseId, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'active' ? value === 'true' : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (customer) {
        await CustomerService.update(customer.id, formData);
        enqueueSnackbar(t('customers.updatedSuccess'), { variant: "success" });
      } else {
        await CustomerService.create(formData);
        enqueueSnackbar(t('customers.createdSuccess'), { variant: "success" });
      }
      onCustomerUpdated();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      enqueueSnackbar(t('customers.error'), { variant: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {customer ? t('customers.form.updateTitle') : t('customers.form.createTitle')}
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label={t('customers.form.name')}
          name="name"
          fullWidth
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label={t('customers.form.email')}
          name="email"
          fullWidth
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label={t('customers.form.phone')}
          name="phone"
          fullWidth
          value={formData.phone}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label={t('customers.form.birthDate')}
          name="birthDate"
          type="date"
          fullWidth
          value={formData.birthDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          select
          margin="dense"
          label={t('customers.form.gender')}
          name="gender"
          fullWidth
          value={formData.gender}
          onChange={handleChange}
        >
          <MenuItem value="Masculine">{t('customers.form.genderOptions.masculine')}</MenuItem>
          <MenuItem value="Feminine">{t('customers.form.genderOptions.feminine')}</MenuItem>
        </TextField>
        <TextField
          select
          margin="dense"
          label={t('customers.form.active')}
          name="active"
          fullWidth
          value={formData.active.toString()}
          onChange={handleChange}
        >
          <MenuItem value="true">{t('customers.form.activeOptions.true')}</MenuItem>
          <MenuItem value="false">{t('customers.form.activeOptions.false')}</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          {t('customers.form.cancel')}
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {t('customers.form.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerModal;
