import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  SidebarContainer,
  SidebarContainerBody,
  SidebarContainerBodyElement,
  SidebarContainerBodyElementContainer,
  SidebarContainerBodyElementIcon,
  SidebarContainerFooter,
  SidebarContainerHeader,
  SidebarContainerHeaderProfile,
  SidebarContainerHeaderProfileName,
  SupportModuleLabel,
  MainModuleIndicator
} from './styles.ts';
import UserNoImage from '../../images/user.png';
import { CiCreditCard1 } from "react-icons/ci";
import { IoIosHome } from "react-icons/io";
import { FaMoneyBill } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { IoMdChatboxes } from "react-icons/io";
import { TiBusinessCard } from "react-icons/ti";
import { MdSell } from "react-icons/md";
import { FaCalendar } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import HomeService from '../../services/home.service.ts';
import CampaignIcon from '@mui/icons-material/Campaign';
import Select from 'react-select';
import ModulesService from '../../services/modules.service.ts';
import { Box, IconButton, Tooltip } from '@mui/material';
import { HelpCircleIcon } from 'lucide-react';

const icons = {
  IoIosHome: IoIosHome,
  FaMoneyBill: FaMoneyBill,
  MdSell: MdSell,
  RiAdminLine: RiAdminLine,
  TiBusinessCard: TiBusinessCard,
  FaCalendar: FaCalendar,
  CiCreditCard1: CiCreditCard1,
  CgWebsite: CgWebsite,
  CampaignIcon: CampaignIcon
};

const Sidebar: React.FC<{
  isMenuActive: boolean,
  setIsMenuActive: any,
  activateModule,
  userData,
  setActiveCompany,
  companies,
  setCompanies,
  setHasNoCompanies,
  hasNoCompanies,
  modulesUpdating
}> = ({ ...props }) => {
  const { t } = useTranslation();
  const [mainModule, setMainModule] = useState(null);
  const [supportModules, setSupportModules] = useState([]);

  const options = props.companies.map((company) => ({
    value: company.id,
    label: (
      <div style={{ color: 'black' }}>
        <img src={company.logo} alt={company.name} style={{ width: '20px', marginRight: '10px' }} />
        {company.name}
      </div>
    ),
  }));

  useEffect(() => {
    if (props.userData._id) {
      HomeService.get(props.userData._id)
        .then((res) => {
          props.setCompanies(res.data);
          if (res.data.length === 0) {
            props.setHasNoCompanies(true);
          } else {
            props.activateModule('marketing');
          }
        });
    }
  }, [props.userData, props.hasNoCompanies, props.modulesUpdating]);

  useEffect(() => {
    if (props.activeCompany && props.companies.length > 0) {
      ModulesService.get(props.activeCompany)
        .then((res) => {
          // Filtra módulos que possuem key definida
          const validModules = res.data.filter(module => module?.key);

          const marketingModule = validModules.find(module => module.key === 'marketing');
          const otherModules = validModules.filter(module => module.key !== 'marketing');

          setMainModule(marketingModule || null);
          setSupportModules(otherModules);
        });
    }
  }, [props.activeCompany, props.companies, props.modulesUpdating]);

  function SidebarContainerBodyElementIcon({ icon }) {
    if (!icon) return null;

    const iconName = icon.match(/<(\w+)/)?.[1];
    const IconComponent = icons[iconName];

    if (!IconComponent) return null;

    return <IconComponent style={{ marginTop: '4%', marginRight: '5%', marginLeft: window.outerWidth > 600 ? '3%' : '13%' }} size={26} />;
  }

  return (
    <SidebarContainer>
      <SidebarContainerHeader>
        <SidebarContainerHeaderProfile src={UserNoImage} />
        <SidebarContainerHeaderProfileName>{props.userData.name}</SidebarContainerHeaderProfileName>
        <Select
          value={options.find(option => option.value === props.activeCompany)}
          onChange={(selectedOption) => props.setActiveCompany(selectedOption.value)}
          options={options}
          isSearchable={false}
          styles={{
            container: (provided) => ({
              ...provided,
              width: '100%',
            }),
            control: (provided) => ({
              ...provided,
              width: '100%',
            }),
          }}
        />
      </SidebarContainerHeader>
      <SidebarContainerBody>
          <SupportModuleLabel>
            {t('mainModules')}
          </SupportModuleLabel>
        {mainModule && mainModule.key && (
          <SidebarContainerBodyElementContainer
            key={mainModule.key}
            onClick={() => {
              if (window.outerWidth < 600) {
                props.setIsMenuActive(!props.isMenuActive);
              }
              props.activateModule(mainModule.key);
            }}
            style={{
              backgroundColor: 'rgba(0, 168, 255, 0.1)',
              borderLeft: '4px solid #00a8ff'
            }}
          >
            <Box sx={{marginRight:'10px'}}>
              <SidebarContainerBodyElementIcon icon={`<${mainModule.icon} size={26} />`} />
            </Box>
            <SidebarContainerBodyElement>
              {t(`config.establishmentModules.${mainModule.key}`)}
              <MainModuleIndicator>{t('mainModuleTag')}</MainModuleIndicator>
            </SidebarContainerBodyElement>
          </SidebarContainerBodyElementContainer>
        )}
        {supportModules.length > 0 && (
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <SupportModuleLabel>{t('supportModules')}</SupportModuleLabel>
          <Tooltip title={t('supportModulesTooltip') || "Esses módulos complementam e ajudam o módulo de marketing"}>
            <IconButton sx={{ padding: 0, color:'rgba(255, 255, 255, 0.6)', fontSize:'8pt', width:'14px', marginBottom:'-3px' }}>
              <HelpCircleIcon fontSize='8pt' />
            </IconButton>
          </Tooltip>
        </Box>
        )}

        {/* Módulos de Apoio (só mostra se tiver key) */}
        {supportModules.filter(module => module.key).map((module) => (
          <SidebarContainerBodyElementContainer
            key={module.key}
            onClick={() => {
              if (window.outerWidth < 600) {
                props.setIsMenuActive(!props.isMenuActive);
              }
              props.activateModule(module.key);
            }}
          >
            <SidebarContainerBodyElementIcon icon={`<${module.icon} size={26} />`} />
            <SidebarContainerBodyElement>
              {t(`config.establishmentModules.${module.key}`)}
            </SidebarContainerBodyElement>
          </SidebarContainerBodyElementContainer>
        ))}
      </SidebarContainerBody>
      <SidebarContainerFooter>
        <SidebarContainerBodyElement
          style={{ marginLeft: '6%', marginBottom:'17px', fontSize:'13pt' }}
        >
          {t(`notifications`)}
        </SidebarContainerBodyElement>
        <SidebarContainerBodyElement
          onClick={() => {
            if (window.outerWidth < 600) {
              props.setIsMenuActive(!props.isMenuActive);
            }
            props.activateModule('config');
          }}
          style={{ marginLeft: '6%', marginBottom:'17px', fontSize:'13pt' }}
        >
          {t(`configurations`)}
        </SidebarContainerBodyElement>
        <SidebarContainerBodyElement
          onClick={() => {
            localStorage.removeItem('accessToken');
            window.location.replace('/');
          }}
          style={{ marginLeft: '6%', marginBottom:'17px', fontSize:'13pt', cursor: 'pointer' }}
        >
          Logout
        </SidebarContainerBodyElement>
      </SidebarContainerFooter>
    </SidebarContainer>
  );
};

export default Sidebar;