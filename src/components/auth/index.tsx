import React, { useState, useEffect } from 'react';
import {
  AuthContainer,
  AuthContainerElements,
  AuthContainerLeft,
  AuthContainerLeftButton,
  AuthContainerLeftForgotPassword,
  AuthContainerLeftForgotSignup,
  AuthContainerLeftInput,
  AuthContainerLeftLabelInput,
  AuthContainerLeftLabelPassword,
  AuthContainerLeftPassword,
  AuthContainerRight,
  AuthContainerRightImage,
  AuthContainerLeftForgotSignupLink,
  AuthContainerLeftLogo,
  LoadingIcon,
} from './styles.ts';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import AuthCoverImage from '../../images/auth-cover.png';
import LogoImage from '../../images/logo.png';
import AllInOneService from '../../services/all-in-one.service.ts';
import { useLocalStorage } from '../../hooks/useLocalStorage.ts';
import { useNavigate } from 'react-router-dom';
import i18n from '../../i18next.js';
import { jwtDecode } from 'jwt-decode';
import { useSnackbar } from 'notistack';
import { Avatar, Box, Button, Card, CardActions, CardContent, Chip, Divider, Fade, Modal, Paper, styled, Typography, useTheme, Zoom } from '@mui/material';
import { Check, CheckCircle, Shield } from 'lucide-react';
import { Apartment, Business, FreeBreakfast, RocketLaunch, Whatshot } from '@mui/icons-material';
import PaymentSelectionModal from './payments/index.tsx';
import { useTranslation } from 'react-i18next';

const clientId = "1008084799451-u095ep4ps18ej4l28i571osdssnomtmp.apps.googleusercontent.com";


