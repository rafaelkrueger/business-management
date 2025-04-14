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

const clientId = "1008084799451-u095ep4ps18ej4l28i571osdssnomtmp.apps.googleusercontent.com";

const Auth = () => {
  const [isNewUser, setIsNewUser] = useState(true);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useLocalStorage('accessToken', null);
  const { enqueueSnackbar } = useSnackbar();
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
          setToken(res.data);
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
    if (token) navigate('/dashboard');
  }, [token, navigate]);

  const errorStyle = { color: '#E57373', fontSize: '12px', marginTop: '-15px', marginBottom: '12px' };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthContainer>
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
