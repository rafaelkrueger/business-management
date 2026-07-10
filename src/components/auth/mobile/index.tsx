import React, { useEffect, useState } from 'react';
import {
  AuthContainer,
  AuthHeader,
  AuthLogo,
  AuthTitle,
  AuthSubtitle,
  AuthFormContainer,
  AuthForm,
  AuthInput,
  AuthLabel,
  AuthButton,
  AuthDivider,
  AuthFooterLink,
  AuthErrorText,
} from './styles.ts';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import LogoImage from '../../../images/logo-rebranding-2.png';
import { useTranslation } from 'react-i18next';
import {
  User,
  Mail,
  Lock,
  Smartphone,
  ArrowRight,
  Shield,
  Check,
  CheckCircle,
  Diamond,
  Star
} from 'lucide-react';
import { useSnackbar } from 'notistack';
import { Avatar, Box, Button, Chip, CircularProgress, Divider, Fade, Modal, Paper, Typography, useTheme } from '@mui/material';
import { AutoGraph, Campaign, Contacts, RocketLaunch, SmartToy, Timeline } from '@mui/icons-material';
import AuthService from '../../../services/auth.service.ts';
import i18n from '../../../i18next.js';
import { jwtDecode } from 'jwt-decode';
import { useLocalStorage } from '../../../hooks/useLocalStorage.ts';
import { useNavigate } from 'react-router-dom';
import { AuthPlanCard, AuthPlanTitle, AuthPlanPrice, AuthPlanFeatures } from '../styles.ts';
import PaymentSelectionModal from '../payments/index.tsx';

