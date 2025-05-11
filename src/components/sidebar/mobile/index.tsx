import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import ColorThief from 'colorthief';
import { useTranslation } from 'react-i18next';
import { CgWebsite, CgChevronDown, CgChevronUp, CgExtension } from 'react-icons/cg';
import { CiCreditCard1 } from 'react-icons/ci';
import { FaMoneyBill, FaCalendar, FaMagic } from 'react-icons/fa';
import { IoIosHome, IoMdChatboxes, IoMdLogOut, IoMdNotifications } from 'react-icons/io';
import { MdSell } from 'react-icons/md';
import { RiAdminLine, RiSettingsLine } from 'react-icons/ri';
import { TiBusinessCard } from 'react-icons/ti';
import { BsBuilding, BsDot } from 'react-icons/bs';
import ModulesService from '../../../services/modules.service.ts';
import HomeService from '../../../services/home.service.ts';
import CampaignIcon from '@mui/icons-material/Campaign';
import { SidebarWrapper, TopSection, CompanyHeader, CompanyAvatar, CompanyLogo, CompanyPlaceholder, CompanyInfo, CompanyName, ChevronIcon, CompanyDropdown, CompanyOption, CompanyLogoWrapper, CompanyOptionInfo, CompanyOptionName, SelectedIndicator, GlowingDot, BottomSection, ModulesScroll, ModulesContainer, CompactModuleItem, CompactModuleIcon, CompactModuleLabel, LogoutItem, LogoutLabel } from './styles.ts';
import { Tooltip } from '@mui/material';

// Adicionando novos estilos para os elementos criativos
const ExtraModulesToggle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 12px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 50px;

  &:hover {
    transform: scale(1.1);
  }
`;

const MagicWandIcon = styled(FaMagic)`
  color: ${props => props.text};
  opacity: 0.7;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    filter: drop-shadow(0 0 4px ${props => props.text});
  }
`;

const ExtraModulesBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff4757;
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
`;

