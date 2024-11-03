import { useEffect, useState } from 'react';

const useActiveCompany = (initialCompany:any = null) => {
  const [activeCompany, setActiveCompany] = useState(initialCompany);

  useEffect(() => {
    if (initialCompany) {
      setActiveCompany(initialCompany[0]?.id);
    }
  }, [initialCompany]);

  useEffect(() => {
    if (activeCompany !== null) {
      localStorage.setItem('activeCompany', activeCompany);
    } else {
      localStorage.removeItem('activeCompany');
    }
  }, [activeCompany]);

  const changeActiveCompany = (newCompanyId) => {
    setActiveCompany(newCompanyId);
  };

  const clearActiveCompany = () => {
    setActiveCompany(null);
  };

  return { activeCompany, changeActiveCompany, clearActiveCompany };
};

export default useActiveCompany;