import React, { useState, useEffect } from 'react';
import { DashboardContainer, DashboardContainerIcon, DashboardContainerShowed } from './styles.ts';
import { useLocalStorage } from '../../hooks/useLocalStorage.ts';
import AllInOneService from '../../services/all-in-one.service.ts';
import Payments from '../../components/payments/index.tsx';
import Home from '../../components/home/index.tsx';
import useActiveModule from '../../hooks/moduleHook.ts';
import dashboardModules from '../../modules/modules.tsx';
import Sidebar from '../../components/sidebar/index.tsx';
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
import MobileSidebar from '../../components/sidebar/mobile/index.tsx';
import Tracking from '../../components/smart-tag/index.tsx';
import MarketingDashboard from '../../components/marketing/index.tsx';
import Integrations from '../../components/integrations/index.tsx';
import MobileMarketingDashboard from '../../components/marketing/mobile/index.tsx';
import MobileConfig from '../../components/config/mobile/index.tsx'
import EnterpriseService from '../../services/enterprise.service.ts';

const Dashboard: React.FC = () => {
  const [companies, setCompanies] = useState<any>([]);
  const [isMenuActive, setIsMenuActive] = useState<boolean>(true);
  const [token, setToken] = useLocalStorage('accessToken', null);
  const { activeModuleName, activateModule } = useActiveModule(dashboardModules);
  const { activeCompany, changeActiveCompany } = useActiveCompanies(companies);
  const [hasNoCompanies, setHasNoCompanies] = useState(false);
  const [modulesUpdating, setModulesUpdating] = useState(false);
  const [newCompany, setNewCompany] = useState(false);

  const { userData, setUserData } = useUser();

useEffect(() => {
  if (!token || userData) return;

  const interval = setInterval(() => {
    AllInOneService.getUserByToken(token)
      .then((res) => {
        if (res?.data) {
          setUserData(res.data);
          clearInterval(interval);
        }
      })
      .catch(console.error);
  }, 2000);

  return () => clearInterval(interval);
}, [token, userData]);


  useEffect(() => {
  if (!token) return;
  AllInOneService.getUserByToken(token)
    .then(async ({ data: user }) => {
      setUserData(user);
      if (hasNoCompanies) {
        const randomCompany = {
          userId:   user._id,
          name:     `company_${Math.floor(100000000 + Math.random()*900000000)}`,
          email:    user.email,
          phone:    user.cellphone,
          document: '',
          active:   true
        };

        const { data: newCompany } = await EnterpriseService.post(randomCompany);
        changeActiveCompany(newCompany);
        setCompanies([newCompany])
      }
    })
    .catch(console.error)
    .finally(()=>{
      setNewCompany(true);
    });
}, [token, hasNoCompanies]);

  return (
    <DashboardContainer>

      {window.outerWidth > 600 ? (
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
      ) : (
        <MobileSidebar
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

      <DashboardContainerShowed id="main-content">
        {activeModuleName === 'home' && <Home activeCompany={activeCompany} userData={userData} activateModule={activateModule} />}
        {activeModuleName === 'payments' && <Payments activeCompany={activeCompany} />}
        {activeModuleName === 'products' && <Products activeCompany={activeCompany} />}
        {activeModuleName === 'customers' && <Customers activeCompany={activeCompany} />}
        {activeModuleName === 'employees' && <Employees activeCompany={activeCompany} />}
        {activeModuleName === 'calendar' && <Calendar activeCompany={activeCompany} userData={userData} />}
        {activeModuleName === 'orders' && <Command activeCompany={activeCompany} userData={userData} />}
        {activeModuleName === 'online' && <Tracking userData={userData} activeCompany={activeCompany} />}
        {activeModuleName === 'marketing' ? window.outerWidth > 600 ? <MarketingDashboard activeCompany={activeCompany} /> : <MobileMarketingDashboard activeCompany={activeCompany} />  : ''}
        {activeModuleName === 'config' && activeCompany ? window.outerWidth > 600 ? <Config userData={userData} activeCompany={activeCompany} modulesUpdating={modulesUpdating} setModulesUpdating={setModulesUpdating} /> : <MobileConfig userData={userData} activeCompany={activeCompany} modulesUpdating={modulesUpdating} setModulesUpdating={setModulesUpdating} /> : ''}
        {activeModuleName === 'integration' && <Integrations />}
      </DashboardContainerShowed>
    </DashboardContainer>
  );
};

export default Dashboard;
