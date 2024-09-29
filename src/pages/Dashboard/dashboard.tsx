import React, { useState, useEffect } from 'react';
import { DashboardContainer, DashboardContainerIcon, DashboardContainerShowed } from './styles.ts';
import Sidebar from '../../components/sidebar/index.tsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.ts';
import AllInOneService from '../../services/all-in-one.service.ts';
import Payments from '../../components/payments/index.tsx';
import Home from '../../components/home/index.tsx';
import useActiveModule from '../../hooks/moduleHook.ts';
import { dashboardModules as modules } from '../../components/sidebar/index.tsx';
import Customers from '../../components/Customers/index.tsx';

const Dashboard: React.FC = () => {
  const [isMenuActive, setIsMenuActive] = useState<boolean>(true);
  const [token, setToken] = useLocalStorage('accessToken', null);
  const { dashboardModules, activeModuleName, activateModule } = useActiveModule(modules);

  useEffect(() => {
    console.log(token);
    if (token) {
      AllInOneService.getUserByToken(token)
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
    }
  }, [token]); // Only run when token changes

  useEffect(()=>{
    console.log(activeModuleName);
  },[activeModuleName])

  return (
    <DashboardContainer>
      {window.outerWidth > 600 ? '' : (
        <DashboardContainerIcon onClick={() => setIsMenuActive(!isMenuActive)} />
      )}
      {isMenuActive && (
        <Sidebar isMenuActive={isMenuActive} setIsMenuActive={setIsMenuActive} activateModule={activateModule} />
      )}
      {isMenuActive && window.outerWidth < 600 ? '' : (
        <DashboardContainerShowed>
          {activeModuleName === 'Home' && <Home />}
          {activeModuleName === 'Pagamentos' && <Payments />}
          {activeModuleName === 'Clientes' && <Customers />}
        </DashboardContainerShowed>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;