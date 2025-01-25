import React, { useState, useEffect } from 'react'
import { AuthContainer, AuthContainerElements, AuthContainerLeft, AuthContainerLeftButton, AuthContainerLeftForgotPassword, AuthContainerLeftForgotSignup, AuthContainerLeftInput, AuthContainerLeftLabelInput, AuthContainerLeftLabelPassword, AuthContainerLeftPassword, AuthContainerRight, AuthContainerRightImage, AuthContainerLeftForgotSignupLink, AuthContainerLeftLogo } from './styles.ts'
import AuthCoverImage from '../../images/improved_image.png';
import LogoImage from '../../images/logo.png';
import LogoImageResponsive from '../../images/logo-auth.jpeg';
import { useMutation } from '@tanstack/react-query';
import AllInOneService from '../../services/all-in-one.service.ts';
import { useLocalStorage } from '../../hooks/useLocalStorage.ts';
import { useNavigate } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { LoadingIcon } from '../../global.styles.ts';
import { AlertAdapter } from '../../global.components.tsx';

const Auth: React.FC = () => {
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useLocalStorage('accessToken', null)
  const navigate = useNavigate()
  const [user, setUser] = useState({
    name: '',
    email: '',
    cellphone: '',
    password: '',
    gender: '',
    birthDate: '',
  })

  const genderOptions = [
    {
      gender:'Masculino'
    },
    {
      gender:'Feminino'
    },
    {
      gender:'Prefiro não opinar'
    },
  ]

  const getUser = () =>{
    setLoading(true);
    AllInOneService.get(user).then((res)=>{
      if(res.data){
        setLoading(false);
        setToken(res.data);
      }
    }).catch((err)=>{
      AlertAdapter('Usuário não encontrado', 'error');
      setLoading(false);
      console.log(err)
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getUser();
    }
  };

  const insertUser = () =>{
    setLoading(true)
    AllInOneService.create(user).then((res)=>{
      if(res.data && res.status === 201){
        setLoading(false);
        setToken(res.data);
      }
    }).catch((err)=>{
      setLoading(false);
      AlertAdapter(err, 'error')
      console.log(err)
    })
  }

  useEffect(()=>{
    if(token){
      navigate('/dashboard');
    }
  },[token])


  return (
    <AuthContainer>
      <AuthContainerLeft onKeyDown={handleKeyPress}>
        <AuthContainerElements>
        {!isNewUser?
        <>
        <AuthContainerLeftLogo src={window.outerWidth <=600?LogoImage:LogoImage} />
        <AuthContainerLeftLabelInput>
              Email
            </AuthContainerLeftLabelInput><AuthContainerLeftInput
                onChange={(e: { target: { value: any; }; }) => {
                  setUser({ ...user, email: e.target.value });
                } } /><AuthContainerLeftLabelPassword>
                Senha
          </AuthContainerLeftLabelPassword><AuthContainerLeftPassword  type="password" onChange={(e: { target: { value: any; }; }) => {
            setUser({ ...user, password: e.target.value });
          } } /><AuthContainerLeftButton onClick={getUser}>{loading?<LoadingIcon size={26}/>:'Entrar'}</AuthContainerLeftButton><div style={{ textAlign: 'center' }}>
            <AuthContainerLeftForgotSignup>Não tem uma conta ainda? <AuthContainerLeftForgotSignupLink onClick={()=>{setIsNewUser(!isNewUser)}}>Registre-se</AuthContainerLeftForgotSignupLink></AuthContainerLeftForgotSignup>
            <AuthContainerLeftForgotPassword>Esqueci minha senha</AuthContainerLeftForgotPassword>
          </div>
        </>
        :
        <>
          <AuthContainerLeftLogo src={LogoImage} style={{marginTop:'-12%'}} />
          <AuthContainerLeftLabelInput style={{marginTop:window.outerWidth > 600? '-10%': '-20%'}}>
              Nome
          </AuthContainerLeftLabelInput>
          <AuthContainerLeftInput
                onChange={(e: { target: { value: any; }; }) => {
                  setUser({ ...user, name: e.target.value });
          }}/>
          <AuthContainerLeftLabelInput style={{marginTop:'-5%'}}>
              Número
          </AuthContainerLeftLabelInput>
          <AuthContainerLeftInput
                onChange={(e: { target: { value: any; }; }) => {
                  setUser({ ...user, cellphone: e.target.value });
          }}/>
          <AuthContainerLeftLabelInput style={{marginTop:'-5%'}}>
              Email
          </AuthContainerLeftLabelInput>
          <AuthContainerLeftInput
                onChange={(e: { target: { value: any; }; }) => {
                  setUser({ ...user, email: e.target.value });
          }}/>
          <AuthContainerLeftLabelPassword style={{marginTop:'-5%'}}>
                Senha
          </AuthContainerLeftLabelPassword>
          <AuthContainerLeftPassword type="password" onChange={(e: { target: { value: any; }; }) => {
            setUser({ ...user, password: e.target.value });
          } } />
          <div style={{display:'flex', marginTop:'1%',  justifyContent:'space-between', width:'100%'}}>
            <div style={{display:'flex', flexDirection:'column'}}>
              <AuthContainerLeftLabelPassword style={{marginTop:window.outerWidth > 600? '-15%': '-5%', marginBottom:window.outerWidth > 600? '0%': '2%'}}>
                    Dt. Nasc
              </AuthContainerLeftLabelPassword>
              <AuthContainerLeftPassword type="date"
                style={{marginRight:'5%', width:'90%'}}
                value={user.birthDate}
                onChange={(e) => setUser({...user, birthDate:e.target.value})}
                max={new Date().toISOString().split('T')[0]} // restrict to today's date or before
              />
            </div>
            <div style={{display:'flex', flexDirection:'column', marginLeft:'7%'}}>
          <AuthContainerLeftLabelPassword style={{marginTop:window.outerWidth > 600? '-12%': '-5%', marginBottom:window.outerWidth > 600? '0%': '-2%'}}>
                Gênero
          </AuthContainerLeftLabelPassword>
          <select
          style={{width:'100%', height:window.outerWidth > 600? '70%': '60%', marginTop:window.outerWidth > 600? '0%': '4%'}}
            value={user.gender}
            onChange={(e) => setUser({...user, gender:e.target.value})}
          >
            <option value="">Selecione uma opção</option>
            {genderOptions.map((option, index) => (
              <option key={index} value={option.gender}>
                {option.gender}
              </option>
            ))}
          </select>
            </div>
          </div>

          <AuthContainerLeftButton onClick={insertUser} style={{marginTop:window.outerWidth > 600? '5%': '10%'}}>{loading?<LoadingIcon size={23}/>:'Registre-se'}</AuthContainerLeftButton>
          <div style={{ textAlign: 'center' }}>
            <AuthContainerLeftForgotSignup>Já tem uma conta? <AuthContainerLeftForgotSignupLink onClick={()=>{setIsNewUser(!isNewUser)}}>Entre</AuthContainerLeftForgotSignupLink></AuthContainerLeftForgotSignup>
          </div>

        </>
        }
      </AuthContainerElements>
      </AuthContainerLeft>
      <AuthContainerRight>
        <AuthContainerRightImage src={AuthCoverImage}/>
      </AuthContainerRight>
    </AuthContainer>
  );
}

export default Auth;