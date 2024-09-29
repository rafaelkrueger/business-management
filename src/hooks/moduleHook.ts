import { useState } from 'react';

const useActiveModule = (initialModules) => {
  const [dashboardModules, setDashboardModules] = useState(initialModules);
  const [activeModuleName, setActiveModuleName] = useState('Home');

  const activateModule = (moduleName) => {
    const updatedModules = dashboardModules.map((module) => ({
      ...module,
      active: module.name === moduleName,
    }));
    setDashboardModules(updatedModules);
    setActiveModuleName(moduleName);
  };

  return {
    dashboardModules,
    activeModuleName,
    activateModule,
    setActiveModuleName,
  };
};

export default useActiveModule;