const MobileSidebar = ({
  activateModule,
  userData,
  setActiveCompany,
  companies,
  setCompanies,
  activeCompany,
  setHasNoCompanies,
  modulesUpdating
}) => {
  const { t } = useTranslation();
  const [activeItem, setActiveItem] = useState('');
  const [modules, setModules] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showExtraModules, setShowExtraModules] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [brandColors, setBrandColors] = useState({
    primary: '#578acd',
    secondary: '#1d3e70',
    text: '#ffffff'
  });
  const scrollRef = useRef(null);
  const colorThief = new ColorThief();

  useEffect(() => {
    if (userData._id) {
      HomeService.get(userData._id).then(res => {
        setCompanies(res.data);
        if (res.data.length === 0) {
          setHasNoCompanies(true);
        } else {
          const firstCompany = res.data[0];
          setSelectedCompany(firstCompany);
          setActiveCompany(firstCompany.id);
          extractBrandColors(firstCompany.logo);
        }
      });
    }
  }, [userData, modulesUpdating]);

  useEffect(() => {
    if (activeCompany && companies.length > 0) {
      const company = companies.find(c => c.id === activeCompany);
      if (company) {
        setSelectedCompany(company);
        extractBrandColors(company.logo);
      }
      ModulesService.get(activeCompany).then(res => setModules(res.data));
    }
  }, [activeCompany, companies]);

  useEffect(() => {
    if (activeCompany && companies.length > 0) {
      ModulesService.get(activeCompany)
        .then((res) => setModules(res.data));
    }
  }, [activeCompany, modulesUpdating]);

  const extractBrandColors = (logoUrl) => {
    if (!logoUrl) {
      setBrandColors({
        primary: '#578acd',
        secondary: '#1d3e70',
        text: '#ffffff'
      });
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = logoUrl;

    img.onload = () => {
      try {
        const palette = colorThief.getPalette(img, 3);
        const [primary, secondary] = palette;

        setBrandColors({
          primary: `rgb(${primary.join(',')})`,
          secondary: `rgb(${secondary.join(',')})`,
          text: getContrastColor(primary)
        });
      } catch (error) {
        console.error('Error extracting colors:', error);
        setBrandColors({
          primary: '#578acd',
          secondary: '#1d3e70',
          text: '#ffffff'
        });
      }
    };

    img.onerror = () => {
      setBrandColors({
        primary: '#578acd',
        secondary: '#1d3e70',
        text: '#ffffff'
      });
    };
  };

  const getContrastColor = (rgb) => {
    const brightness = Math.round(((rgb[0] * 299) + (rgb[1] * 587) + (rgb[2] * 114))) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  const iconComponents = {
    home: IoIosHome,
    payments: FaMoneyBill,
    products: MdSell,
    customers: RiAdminLine,
    employees: TiBusinessCard,
    calendar: FaCalendar,
    orders: CiCreditCard1,
    online: CgWebsite,
    marketing: CampaignIcon,
    notifications: IoMdChatboxes,
    config: RiSettingsLine
  };

  const toggleExtrasWithTooltip = () => {
    setShowExtraModules(prev => !prev);
    setTooltipText(t('supportModulesTooltip'));
    setTooltipOpen(true);
    setTimeout(() => setTooltipOpen(false), 3000);
};

  const handleItemClick = (key) => {
    const fixedKey = key ? key.toLowerCase() : key;
    activateModule(fixedKey);
    setActiveItem(fixedKey);
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setActiveCompany(company.id);
    setExpanded(false);
    extractBrandColors(company.logo);
  };

  // Determina quais módulos são "básicos" e quais são "extras"
  const basicModules = ['marketing'];
  const isBasicModule = (moduleKey) => basicModules.includes(moduleKey ? moduleKey.toLowerCase() : moduleKey);

  return (
    <SidebarWrapper>
      {/* Top Section - Company Selector */}
      <TopSection primary={brandColors.primary}>
        <CompanyHeader onClick={() => setExpanded(!expanded)}>
          <CompanyAvatar>
            {selectedCompany?.logo ? (
              <CompanyLogo src={selectedCompany.logo} alt={selectedCompany.name} />
            ) : (
              <CompanyPlaceholder>
                <BsBuilding size={20} />
              </CompanyPlaceholder>
            )}
          </CompanyAvatar>
          <CompanyInfo>
            <CompanyName text={brandColors.text}>
              {selectedCompany?.name || t('select_company')}
            </CompanyName>
          </CompanyInfo>
          <ChevronIcon text={brandColors.text}>
            {expanded ? <CgChevronUp size={20} /> : <CgChevronDown size={20} />}
          </ChevronIcon>
        </CompanyHeader>

        {expanded && (
          <CompanyDropdown>
            {companies.map(company => (
              <CompanyOption
                key={company.id}
                onClick={() => handleCompanySelect(company)}
                active={company.id === selectedCompany?.id}
              >
                <CompanyLogoWrapper>
                  {company.logo ? (
                    <CompanyLogo small src={company.logo} alt={company.name} />
                  ) : (
                    <CompanyPlaceholder small>
                      <BsBuilding size={16} />
                    </CompanyPlaceholder>
                  )}
                </CompanyLogoWrapper>
                <CompanyOptionInfo>
                  <CompanyOptionName text={brandColors.text}>
                    {company.name}
                  </CompanyOptionName>
                </CompanyOptionInfo>
                {company.id === selectedCompany?.id && (
                  <SelectedIndicator>
                    <GlowingDot />
                  </SelectedIndicator>
                )}
              </CompanyOption>
            ))}
          </CompanyDropdown>
        )}
      </TopSection>

      <BottomSection primary={brandColors.primary} secondary={brandColors.secondary}>
        <ModulesScroll ref={scrollRef}>
          <ModulesContainer>
            {/* Módulos básicos (sempre visíveis) */}
            {modules
              .filter(module => isBasicModule(module?.key))
              .map(module => {
                const key = module?.key?.toLowerCase();
                const IconComponent = iconComponents[key];
                return (
                  key && IconComponent && (
                    <CompactModuleItem
                      key={module?.key}
                      onClick={() => handleItemClick(module?.key)}
                      active={true}
                      title={t(`config.establishmentModules.${module?.key}`)}
                      style={{
                        backgroundColor: 'rgba(0,168,255,0.1)',
                      }}
                    >
                      <CompactModuleIcon active={true} text={brandColors.text}>
                        <IconComponent size={18} />
                      </CompactModuleIcon>
                        <CompactModuleLabel text={brandColors.text}>
                          {t(`config.establishmentModules.${module?.key}`)}
                        </CompactModuleLabel>
                    </CompactModuleItem>
                  )
                );
              })}
            <Tooltip
              title={tooltipText}
              open={tooltipOpen}
              placement="top"
              arrow
            >
              <ExtraModulesToggle onClick={toggleExtrasWithTooltip}>
                <div style={{ position: 'relative' }}>
                  <CgExtension color="#fff" size={22} />
                  {!showExtraModules && modules.filter(module => !isBasicModule(module?.key)).length > 0 && (
                    <ExtraModulesBadge>
                      {modules.filter(module => !isBasicModule(module?.key)).length}
                    </ExtraModulesBadge>
                  )}
                </div>
              </ExtraModulesToggle>
            </Tooltip>
            {showExtraModules && modules
              .filter(module => !isBasicModule(module?.key))
              .map(module => {
                const key = module?.key?.toLowerCase();
                const IconComponent = iconComponents[key];
                return (
                  key && IconComponent && (
                    <CompactModuleItem
                      key={module?.key}
                      onClick={() => handleItemClick(module?.key)}
                      active={activeItem === key}
                      title={t(`config.establishmentModules.${module?.key}`)}
                      style={{
                        backgroundColor: 'rgba(45, 60, 113, 0.5)',
                        height:'40px'
                      }}
                    >
                      <CompactModuleIcon active={activeItem === key} text={brandColors.text}>
                        <IconComponent size={18} />
                      </CompactModuleIcon>
                      {activeItem === key && (
                        <CompactModuleLabel text={brandColors.text}>
                          {t(`config.establishmentModules.${module?.key}`)}
                        </CompactModuleLabel>
                      )}
                    </CompactModuleItem>
                  )
                );
              })}

            <LogoutItem
              onClick={() => handleItemClick('config')}
              active={activeItem === 'config'}
              title={t('configurations')}
            >
              <CompactModuleIcon active={activeItem === 'config'} text={brandColors.text}>
                <RiSettingsLine size={18} />
              </CompactModuleIcon>
                <CompactModuleLabel text={brandColors.text}>
                  {t('configurations')}
                </CompactModuleLabel>
            </LogoutItem>

            <LogoutItem onClick={() => {
              localStorage.removeItem('accessToken');
              window.location.replace('/');
            }}>
              <IoMdLogOut size={18} color={brandColors.text} />
              <LogoutLabel color={brandColors.text}>Logout</LogoutLabel>
            </LogoutItem>
          </ModulesContainer>
        </ModulesScroll>
      </BottomSection>
    </SidebarWrapper>
  );
};

export default MobileSidebar;