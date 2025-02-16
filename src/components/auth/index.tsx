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
import AuthCoverImage from '../../images/improved_image.png';
import LogoImage from '../../images/logo.png';
import AllInOneService from '../../services/all-in-one.service.ts';
import { useLocalStorage } from '../../hooks/useLocalStorage.ts';
import { useNavigate } from 'react-router-dom';
import i18n from '../../i18next.js';
import { jwtDecode } from 'jwt-decode';
import { useSnackbar } from 'notistack';

//ALTERAR AQUI
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

  useEffect(()=>{if(token){
    navigate('/dashboard');
  }},[token])

  const handleAuth = () => {
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
  }

  const handleGoogleSuccess = async (response) => {
    const { credential, clientId } = response || {};

    if (credential) {
      const decodedCredential = jwtDecode(credential);
      const { email, name, sub } = decodedCredential || {};
      if (email) {
        if (isNewUser) {
          AllInOneService.create({
            name: name || 'No Name',
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
  }, [token]);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthContainer>
        <AuthContainerLeft>
          <AuthContainerElements>
            <AuthContainerLeftLogo src={LogoImage} alt="Logo" />

            {/* Inputs normais de login/cadastro */}
            {!isNewUser ? (
              <>
              <div style={{marginTop:'40px'}}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => enqueueSnackbar(i18n.t('error.authError'), { variant: "error" })}
                  />
              </div>
              <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBlock: '20px',
                  justifyContent: 'center'
                }}>
                  <hr style={{
                    flex: 1,
                    border: 'none',
                    borderTop: '1px solid #ccc'
                  }} />
                  <span style={{
                    margin: '0 10px',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>Or</span>
                  <hr style={{
                    flex: 1,
                    border: 'none',
                    borderTop: '1px solid #ccc'
                  }} />
                </div>
                <AuthContainerLeftLabelInput>{i18n.t('auth.email')}</AuthContainerLeftLabelInput>
                <AuthContainerLeftInput
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />

                <AuthContainerLeftLabelPassword>{i18n.t('auth.password')}</AuthContainerLeftLabelPassword>
                <AuthContainerLeftPassword
                  type="password"
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                />

                <AuthContainerLeftButton onClick={handleAuth} disabled={loading}>
                  {loading ? <LoadingIcon className="loading-icon" /> : i18n.t('auth.signIn')}
                </AuthContainerLeftButton>

                <AuthContainerLeftForgotSignup>
                  {i18n.t('auth.noAccount')}{' '}
                  <AuthContainerLeftForgotSignupLink onClick={() => setIsNewUser(true)}>
                    {i18n.t('auth.signUp')}
                  </AuthContainerLeftForgotSignupLink>
                </AuthContainerLeftForgotSignup>

                <AuthContainerLeftForgotPassword>{i18n.t('auth.forgotPassword')}</AuthContainerLeftForgotPassword>
              </>
            ) : (
              <>
              <div style={{marginTop:'20px'}}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => enqueueSnackbar(i18n.t('error.authError'), { variant: "error" })}
                  />
              </div>
              <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBlock: '20px',
                  justifyContent: 'center'
                }}>
                  <hr style={{
                    flex: 1,
                    border: 'none',
                    borderTop: '1px solid #ccc'
                  }} />
                  <span style={{
                    margin: '0 10px',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>Or</span>
                  <hr style={{
                    flex: 1,
                    border: 'none',
                    borderTop: '1px solid #ccc'
                  }} />
                </div>
                <AuthContainerLeftLabelInput>{i18n.t('auth.name')}</AuthContainerLeftLabelInput>
                <AuthContainerLeftInput onChange={(e) => setUser({ ...user, name: e.target.value })} />

                <AuthContainerLeftLabelInput>{i18n.t('auth.cellphone')}</AuthContainerLeftLabelInput>
                <AuthContainerLeftInput onChange={(e) => setUser({ ...user, cellphone: e.target.value })} />

                <AuthContainerLeftLabelInput>{i18n.t('auth.email')}</AuthContainerLeftLabelInput>
                <AuthContainerLeftInput type="email" onChange={(e) => setUser({ ...user, email: e.target.value })} />

                <AuthContainerLeftLabelPassword>{i18n.t('auth.password')}</AuthContainerLeftLabelPassword>
                <AuthContainerLeftPassword type="password" onChange={(e) => setUser({ ...user, password: e.target.value })} />

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
