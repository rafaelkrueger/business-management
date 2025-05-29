import React, { useState, useEffect } from 'react';
import {
  AuthContainer,
  AuthFormContainer,
  AuthLeftPanel,
  AuthRightPanel,
  AuthLogo,
  AuthTitle,
  AuthSubtitle,
  AuthForm,
  AuthInput,
  AuthLabel,
  AuthButton,
  AuthDivider,
  AuthFooterLink,
  AuthImage,
  AuthFeatureList,
  AuthFeatureItem,
  AuthPlanCard,
  AuthPlanTitle,
  AuthPlanPrice,
  AuthPlanFeatures,
  AuthErrorText
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
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Fade,
  Modal,
  Paper,
  Typography,
  useTheme,
  Avatar,
  IconButton,
  Grid,
  CircularProgress
} from '@mui/material';
import {
  Check,
  ArrowRight,
  Shield,
  Lock,
  Mail,
  User,
  Smartphone,
  Key,
  ChevronLeft
} from 'lucide-react';
import {
  RocketLaunch,
  Star,
  Diamond,
  CheckCircle,
  Analytics,
  AutoGraph,
  Campaign,
  Contacts,
  SmartToy,
  Timeline
} from '@mui/icons-material';
import PaymentSelectionModal from './payments/index.tsx';
import { useTranslation } from 'react-i18next';
import SpaceAnimation from '../space-animation/index.tsx';
import { AnimatedRocket } from './mobile/styles.ts';

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
  const theme = useTheme();
  const { t } = useTranslation();

  const [user, setUser] = useState({
    name: '',
    email: '',
    cellphone: '',
    password: '',
    gender: '',
    birthDate: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    cellphone: '',
    password: '',
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const handleChange = (field, value) => {
    setUser(prev => ({ ...prev, [field]: value }));
    const errorMsg = validateField(field, value);
    setFieldErrors(prev => ({ ...prev, [field]: errorMsg }));
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
            width: '90%',
            maxWidth: '1200px',
            p: 4,
            borderRadius: 4,
            bgcolor: 'background.paper',
            boxShadow: 24,
            height:'80%'
          }}>
            <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
              {plans.map((plan, index) => (
                <Fade in key={plan.id} style={{ transitionDelay: `${index * 100}ms` }}>
                  <AuthPlanCard style={{height: '90%'}} highlighted={plan.recommended}>
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
                          fontSize: '0.75rem'
                        }}
                      />
                    )}

                    <Box display="flex" justifyContent="center" mb={3}>
                      <Avatar sx={{
                        bgcolor: plan.recommended ? theme.palette.primary.main : 'action.selected',
                        width: 80,
                        height: 80
                      }}>
                        {plan.icon}
                      </Avatar>
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
                          <Typography variant="body2" color="text.primary">
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

  const cardData = [
    {
      icon: <SmartToy sx={{ fontSize: 28, color: '#00C4FF', mr: 2, mt: 0.5 }} />,
      title: t('features.aiAssistant.title'),
      desc: t('features.aiAssistant.desc')
    },
    {
      icon: <AutoGraph sx={{ fontSize: 28, color: '#00C4FF', mr: 2, mt: 0.5 }} />,
      title: t('features.socialAutomation.title'),
      desc: t('features.socialAutomation.desc')
    },
    {
      icon: <Campaign sx={{ fontSize: 28, color: '#00C4FF', mr: 2, mt: 0.5 }} />,
      title: t('features.landingPages.title'),
      desc: t('features.landingPages.desc')
    },
    {
      icon: <Contacts sx={{ fontSize: 28, color: '#00C4FF', mr: 2, mt: 0.5 }} />,
      title: t('features.crm.title'),
      desc: t('features.crm.desc')
    },
    {
      icon: <Timeline sx={{ fontSize: 28, color: '#00C4FF', mr: 2, mt: 0.5 }} />,
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

        <AuthLeftPanel>
            <AuthFormContainer style={{marginTop:'0px'}}>
          <Box sx={{justifyContent:'center', textAlignLast: 'center', marginTop:'-50px', marginBottom:'25px'}}>
            <AnimatedRocket />
          </Box>
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 2,
            flexDirection: 'column'
          }}
        >
        </Box>
            <Box sx={{ mb: 3 }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => enqueueSnackbar(i18n.t('error.authError'), { variant: "error" })}
                shape="pill"
                theme="filled_blue"
                size="large"
                width="100%"
              />
            </Box>

            <AuthDivider>
              <span>{t('auth.orContinueWith')}</span>
            </AuthDivider>

            <AuthForm>
              {isNewUser && (
                <>
                  <Box sx={{ mb: 2 }}>
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
                  </Box>

                  <Box sx={{ mb: 2 }}>
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
                  </Box>
                </>
              )}

              <Box sx={{ mb: 2 }}>
                <AuthLabel>
                  <Mail size={18} style={{ marginRight: 8 }} />
                  {t('auth.email')}
                </AuthLabel>
                <AuthInput
                  type="email"
                  placeholder={t('auth.emailPlaceholder')}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => handleChange('email', e.target.value)}
                  error={!!fieldErrors.email}
                />
                {fieldErrors.email && (
                  <AuthErrorText>
                    {fieldErrors.email}
                  </AuthErrorText>
                )}
              </Box>

              <Box sx={{ mb: 3 }}>
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
              </Box>

            <AuthButton
              onClick={handleAuth}
              disabled={loading}
              fullWidth
              variant="contained"
              size="large"
            >
              {loading
                ? <CircularProgress size={24} color="inherit" />
                : (isNewUser ? t('auth.signUp') : t('auth.signIn'))
              }
            </AuthButton>

              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mt: 3
              }}>
                <Typography variant="body2" color="text.secondary">
                  {isNewUser ? t('auth.alreadyAccount') : t('auth.noAccount')}
                </Typography>
                <AuthFooterLink
                  onClick={() => setIsNewUser(!isNewUser)}
                  sx={{ ml: 1 }}
                >
                  {isNewUser ? t('auth.signIn') : t('auth.signUp')}
                </AuthFooterLink>
              </Box>
            </AuthForm>
          </AuthFormContainer>
        </AuthLeftPanel>
        <Box
  sx={{
    background: `linear-gradient(135deg, #578acd 0%, #38639a 100%)`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    p: '0 40px',
    position: 'relative',
    overflow: 'hidden',
    borderLeft: '1px solid rgba(255,255,255,0.1)',
    maxWidth:{xs:'100%', sm:'54%'}
  }}
