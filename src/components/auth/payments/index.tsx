import React, { useEffect, useState } from 'react';
import {
  Modal,
  Fade,
  Paper,
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  Chip,
  useTheme,
  styled,
  alpha
} from '@mui/material';
import {
  CreditCard,
  Close,
  ArrowForward,
  Lock,
  CheckCircle
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import PaymentService from '../../../services/payments-stripe.service.ts';
import i18n from '../../../i18next.js';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useLocalStorage } from '../../../hooks/useLocalStorage.ts';
import { useNavigate } from 'react-router-dom';
import AllInOneService from '../../../services/all-in-one.service.ts';

//prod -- pk_live_51QqzL1HHmMmwGxT0IJuUJkhH1k05x1MexJpqUXeptyugtbaEQ9PBEtG595YHzRwFes5l56oyPmKKCrSvfxw7um7s00x6IVEyuM
const stripePromise = loadStripe('pk_live_51QqzL1HHmMmwGxT0IJuUJkhH1k05x1MexJpqUXeptyugtbaEQ9PBEtG595YHzRwFes5l56oyPmKKCrSvfxw7um7s00x6IVEyuM');

const PaymentCard = styled(Paper)(({ theme, selected }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: selected
    ? `2px solid ${theme.palette.primary.main}`
    : `1px solid ${theme.palette.divider}`,
  backgroundColor: selected
    ? alpha(theme.palette.primary.light, 0.1)
    : theme.palette.background.paper,
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[6],
  },
}));

const CheckoutForm = ({ selectedPlan, onClose, pendingToken, userEmail }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [token, setToken] = useLocalStorage('accessToken', null);
  const [userId, setUserId] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  useEffect(()=>{
    const tokenValue = pendingToken?.accessToken || pendingToken;
    AllInOneService.getUserByToken(tokenValue)
      .then((res) => setUserId(res.data._id))
  },[pendingToken])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    //elite  en -- price_1RJabGHHmMmwGxT0GMKaq7x6
    //pro en -- price_1RJdbbHHmMmwGxT0L86AWVjz
    const priceId =
      selectedPlan === 'elite'
        ? i18n.language.startsWith('pt')
          ? 'price_1RRc4pHHmMmwGxT0JPlHCZ1D'      // PT
          : 'price_1RJabGHHmMmwGxT0GMKaq7x6'
        : i18n.language.startsWith('pt')
          ? 'price_1RRc4tHHmMmwGxT0pwfcH4oy'      // PT
          : 'price_1RJdbbHHmMmwGxT0L86AWVjz';


    try {
      const cardElement = elements.getElement(CardElement);
      const { paymentMethod, error: paymentMethodError } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (paymentMethodError) {
        enqueueSnackbar(paymentMethodError.message, { variant: 'error' });
        setIsProcessing(false);
        return;
      }

      const { data } = await PaymentService.createSubscription({
        email: userEmail,
        priceId,
        paymentMethodId: paymentMethod.id,
        userId
      });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (result.error) {
        alert(t('checkout.payment_failed', { error: result.error.message }));
      } else if (result.paymentIntent.status === 'succeeded') {
        enqueueSnackbar(t('payment.success'), { variant: 'success' });
        setToken(pendingToken);
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar(t('payment.error'), { variant: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': { color: '#aab7c4' }
            },
            invalid: { color: '#9e2146' }
          }
        }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        disabled={!stripe || isProcessing}
        sx={{ mt: 4 }}
      >
      {isProcessing
        ? t('checkout.processing')
        : t('checkout.pay_amount', {
            amount:
              selectedPlan === 'elite'
                ? (i18n.language.startsWith('pt') ? 'R$24' : '$10')
                : (i18n.language.startsWith('pt') ? 'R$49' : '$39')
          })
      }
      </Button>
    </form>
  );
};

const PaymentSelectionModal = ({ open, onClose, selectedPlan, pendingToken, userEmail }) => {
  const theme = useTheme();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const { t } = useTranslation();

  const paymentMethods = [
    {
      id: 'credit_card',
      name: t('checkout.credit_card'),
      icon: <CreditCard sx={{ fontSize: 32 }} />,
      description: t('checkout.credit_card_description'),
      popular: true
    }
  ];

  const planPrices = {
    elite: t('checkout.elite_price'),
    pro: t('checkout.pro_price')
  };

  const planNames = {
    elite: t('checkout.elite_plan'),
    pro: t('checkout.pro_plan')
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(0,0,0,0.5)',
      }}
    >
      <Fade in={open}>
        <Paper
          sx={{
            width: '90%',
            maxWidth: '600px',
            p: 0,
            borderRadius: 4,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            boxShadow: theme.shadows[10],
          }}
          elevation={0}
        >
          <Box sx={{ bgcolor: theme.palette.primary.dark, color: '#fff', p: 3, position: 'relative' }}>
            <Button
              onClick={onClose}
              sx={{ position: 'absolute', right: 16, top: 16, color: '#fff', minWidth: 0 }}
            >
              <Close />
            </Button>
            <Typography variant="h6" textAlign="left" sx={{ opacity: 0.9, mt: 1 }}>
              {planNames[selectedPlan]} • {planPrices[selectedPlan]}
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="600" mb={2}>
              {t('checkout.select_payment_method')}
            </Typography>

            <Stack spacing={3} mt={3}>
              {paymentMethods.map((method) => (
                <PaymentCard
                  key={method.id}
                  selected={selectedMethod === method.id}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <Box display="flex" alignItems="center">
                    <Box sx={{ mr: 3 }}>
                      {React.cloneElement(method.icon, {
                        color: selectedMethod === method.id ? 'primary' : 'action'
                      })}
                    </Box>
                    <Box flexGrow={1}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="h6" fontWeight="600">
                          {method.name}
                        </Typography>
                        {method.popular && (
                          <Chip
                            label={t('checkout.popular')}
                            size="small"
                            color="primary"
                            sx={{ ml: 2, fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {method.description}
                      </Typography>
                    </Box>
                    {selectedMethod === method.id && (
                      <CheckCircle color="primary" />
                    )}
                  </Box>
                </PaymentCard>
              ))}
            </Stack>

            {selectedMethod === 'credit_card' && (
              <Elements stripe={stripePromise}>
                <CheckoutForm selectedPlan={selectedPlan} onClose={onClose} pendingToken={pendingToken} userEmail={userEmail} />
              </Elements>
            )}

            <Box mt={3} textAlign="center">
              <Typography variant="caption" color="text.secondary">
                <Lock sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                {t('checkout.secure_payment')}
              </Typography>
            </Box>
          </Box>

          <Divider />
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('checkout.need_help')} <Button size="small" sx={{ color: theme.palette.primary.main }}>{t('checkout.contact_support')}</Button>
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default PaymentSelectionModal;