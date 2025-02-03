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
import AuthCoverImage from '../../images/improved_image.png';
import LogoImage from '../../images/logo.png';
import AllInOneService from '../../services/all-in-one.service.ts';
import { useLocalStorage } from '../../hooks/useLocalStorage.ts';
import { useNavigate } from 'react-router-dom';
import i18n from '../../i18next.js';
import { useSnackbar } from 'notistack';

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
        enqueueSnackbar(
          i18n.t('error.authError'),
          { variant: "error" }
        );
      });
  };

  useEffect(() => {
    if (token) navigate('/dashboard');
  }, [token]);

  return (
    <AuthContainer>
      <AuthContainerLeft>
        <AuthContainerElements>
          <AuthContainerLeftLogo src={LogoImage} alt="Logo" />
          {!isNewUser ? (
            <>
              <AuthContainerLeftLabelInput>
                {i18n.t('auth.email')}
              </AuthContainerLeftLabelInput>
              <AuthContainerLeftInput
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />

              <AuthContainerLeftLabelPassword>
                {i18n.t('auth.password')}
              </AuthContainerLeftLabelPassword>
              <AuthContainerLeftPassword
                type="password"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />

              <AuthContainerLeftButton onClick={handleAuth} disabled={loading}>
                {loading ? (
                  <LoadingIcon className="loading-icon" />
                ) : (
                  i18n.t('auth.signIn')
                )}
              </AuthContainerLeftButton>

              <AuthContainerLeftForgotSignup>
                {i18n.t('auth.noAccount')}{' '}
                <AuthContainerLeftForgotSignupLink
                  onClick={() => setIsNewUser(true)}
                >
                  {i18n.t('auth.signUp')}
                </AuthContainerLeftForgotSignupLink>
              </AuthContainerLeftForgotSignup>

              <AuthContainerLeftForgotPassword>
                {i18n.t('auth.forgotPassword')}
              </AuthContainerLeftForgotPassword>
            </>
          ) : (
            <>
              <AuthContainerLeftLabelInput>
                {i18n.t('auth.name')}
              </AuthContainerLeftLabelInput>
              <AuthContainerLeftInput
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />

              <AuthContainerLeftLabelInput>
                {i18n.t('auth.cellphone')}
              </AuthContainerLeftLabelInput>
              <AuthContainerLeftInput
                onChange={(e) => setUser({ ...user, cellphone: e.target.value })}
              />

              <AuthContainerLeftLabelInput>
                {i18n.t('auth.email')}
              </AuthContainerLeftLabelInput>
              <AuthContainerLeftInput
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />

              <AuthContainerLeftLabelPassword>
                {i18n.t('auth.password')}
              </AuthContainerLeftLabelPassword>
              <AuthContainerLeftPassword
                type="password"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />

              <AuthContainerLeftLabelPassword>
                {i18n.t('auth.birthDate')}
              </AuthContainerLeftLabelPassword>
              <AuthContainerLeftPassword
                type="date"
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) =>
                  setUser({ ...user, birthDate: e.target.value })
                }
              />

              <AuthContainerLeftLabelPassword>
                {i18n.t('auth.gender')}
              </AuthContainerLeftLabelPassword>
              <select
                style={{
                  height: '40px',
                  borderRadius: '5px',
                  border: '0.5px grey solid',
                }}
                value={user.gender}
                onChange={(e) =>
                  setUser({ ...user, gender: e.target.value })
                }
              >
                <option value="">{i18n.t('auth.select')}</option>
                {genderOptions.map((gender, idx) => (
                  <option key={idx} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>

              <AuthContainerLeftButton onClick={handleAuth} disabled={loading}>
                {loading ? (
                  <LoadingIcon className="loading-icon" />
                ) : (
                  i18n.t('auth.signUp')
                )}
              </AuthContainerLeftButton>

              <AuthContainerLeftForgotSignup>
                {i18n.t('auth.alreadyAccount')}{' '}
                <AuthContainerLeftForgotSignupLink
                  onClick={() => setIsNewUser(false)}
                >
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
  );
};

export default Auth;