const Auth = () => {
  const [isNewUser, setIsNewUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useLocalStorage('accessToken', null);
  const { enqueueSnackbar } = useSnackbar();
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const [pendingToken, setPendingToken] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    cellphone: '',
    password: '',
    gender: '',
    birthDate: '',
  });

  // Estado para erros de validação dos campos
  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    cellphone: '',
    password: '',
  });

  // Expressões regulares para validação de e-mail e celular
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const genderOptions = [
    i18n.t('gender.male'),
    i18n.t('gender.female'),
    i18n.t('gender.noOpinion'),
  ];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAuth();
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  // Função para validar cada campo individualmente
  const validateField = (field, value) => {
    switch (field) {
      case 'email':
        if (!value.trim()) return i18n.t('error.emailRequired');
        if (!emailRegex.test(value)) return i18n.t('error.invalidEmail');
        return '';
      case 'password':
        if (!value) return i18n.t('error.passwordRequired');
        return '';
      case 'name':
        if (!value.trim()) return i18n.t('error.nameRequired');
        return '';
      case 'cellphone':
        if (!value.trim()) return i18n.t('error.cellphoneRequired');
        return '';
      default:
        return '';
    }
  };

  // Atualiza o estado do usuário e valida o campo em tempo real
  const handleChange = (field, value) => {
    setUser(prev => ({ ...prev, [field]: value }));
    const errorMsg = validateField(field, value);
    setFieldErrors(prev => ({ ...prev, [field]: errorMsg }));
  };

  // Validação final do formulário ao submeter
  const validateForm = () => {
    const newErrors = {};
    if (isNewUser) {
      newErrors.name = validateField('name', user.name);
      newErrors.cellphone = validateField('cellphone', user.cellphone);
      newErrors.email = validateField('email', user.email);
      newErrors.password = validateField('password', user.password);
    } else {
      newErrors.email = validateField('email', user.email);
      newErrors.password = validateField('password', user.password);
    }
    setFieldErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleAuth = () => {
    if (!validateForm()) {
      enqueueSnackbar(i18n.t('error.fixErrors'), { variant: "error" });
      return;
    }
    setLoading(true);
    const action = isNewUser ? AllInOneService.create : AllInOneService.get;
    action(user)
      .then((res) => {
        if (res.data) {
          if(action === AllInOneService.create){
            setPendingToken(res.data);
            setShowPlanSelection(true);
            return;
          }
          setToken(res.data)
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        enqueueSnackbar(i18n.t('error.authError'), { variant: "error" });
      });
  };

  const handleGoogleSuccess = async (response) => {
    const { credential } = response || {};

    if (credential) {
      let decodedCredential;
      try {
        decodedCredential = jwtDecode(credential);
      } catch (error) {
        enqueueSnackbar(i18n.t('error.authError'), { variant: "error" });
        return;
      }
      const { email, name, sub } = decodedCredential || {};
      if (email && sub) {
        if (isNewUser) {
          AllInOneService.create({
            name: name || i18n.t('error.noName'),
            email,
            password: sub,
          })
            .then((data) => {
              if (data.data) {
                setToken(data.data);
              }
            })
            .catch((err) => {
              enqueueSnackbar(i18n.t('error.authError'), { variant: "error" });
              console.error('Erro ao criar usuário:', err);
            });
        } else {
          AllInOneService.get({ email, password: sub })
            .then((data) => {
              if (data.data) {
                setToken(data.data);
              }
            })
            .catch((err) => {
              enqueueSnackbar(i18n.t('error.authError'), { variant: "error" });
              console.error('Erro ao fazer login:', err);
            });
        }
      } else {
        enqueueSnackbar(i18n.t('error.authError'), { variant: "error" });
      }
    } else {
      enqueueSnackbar(i18n.t('error.authError'), { variant: "error" });
    }
  };

  useEffect(() => {
    if (token && !showPlanSelection) {
      navigate('/dashboard');
    }
  }, [token, navigate, showPlanSelection]);

  const errorStyle = { color: '#E57373', fontSize: '12px', marginTop: '-15px', marginBottom: '12px' };

  const StyledCard = styled(Card)(({ theme, highlighted }) => ({
    transition: 'transform 0.3s, box-shadow 0.3s',
    transform: highlighted ? 'scale(1.05)' : 'scale(1)',
    border: highlighted ? `2px solid ${theme.palette.primary.main}` : '2px solid #ccc',
    backgroundColor: '#fff',
    minHeight: '460px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '&:hover': {
      transform: 'scale(1.03)',
      boxShadow: theme.shadows[10],
    },
  }));

  const PlanSelectionModal = () => {
    const theme = useTheme();
    const { t } = useTranslation();

    const handleSelectPlan = async (plan) => {
      if (plan === 'trial') {
        await setToken(pendingToken);
        navigate('/dashboard');
      } else {
        setSelectedPlan(plan);
        setPaymentModalOpen(true);
      }
    };


    const plans = [
      {
        id: 'trial',
        title: t('plans.trial.title'),
        price: '0',
        duration: t('plans.trial.duration'),
        features: ['plans.trial.feature1', 'plans.trial.feature2', 'plans.trial.feature3'],
        icon: <FreeBreakfast sx={{ fontSize: 50, color: '#578acd' }} />,
        buttonText: t('plans.trial.button'),
        recommended: false,
      },
      {
        id: 'elite',
        title: t('plans.elite.title'),
        price: '10',
        duration: t('plans.elite.duration'),
        features: ['plans.elite.feature1', 'plans.elite.feature2', 'plans.elite.feature3', 'plans.elite.feature4'],
        icon: <RocketLaunch sx={{ fontSize: 50, color: '#578acd' }} />,
        buttonText: t('plans.elite.button'),
        recommended: true,
      },
      {
        id: 'pro',
        title: t('plans.pro.title'),
        price: '39',
        duration: t('plans.pro.duration'),
        features: [
          'plans.pro.feature1',
          'plans.pro.feature2',
          'plans.pro.feature3',
          'plans.pro.feature4',
          'plans.pro.feature5',
        ],
        icon: <Apartment sx={{ fontSize: 50, color: '#578acd' }} />,
        buttonText: t('plans.pro.button'),
        recommended: false,
      },
    ];

    return (
      <Modal open sx={{ overflowY:'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)', backgroundColor: 'rgba(0,0,0,0.3)' }}>
        <Fade in>
          <Paper sx={{ width: '90%', maxWidth: '1000px', p: 4, borderRadius: 4, bgcolor: '#fff', marginTop: { xs: '600px', sm: '0px' } }} elevation={12}>
            <Box textAlign="center" mb={4}>
              <Typography variant="h6" fontWeight="bold" color="#202020">
                {t('plans.subtitle')}
              </Typography>
            </Box>

            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={4} mt={4}>
              {plans.map((plan, index) => (
                <Zoom in key={plan.id} style={{ transitionDelay: `${index * 100}ms` }}>
                  <StyledCard highlighted={plan.recommended}>
                    <CardContent sx={{ position: 'relative' }}>
                      {plan.recommended && (
                        <Chip
                          label={t('plans.recommended')}
                          color="primary"
                          size="small"
                          sx={{ position: 'absolute', top: -17, right: 90, fontWeight: 'bold', zIndex: 1000000000 }}
                        />
                      )}

                      <Box display="flex" justifyContent="center" mb={2}>
                        {plan.icon}
                      </Box>

                      <Typography variant="h5" fontWeight={700} gutterBottom textAlign="center">
                        {plan.title}
                      </Typography>

                      <Typography variant="h4" fontWeight={800} textAlign="center">
                        ${plan.price}
                        <Typography variant="body2" component="span" color="text.secondary">
                          /{plan.duration}
                        </Typography>
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      <Box textAlign="left" px={1}>
                        {plan.features.map((featureKey, i) => (
                          <Box key={i} display="flex" alignItems="center" mb={1}>
                            <Check size={20} color={plan.recommended ? '#578acd' : '#252525'} style={{ marginRight: '10px' }} />
                            <Typography variant="body2">{t(featureKey)}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>

                    <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                      <Button
                        variant={plan.recommended ? 'contained' : 'outlined'}
                        color="primary"
                        size="large"
                        fullWidth
                        onClick={() => handleSelectPlan(plan.id)}
                        sx={{
                          py: 1.5,
                          fontWeight: 700,
                          fontSize: '1rem',
                          borderRadius: 2,
                          textTransform: 'none',
                        }}
                      >
                        {plan.buttonText}
                      </Button>
                    </CardActions>
                  </StyledCard>
                </Zoom>
              ))}
            </Box>

            <Box mt={5} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                {t('plans.help')} <Button size="small" sx={{ color: '#578acd' }}>{t('plans.contact')}</Button>
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Modal>
    );
  };


  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthContainer>
      {showPlanSelection && <PlanSelectionModal />}
      {paymentModalOpen && (
        <PaymentSelectionModal
          open={paymentModalOpen}
          onClose={() => setPaymentModalOpen(false)}
          selectedPlan={selectedPlan}
          pendingToken={pendingToken}
          userEmail={user.email}
        />
      )}
        <AuthContainerLeft>
          <AuthContainerElements>
            <AuthContainerLeftLogo src={LogoImage} alt="Logo" />

            {/* Seção de login */}
            {!isNewUser ? (
              <>
                <div style={{ marginTop: '40px' }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() =>
                      enqueueSnackbar(i18n.t('error.authError'), { variant: "error" })
                    }
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBlock: '20px',
                    justifyContent: 'center',
                  }}
                >
                  <hr
                    style={{
                      flex: 1,
                      border: 'none',
                      borderTop: '1px solid #ccc',
                    }}
                  />
                  <span
                    style={{
                      margin: '0 10px',
                      fontWeight: 'bold',
                      color: '#333',
                    }}
                  >
                    Or
                  </span>
                  <hr
                    style={{
                      flex: 1,
                      border: 'none',
                      borderTop: '1px solid #ccc',
                    }}
                  />
                </div>
                <AuthContainerLeftLabelInput>{i18n.t('auth.email')}</AuthContainerLeftLabelInput>
                <AuthContainerLeftInput
                  type="email"
                  onKeyDown={handleKeyDown}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                {fieldErrors.email && (
                  <div style={errorStyle}>
                    {fieldErrors.email}
                  </div>
                )}

                <AuthContainerLeftLabelPassword>
                  {i18n.t('auth.password')}
                </AuthContainerLeftLabelPassword>
                <AuthContainerLeftPassword
                  type="password"
                  onChange={(e) => handleChange('password', e.target.value)}
                />
                {fieldErrors.password && (
                  <div style={errorStyle}>
                    {fieldErrors.password}
                  </div>
                )}

                <AuthContainerLeftButton onClick={handleAuth} disabled={loading}>
                  {loading ? <LoadingIcon className="loading-icon" /> : i18n.t('auth.signIn')}
                </AuthContainerLeftButton>

                <AuthContainerLeftForgotSignup>
                  {i18n.t('auth.noAccount')}{' '}
                  <AuthContainerLeftForgotSignupLink onClick={() => setIsNewUser(true)}>
                    {i18n.t('auth.signUp')}
                  </AuthContainerLeftForgotSignupLink>
                </AuthContainerLeftForgotSignup>

                <AuthContainerLeftForgotPassword>
                  {i18n.t('auth.forgotPassword')}
                </AuthContainerLeftForgotPassword>
              </>
            ) : (
              // Seção de cadastro
              <>
                <div style={{ marginTop: '20px' }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() =>
                      enqueueSnackbar(i18n.t('error.authError'), { variant: "error" })
                    }
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBlock: '20px',
                    justifyContent: 'center',
                  }}
                >
                  <hr
                    style={{
                      flex: 1,
                      border: 'none',
                      borderTop: '1px solid #ccc',
                    }}
                  />
                  <span
                    style={{
                      margin: '0 10px',
                      fontWeight: 'bold',
                      color: '#333',
                    }}
                  >
                    Or
                  </span>
                  <hr
                    style={{
                      flex: 1,
                      border: 'none',
                      borderTop: '1px solid #ccc',
                    }}
                  />
                </div>
                <AuthContainerLeftLabelInput>{i18n.t('auth.name')}</AuthContainerLeftLabelInput>
                <AuthContainerLeftInput
                  onChange={(e) => handleChange('name', e.target.value)}
                />
                {fieldErrors.name && (
                  <div style={errorStyle}>
                    {fieldErrors.name}
                  </div>
                )}

                <AuthContainerLeftLabelInput>
                  {i18n.t('auth.cellphone')}
                </AuthContainerLeftLabelInput>
                <AuthContainerLeftInput
                  onChange={(e) => handleChange('cellphone', e.target.value)}
                />
                {fieldErrors.cellphone && (
                  <div style={errorStyle}>
                    {fieldErrors.cellphone}
                  </div>
                )}

                <AuthContainerLeftLabelInput>{i18n.t('auth.email')}</AuthContainerLeftLabelInput>
                <AuthContainerLeftInput
                  type="email"
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                {fieldErrors.email && (
                  <div style={errorStyle}>
                    {fieldErrors.email}
                  </div>
                )}

                <AuthContainerLeftLabelPassword>
                  {i18n.t('auth.password')}
                </AuthContainerLeftLabelPassword>
                <AuthContainerLeftPassword
                  type="password"
                  onChange={(e) => handleChange('password', e.target.value)}
                />
                {fieldErrors.password && (
                  <div style={errorStyle}>
                    {fieldErrors.password}
                  </div>
                )}

                <AuthContainerLeftButton onClick={handleAuth} disabled={loading}>
                  {loading ? <LoadingIcon className="loading-icon" /> : i18n.t('auth.signUp')}
                </AuthContainerLeftButton>

                <AuthContainerLeftForgotSignup>
                  {i18n.t('auth.alreadyAccount')}{' '}
                  <AuthContainerLeftForgotSignupLink onClick={() => setIsNewUser(false)}>
                    {i18n.t('auth.signIn')}
                  </AuthContainerLeftForgotSignupLink>
                </AuthContainerLeftForgotSignup>
              </>
            )}
          </AuthContainerElements>
        </AuthContainerLeft>

        <AuthContainerRight>
          <AuthContainerRightImage src={AuthCoverImage} alt="Auth Cover" />
        </AuthContainerRight>
      </AuthContainer>
    </GoogleOAuthProvider>
  );
};

export default Auth;