>
  <SpaceAnimation />

  <Box
    sx={{
      position: 'relative',
      zIndex: 1,
      maxWidth: 900,
      width: '100%',
      textAlign: 'center',
      color: 'common.white',
      mx: 'auto',
      mt:-10,
    }}
  >

    <Box sx={{
      textAlign: 'center',
      mt:12.5,
      mb: 4,
      position: 'relative',
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        width: '30%',
        height: '1px',
        background: '#ffffff',
      },
      '&::before': {
        left: 0
      },
      '&::after': {
        right: 0
      }
    }}>
      <Typography
        variant="h5"
        component="h3"
        sx={{
          display: 'inline-block',
          px: 3,
          fontWeight: 600,
          background: '#ffffff',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          position: 'relative',
          zIndex: 1
        }}
      >
        {t('auth.title')}
      </Typography>
    </Box>

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
    background: 'linear-gradient(90deg, rgba(10, 37, 64, 0) 0%, #0A2540 100%)',
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
          ? 'rgba(87,138,205,0.15)'
          : 'rgba(255,255,255,0.03)',
        borderRadius: 2,
        height: '100%',
        textAlign: 'left',
        transition: 'all 0.3s ease',
        flexShrink: 0,
        border: videoIndex === idx
          ? '1px solid #fff'
          : '1px solid rgba(255,255,255,0.08)',
        boxShadow: videoIndex === idx
          ? '0 0 20px rgba(87,138,205,0.4)'
          : '0 2px 8px rgba(0,0,0,0.15)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          backgroundColor: 'rgba(87,138,205,0.1)',
          transform: 'translateY(-4px)',
          borderColor: '#fff'
        },
        // Efeito de onda quando selecionado
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          background: '#fff',
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
          backgroundColor: 'rgba(0,0,0,0.7)',
          borderRadius: '12px',
          px: 1.5,
          py: 0.5
        }}>
          <Box sx={{
            width: 8,
            height: 8,
            backgroundColor: '#578acd',
            borderRadius: '50%',
            mr: 1,
            animation: 'pulse 1.5s infinite'
          }} />
          <Typography variant="caption" sx={{
            color: '#fff',
            fontWeight: 500,
            fontSize: '0.7rem',
            letterSpacing: '0.5px'
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
            color: videoIndex === idx ? '#ffffff' : 'rgba(255,255,255,0.6)',
            position: 'relative',
            zIndex: 1
          }
        })}
      </Box>

      <Typography
        variant="subtitle1"
        fontWeight="600"
        sx={{
          color: videoIndex === idx ? '#fff' : 'rgba(255,255,255,0.9)',
          mb: 1,
          transition: 'color 0.3s ease'
        }}
      >
        {item.title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          opacity: 0.85,
          color: 'rgba(255,255,255,0.7)',
          lineHeight: 1.5,
          fontSize: '0.9rem'
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
          background: 'rgba(255,255,255,0.1)',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '30%', // Simula progresso do vídeo
            background: '#578acd',
            animation: 'progress 5s linear infinite'
          }
        }} />
      )}
    </Box>
  ))}
</Box>

</Box>
  </Box>
</Box>


      </AuthContainer>
    </GoogleOAuthProvider>
  );
};

export default Auth;
