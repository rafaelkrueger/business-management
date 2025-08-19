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
  MainModuleIndicator,
  ExpandIcon
} from './styles.ts';
// @ts-ignore
import UserNoImage from '../../images/user.png';
import { CiCreditCard1 } from "react-icons/ci";
import { IoIosHome } from "react-icons/io";
import { FaMoneyBill } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { IoMdChatboxes } from "react-icons/io";
import { TiBusinessCard } from "react-icons/ti";
import { MdSell, MdOutlineAdsClick } from "react-icons/md";
import { FaCalendar } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";
import { FiSettings, FiLogOut, FiLink } from "react-icons/fi";
import { IoChevronForward } from "react-icons/io5";
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
  CampaignIcon: CampaignIcon,
  MdOutlineAdsClick: MdOutlineAdsClick
};

interface Module {
  key: string;
  icon: string;
  name?: string;
}

const Sidebar: React.FC<{
  isMenuActive: boolean,
  setIsMenuActive: any,
  activateModule: any,
  userData: any,
  activeCompany: string,
  setActiveCompany: any,
  companies: any,
  setCompanies: any,
  setHasNoCompanies: any,
  hasNoCompanies: any,
  modulesUpdating: any,
  isCollapsed: boolean,
  setIsCollapsed: any
}> = ({ ...props }) => {
  const { t } = useTranslation();
  const [mainModule, setMainModule] = useState<Module | null>(null);
  const [supportModules, setSupportModules] = useState<Module[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const options = props.companies.map((company) => ({
    value: company.id,
    label: (
      <div style={{ color: 'black' }}>
        <img src={company.logo} alt={company.name} style={{ width: '20px', marginRight: '10px' }} />
        {company.name}
      </div>
    ),
  }));

  // Função para alternar o estado colapsado
  const toggleCollapse = () => {
    props.setIsCollapsed(!props.isCollapsed);
    setHoveredItem(null);
  };

  // Função para gerenciar hover de cada item individualmente
  const handleMouseEnter = (itemKey: string) => {
    if (props.isCollapsed) {
      setHoveredItem(itemKey);
    }
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

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
          const validModules = res.data.filter((module: Module) => module?.key);

          const marketingModule = validModules.find((module: Module) => module.key === 'marketing');
          const otherModules = validModules.filter((module: Module) => module.key !== 'marketing');

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

    return <IconComponent size={24} color="white" />;
  }

  const renderModuleItem = (module: Module, isMainModule = false) => {
    const moduleName = t(`config.establishmentModules.${module.key}`);
    const itemKey = `module-${module.key}`;

    return (
      <Tooltip
        key={itemKey}
        title={moduleName}
        placement="right"
        arrow
        open={props.isCollapsed && hoveredItem === itemKey}
        disableHoverListener={!props.isCollapsed}
      >
        <div
          onMouseEnter={() => handleMouseEnter(itemKey)}
          onMouseLeave={handleMouseLeave}
        >
          <SidebarContainerBodyElementContainer
            onClick={() => {
              if (window.outerWidth < 600) {
                props.setIsMenuActive(!props.isMenuActive);
              }
              props.activateModule(module.key);
            }}
            style={{
              backgroundColor: isMainModule ? 'rgba(0, 168, 255, 0.1)' : 'transparent',
              borderLeft: isMainModule ? '4px solid #578acd' : 'none',
              justifyContent: props.isCollapsed ? 'center' : 'flex-start',
              padding: props.isCollapsed ? '12px 8px' : '12px 15px'
            }}
          >
            <Box sx={{
              marginRight: props.isCollapsed ? '0' : '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SidebarContainerBodyElementIcon icon={`<${module.icon} size={24} />`} />
            </Box>

            {!props.isCollapsed && (
              <SidebarContainerBodyElement>
                {moduleName}
                {isMainModule && <MainModuleIndicator>{t('mainModuleTag')}</MainModuleIndicator>}
              </SidebarContainerBodyElement>
            )}
          </SidebarContainerBodyElementContainer>
        </div>
      </Tooltip>
    );
  };

  const renderFooterItem = (icon: React.ReactNode, label: string, onClick: () => void, itemKey: string) => {
    return (
      <Tooltip
        title={label}
        placement="right"
        arrow
        open={props.isCollapsed && hoveredItem === itemKey}
        disableHoverListener={!props.isCollapsed}
      >
        <div
          onMouseEnter={() => handleMouseEnter(itemKey)}
          onMouseLeave={handleMouseLeave}
        >
          <SidebarContainerBodyElementContainer
            onClick={onClick}
            style={{
              justifyContent: props.isCollapsed ? 'center' : 'flex-start',
              padding: props.isCollapsed ? '12px 8px' : '12px 15px',
              marginBottom: '5px'
            }}
          >
            <Box sx={{
              marginRight: props.isCollapsed ? '0' : '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {icon}
            </Box>

            {!props.isCollapsed && (
              <SidebarContainerBodyElement>
                {label}
              </SidebarContainerBodyElement>
            )}
          </SidebarContainerBodyElementContainer>
        </div>
      </Tooltip>
    );
  };

  return (
    <SidebarContainer isCollapsed={props.isCollapsed}>
      <SidebarContainerHeader>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ExpandIcon onClick={toggleCollapse} isCollapsed={props.isCollapsed}>
                <IoChevronForward size={16} />
                <IoChevronForward size={16} style={{ marginLeft: '-8px' }} />
              </ExpandIcon>
              <div style={{ marginTop: '20px' }}>
                <SidebarContainerHeaderProfile
                  src={UserNoImage}
                  style={{
                    width: props.isCollapsed ? '40px' : '50px',
                    height: props.isCollapsed ? '40px' : '50px'
                  }}
                />
              </div>
            </div>
            {!props.isCollapsed && (
              <SidebarContainerHeaderProfileName>{props.userData.name}</SidebarContainerHeaderProfileName>
            )}
          </div>
        </div>

        {!props.isCollapsed && (
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
        )}
      </SidebarContainerHeader>

      <SidebarContainerBody isCollapsed={props.isCollapsed}>
        {!props.isCollapsed && (
          <SupportModuleLabel>
            {t('mainModules')}
          </SupportModuleLabel>
        )}

        {mainModule && mainModule.key && renderModuleItem(mainModule, true)}

        {supportModules.length > 0 && !props.isCollapsed && (
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <SupportModuleLabel>{t('supportModules')}</SupportModuleLabel>
            <Tooltip title={t('supportModulesTooltip') || "Esses módulos complementam e ajudam o módulo de marketing"}>
              <IconButton sx={{ padding: 0, color:'rgba(255, 255, 255, 0.6)', fontSize:'8pt', width:'14px', marginBottom:'-3px' }}>
                <HelpCircleIcon fontSize='8pt' />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Módulos de Apoio */}
        {supportModules.filter(module => module.key).map((module) => renderModuleItem(module))}
      </SidebarContainerBody>

      <SidebarContainerFooter>
        {!props.isCollapsed && (
          <SupportModuleLabel>{t('settings')}</SupportModuleLabel>
        )}

        {renderFooterItem(
          <FiLink size={20} color="white" />,
          t('integrations'),
          () => {
            if (window.outerWidth < 600) {
              props.setIsMenuActive(!props.isMenuActive);
            }
            props.activateModule('integration');
          },
          'footer-integrations'
        )}

        {renderFooterItem(
          <FiSettings size={20} color="white" />,
          t('configurations'),
          () => {
            if (window.outerWidth < 600) {
              props.setIsMenuActive(!props.isMenuActive);
            }
            props.activateModule('config');
          },
          'footer-config'
        )}

        {renderFooterItem(
          <FiLogOut size={20} color="white" />,
          'Logout',
          () => {
            localStorage.removeItem('accessToken');
            window.location.replace('/');
          },
          'footer-logout'
        )}
      </SidebarContainerFooter>
    </SidebarContainer>
  );
};

export default Sidebar;