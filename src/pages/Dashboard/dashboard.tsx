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
import Command from '../../components/command/index.tsx';
import CreateEnterpriseModal from '../../components/register-enterprise/index.tsx';
import Maintenance from '../../components/maintenence/index.tsx';
import Config from '../../components/config/index.tsx';
import Tracking from '../../components/smart-tag/index.tsx';
import MarketingDashboard from '../../components/marketing/index.tsx';

const Dashboard: React.FC = () => {
  const [companies, setCompanies] = useState([]);
  const [isMenuActive, setIsMenuActive] = useState<boolean>(true);
  const [token, setToken] = useLocalStorage('accessToken', null);
  const { activeModuleName, activateModule } = useActiveModule(modules);
  const { activeCompany, changeActiveCompany } = useActiveCompanies(companies);
  const [hasNoCompanies, setHasNoCompanies] = useState(false);
  const [modulesUpdating, setModulesUpdating] = useState(false);

  const { userData, setUserData } = useUser();

  useEffect(() => {
    if (token) {
      AllInOneService.getUserByToken(token)
        .then((res) => setUserData(res.data))
    }
  }, [token]);

  return (
    <DashboardContainer>
      {userData._id && hasNoCompanies && (
       <CreateEnterpriseModal userData={userData} isOpen={hasNoCompanies} onClose={()=>{setHasNoCompanies(false)}}/>
      )}
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
          setHasNoCompanies={setHasNoCompanies}
          hasNoCompanies={hasNoCompanies}
          modulesUpdating={modulesUpdating}
          />
      )}
      {isMenuActive && window.outerWidth < 600 ? '' : (
        <DashboardContainerShowed>
          {/* <Maintenance/> */}
          {activeModuleName === 'home' && <Home activeCompany={activeCompany} userData={userData} activateModule={activateModule} />}
          {activeModuleName === 'payments' && <Payments activeCompany={activeCompany} />}
          {activeModuleName === 'products' && <Products activeCompany={activeCompany} />}
          {activeModuleName === 'customers' && <Customers activeCompany={activeCompany} />}
          {activeModuleName === 'employees' && <Employees activeCompany={activeCompany} />}
          {activeModuleName === 'calendar' && <Calendar activeCompany={activeCompany} userData={userData}/>}
          {activeModuleName === 'orders' && <Command activeCompany={activeCompany} userData={userData} />}
          {activeModuleName === 'online' && <Tracking userData={userData} activeCompany={activeCompany} />}
          {activeModuleName === 'marketing' && <MarketingDashboard activeCompany={activeCompany} />}
          {activeModuleName === 'Config' && <Config userData={userData} activeCompany={activeCompany} modulesUpdating={modulesUpdating} setModulesUpdating={setModulesUpdating} />}
        </DashboardContainerShowed>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;