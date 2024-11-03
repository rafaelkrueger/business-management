import React, { useState, useEffect } from 'react';
import { DashboardContainer, DashboardContainerIcon, DashboardContainerShowed } from './styles.ts';
import Sidebar from '../../components/sidebar/index.tsx';
import { useLocalStorage } from '../../hooks/useLocalStorage.ts';
import AllInOneService from '../../services/all-in-one.service.ts';
import Payments from '../../components/payments/index.tsx';
import Home from '../../components/home/index.tsx';
import useActiveModule from '../../hooks/moduleHook.ts';
import { dashboardModules as modules } from '../../components/sidebar/index.tsx';
import Customers from '../../components/customers/index.tsx';
import useUser from '../../hooks/useUser.ts';
import HomeService from '../../services/home.service.ts';
import useActiveCompanies from '../../hooks/useActiveCompanies.ts';
import Products from '../../components/products/index.tsx';
import Employees from '../../components/employees/index.tsx';
import Calendar from '../../components/calendar/index.tsx';

const Dashboard: React.FC = () => {
  const [companies, setCompanies] = useState([]);
  const [isMenuActive, setIsMenuActive] = useState<boolean>(true);
  const [token, setToken] = useLocalStorage('accessToken', null);
  const { activeModuleName, activateModule } = useActiveModule(modules);
  const { activeCompany, changeActiveCompany } = useActiveCompanies(companies);

  const { userData, setUserData } = useUser();

  useEffect(() => {
    if (token) {
      AllInOneService.getUserByToken(token)
        .then((res) => setUserData(res.data))
    }
  }, [token]);


  return (
    <DashboardContainer>
      {window.outerWidth > 600 ? '' : (
        <DashboardContainerIcon onClick={() => setIsMenuActive(!isMenuActive)} />
      )}
      {isMenuActive && (
        <Sidebar
        isMenuActive={isMenuActive}
        setIsMenuActive={setIsMenuActive}
        activateModule={activateModule}
        userData={userData}
        activeCompany={activeCompany}
        setActiveCompany={changeActiveCompany}
        companies={companies}
        setCompanies={setCompanies}
        />
      )}
      {isMenuActive && window.outerWidth < 600 ? '' : (
        <DashboardContainerShowed>
          {activeModuleName === 'Home' && <Home activeCompany={activeCompany} userData={userData} activateModule={activateModule} />}
          {activeModuleName === 'Pagamentos' && <Payments activeCompany={activeCompany} />}
          {activeModuleName === 'Produtos' && <Products activeCompany={activeCompany} />}
          {activeModuleName === 'Clientes' && <Customers activeCompany={activeCompany} />}
          {activeModuleName === 'Funcionários' && <Employees activeCompany={activeCompany} />}
          {activeModuleName === 'Calendário' && <Calendar activeCompany={activeCompany} userData={userData}/>}
        </DashboardContainerShowed>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;