const MobileAuth = () => {
  const [isNewUser, setIsNewUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [pendingToken, setPendingToken] = useState(null);
  const [token, setToken] = useLocalStorage('accessToken', null);
  const theme = useTheme();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanSelection, setShowPlanSelection] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cardData = [
      {
      icon: <SmartToy sx={{ fontSize: 28, color: '#6591CA', mr: 2, mt: 0.5 }} />,
      title: t('features.aiAssistant.title'),
      desc: t('features.aiAssistant.desc')
    },
    {
      icon: <AutoGraph sx={{ fontSize: 28, color: '#6591CA', mr: 2, mt: 0.5 }} />,
      title: t('features.socialAutomation.title'),
      desc: t('features.socialAutomation.desc')
    },
    {
      icon: <Campaign sx={{ fontSize: 28, color: '#6591CA', mr: 2, mt: 0.5 }} />,
      title: t('features.landingPages.title'),
      desc: t('features.landingPages.desc')
    },
    {
      icon: <Contacts sx={{ fontSize: 28, color: '#6591CA', mr: 2, mt: 0.5 }} />,
      title: t('features.crm.title'),
      desc: t('features.crm.desc')
    },
    {
      icon: <Timeline sx={{ fontSize: 28, color: '#6591CA', mr: 2, mt: 0.5 }} />,
      title: t('features.salesFunnels.title'),
      desc: t('features.salesFunnels.desc')
    },
    ];


    const videoMap = [
      'https://www.youtube.com/embed/gRK7QVy8FbI', // IA de Marketing
      'https://www.youtube.com/embed/SgU_o7GEyzM', // Automação
      'https://www.youtube.com/embed/sMshKg8-tO0', // Landing Pages
      'https://www.youtube.com/embed/acTuztqvNxI', // CRM
      'https://www.youtube.com/embed/yWdXxEZAE3Q', // Funis
    ];
  const [videoIndex, setVideoIndex] = useState(0);

    useEffect(() => {
      if (token) {
        navigate('/dashboard');
      }
    }, [token, navigate]);

  const [user, setUser] = useState({
    name: '',
    email: '',
    cellphone: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    cellphone: '',
    password: '',
  });

  const handleChange = (field, value) => {
    setUser(prev => ({ ...prev, [field]: value }));
    const errorMsg = validateField(field, value);
    setFieldErrors(prev => ({ ...prev, [field]: errorMsg }));
  };

    const validateField = (field, value) => {
      switch (field) {
        case 'email':
          if (!value.trim()) return i18n.t('error.emailRequired');
          if (!emailRegex.test(value)) return i18n.t('error.invalidEmail');
          return '';
        case 'password':
          if (!value) return i18n.t('error.passwordRequired');
          if (value.length < 6) return i18n.t('error.passwordMinLength');
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
    const action = isNewUser ? AuthService.signUp : AuthService.signIn;
    action(user)
      .then((res) => {
        if (res.data) {
          if(action === AuthService.signUp){
            setPendingToken(res.data?.accessToken || res.data);
            setShowPlanSelection(true);
            return;
          }
          setToken(res.data?.accessToken || res.data)
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
          AuthService.signUp({
            name: name || i18n.t('error.noName'),
            email,
            password: sub,
          })
            .then((data) => {
              if (data.data) {
                setToken(data.data?.accessToken || data.data);
              }
            })
            .catch((err) => {
              enqueueSnackbar(i18n.t('error.authError'), { variant: "error" });
              console.error('Erro ao criar usuário:', err);
            });
        } else {
          AuthService.signIn({ email, password: sub })
            .then((data) => {
              if (data.data) {
                setToken(data.data?.accessToken || data.data);
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


    const PlanSelectionModal = () => {
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
        price:t('plans.trial.price'),
        duration: t('plans.trial.duration'),
        features: ['plans.trial.feature5', 'plans.trial.feature1', 'plans.trial.feature2', 'plans.trial.feature3', 'plans.trial.feature4'],
        icon: <Star sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
        buttonText: t('plans.trial.button'),
        recommended: false,
      },
      {
        id: 'elite',
        title: t('plans.elite.title'),
        price: t('plans.elite.price'),
        duration: t('plans.elite.duration'),
        features: ['plans.elite.feature1', 'plans.elite.feature5','plans.elite.feature2', 'plans.elite.feature3', 'plans.elite.feature4'],
        icon: <RocketLaunch sx={{ fontSize: 40, color: '#fff' }} />,
        buttonText: t('plans.elite.button'),
        recommended: true,
      },
      {
        id: 'pro',
        title: t('plans.pro.title'),
        price: t('plans.pro.price'),
        duration: t('plans.pro.duration'),
        features: [
          'plans.pro.feature1',
          'plans.pro.feature5',
          'plans.pro.feature2',
          'plans.pro.feature3',
          'plans.pro.feature4',
        ],
        icon: <Diamond sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
        buttonText: t('plans.pro.button'),
        recommended: false,
      },
    ];

      return (
        <Modal open sx={{
          overflowY: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
          <Fade in>
            <Paper sx={{
              p: 4,
              pt:120,
              width: '90%',
              maxWidth: '1200px',
              borderRadius: 4,
              bgcolor: 'background.paper',
              boxShadow: 24,
              height:'2000px',
            }}>
              <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)', marginTop:'130px' }} gap={4}>
                {plans.map((plan, index) => (
                  <Fade in key={plan.id} style={{ transitionDelay: `${index * 100}ms` }}>
                    <AuthPlanCard style={{height: '87%'}} highlighted={plan.recommended}>
                      {plan.recommended && (
                        <Chip
                          label={t('plans.recommended')}
                          color="primary"
                          sx={{
                            position: 'absolute',
                            top: -15,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            fontFamily: '"Nunito", sans-serif'
                          }}
                        />
                      )}

                      <Box display="flex" justifyContent="center" mb={3}>
                        {plan.recommended && (
                          <Avatar sx={{
                            bgcolor: plan.recommended ? theme.palette.primary.main : 'action.selected',
                            width: 80,
                            height: 80
                          }}>
                            {plan.icon}
                          </Avatar>
                        )}
                      </Box>

                      <AuthPlanTitle>{plan.title}</AuthPlanTitle>

                      <AuthPlanPrice>
                        {plan.price}
                        <span>{plan.duration}</span>
                      </AuthPlanPrice>

                      <Divider sx={{ my: 3 }} />

                      <AuthPlanFeatures>
                        {plan.features.map((featureKey, i) => (
                          <Box key={i} display="flex" alignItems="center" mb={2}>
                            <CheckCircle sx={{
                              fontSize: 20,
                              color: plan.recommended ? 'primary.main' : 'text.secondary',
                              mr: 1.5
                            }} />
                            <Typography variant="body2" color="text.primary" sx={{ fontFamily: '"Nunito", sans-serif' }}>
                              {t(featureKey)}
                            </Typography>
                          </Box>
                        ))}
                      </AuthPlanFeatures>

                      <Button
                        fullWidth
                        variant={plan.recommended ? 'contained' : 'outlined'}
                        color="primary"
                        size="large"
                        endIcon={<ArrowRight size={20} />}
                        onClick={() => handleSelectPlan(plan.id)}
                        sx={{
                          mt: 3,
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '1rem',
                          fontFamily: '"Nunito", sans-serif'
                        }}
                      >
                        {plan.buttonText}
                      </Button>
                    </AuthPlanCard>
                  </Fade>
                ))}
              </Box>
            </Paper>
          </Fade>
        </Modal>
      );
    };

  return (
    <GoogleOAuthProvider clientId="your-client-id">
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
    {!showMoreInfo ?

  <AuthFormContainer>
        <AuthHeader>
          <AuthLogo src={LogoImage} alt="Logo" />
        </AuthHeader>
  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={() => enqueueSnackbar(t('error.authError'), { variant: "error" })}
    shape="pill"
    theme="filled_blue"
    size="large"
    width="100%"
    text={isNewUser ? 'signup_with' : 'signin_with'}
  />

  <AuthDivider>
    <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 500 }}>{t('auth.orContinueWith')}</span>
  </AuthDivider>

  <AuthForm>
    {isNewUser && (
      <>
        <div>
          <AuthLabel>
            <User size={18} style={{ marginRight: 8 }} />
            {t('auth.name')}
          </AuthLabel>
          <AuthInput
            placeholder={t('auth.namePlaceholder')}
            onChange={(e) => handleChange('name', e.target.value)}
            error={!!fieldErrors.name}
          />
          {fieldErrors.name && (
            <AuthErrorText>
              {fieldErrors.name}
            </AuthErrorText>
          )}
        </div>

        <div>
          <AuthLabel>
            <Smartphone size={18} style={{ marginRight: 8 }} />
            {t('auth.cellphone')}
          </AuthLabel>
          <AuthInput
            placeholder={t('auth.cellphonePlaceholder')}
            onChange={(e) => handleChange('cellphone', e.target.value)}
            error={!!fieldErrors.cellphone}
          />
          {fieldErrors.cellphone && (
            <AuthErrorText>
              {fieldErrors.cellphone}
            </AuthErrorText>
          )}
        </div>
      </>
    )}

    <div>
      <AuthLabel>
        <Mail size={18} style={{ marginRight: 8 }} />
        {t('auth.email')}
      </AuthLabel>
      <AuthInput
        type="email"
        placeholder={t('auth.emailPlaceholder')}
        onChange={(e) => handleChange('email', e.target.value)}
        error={!!fieldErrors.email}
      />
      {fieldErrors.email && (
        <AuthErrorText>
          {fieldErrors.email}
        </AuthErrorText>
      )}
    </div>

    <div>
      <AuthLabel>
        <Lock size={18} style={{ marginRight: 8 }} />
        {t('auth.password')}
      </AuthLabel>
      <AuthInput
        type="password"
        placeholder={t('auth.passwordPlaceholder')}
        onChange={(e) => handleChange('password', e.target.value)}
        error={!!fieldErrors.password}
      />
      {fieldErrors.password && (
        <AuthErrorText>
          {fieldErrors.password}
        </AuthErrorText>
      )}
    </div>

    <AuthButton
      variant="contained"
      color="primary"
      onClick={handleAuth}
      disabled={loading}
      endIcon={!loading && <ArrowRight size={20} />}
    >
      {loading
        ? <CircularProgress size={24} color="inherit" />
        : (isNewUser ? t('auth.signUp') : t('auth.signIn'))
      }
    </AuthButton>

    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16
    }}>
      <Typography variant="body2" sx={{ color: '#B9CBE5', fontFamily: '"Nunito", sans-serif' }}>
        {isNewUser ? t('auth.alreadyAccount') : t('auth.noAccount')}
      </Typography>
      <AuthFooterLink onClick={() => setIsNewUser(!isNewUser)}>
        {isNewUser ? t('auth.signIn') : t('auth.signUp')}
      </AuthFooterLink>
    </div>
  </AuthForm>
</AuthFormContainer>
     : (
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              maxWidth: 900,
              width: '100%',
              textAlign: 'center',
              color: '#0A1B30',
              mx: 'auto',
              mt:-5,
              backgroundColor: '#B9CBE5',
              p: 3,
              borderRadius: 2
            }}
          >
            {/* Vídeo demonstrativo dinâmico */}
            <Box sx={{ mb: 6, borderRadius: 2, overflow: 'hidden', height: 300, mt:4 }}>
              <Box
                component="iframe"
                src={`${videoMap[videoIndex]}?autoplay=1&mute=1&rel=0`}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </Box>
    <Box sx={{
  mb: 6,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '40px',
    background: 'linear-gradient(90deg, rgba(185, 203, 229, 0) 0%, #B9CBE5 100%)',
    pointerEvents: 'none',
    zIndex: 2
  }
}}>
<Box sx={{
  display: 'flex',
  overflowX: 'auto',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
  pb: 3,
  gap: 3,
  px: 2,
  position: 'relative',
  mt:-2
}}>
  {cardData.map((item, idx) => (
    <Box
      key={idx}
      onClick={() => setVideoIndex(idx)}
      sx={{
        minWidth: 260,
        mt:1,
        maxWidth: 260,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        p: 3,
        backgroundColor: videoIndex === idx
          ? 'rgba(10, 27, 48, 0.1)'
          : 'rgba(255,255,255,0.3)',
        borderRadius: 2,
        height: '100%',
        textAlign: 'left',
        transition: 'all 0.3s ease',
        flexShrink: 0,
        border: videoIndex === idx
          ? '1px solid #0A1B30'
          : '1px solid rgba(10, 27, 48, 0.2)',
        boxShadow: videoIndex === idx
          ? '0 0 20px rgba(10, 27, 48, 0.2)'
          : '0 2px 8px rgba(0,0,0,0.1)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          backgroundColor: 'rgba(10, 27, 48, 0.15)',
          transform: 'translateY(-4px)',
          borderColor: '#0A1B30'
        },
        // Efeito de onda quando selecionado
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          background: '#0A1B30',
          transition: 'height 0.3s ease'
        }
      }}
    >
      {/* Indicador de "Now Playing" */}
      {videoIndex === idx && (
        <Box sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.9)',
          borderRadius: '12px',
          px: 1.5,
          py: 0.5
        }}>
          <Box sx={{
            width: 8,
            height: 8,
            backgroundColor: '#6591CA',
            borderRadius: '50%',
            mr: 1,
            animation: 'pulse 1.5s infinite'
          }} />
          <Typography variant="caption" sx={{
            color: '#6591CA',
            fontWeight: 500,
            fontSize: '0.7rem',
            letterSpacing: '0.5px',
            fontFamily: '"Nunito", sans-serif'
          }}>
            PLAYING
          </Typography>
        </Box>
      )}

      {/* Ícone com efeito de play */}
      <Box sx={{
        mb: 2,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 40,
          height: 40,
          backgroundColor: videoIndex === idx
            ? 'rgba(87,138,205,0.3)'
            : 'transparent',
          borderRadius: '50%',
          transition: 'all 0.3s ease'
        }
      }}>
        {React.cloneElement(item.icon, {
          sx: {
            fontSize: '2rem',
            color: '#6591CA',
            position: 'relative',
            zIndex: 1
          }
        })}
      </Box>

      <Typography
        variant="subtitle1"
        fontWeight="600"
        sx={{
          color: '#0A1B30',
          mb: 1,
          transition: 'color 0.3s ease',
          fontFamily: '"Nunito", sans-serif'
        }}
      >
        {item.title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          opacity: 0.85,
          color: '#0A1B30',
          lineHeight: 1.5,
          fontSize: '0.9rem',
          fontFamily: '"Nunito", sans-serif'
        }}
      >
        {item.desc}
      </Typography>

      {/* Barra de progresso sutil */}
      {videoIndex === idx && (
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'rgba(10, 27, 48, 0.1)',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '30%', // Simula progresso do vídeo
            background: '#0A1B30',
            animation: 'progress 5s linear infinite'
          }
        }} />
      )}
    </Box>
  ))}
</Box>

</Box>
</Box>
    )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 24,
          color: '#ffffff',
          fontSize: '0.75rem',
          zIndex: 1,
          fontFamily: '"Nunito", sans-serif'
        }}>
          <Shield size={14} style={{ marginRight: 8 }} />
          {t('auth.securityNote')}
        </div>
      </AuthContainer>
    </GoogleOAuthProvider>
  );
};

export default MobileAuth;