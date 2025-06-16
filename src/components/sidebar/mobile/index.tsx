import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ColorThief from 'colorthief';
import { useTranslation } from 'react-i18next';
import { Box, Tooltip } from '@mui/material';
import { CgWebsite, CgExtension, CgChevronDown, CgChevronUp } from 'react-icons/cg';
import { CiCreditCard1 } from 'react-icons/ci';
import { FaMoneyBill, FaCalendar } from 'react-icons/fa';
import { IoIosHome, IoMdChatboxes, IoMdNotifications, IoMdLogOut } from 'react-icons/io';
import { MdSell } from 'react-icons/md';
import { RiAdminLine, RiSettingsLine } from 'react-icons/ri';
import { TiBusinessCard } from 'react-icons/ti';
import { BsBuilding } from 'react-icons/bs';
import CampaignIcon from '@mui/icons-material/Campaign';
import ModulesService from '../../../services/modules.service.ts';
import HomeService from '../../../services/home.service.ts';
import { SidebarWrapper, TopSection, CompanyHeader, CompanyAvatar, CompanyLogo, CompanyPlaceholder, CompanyInfo, CompanyName, ChevronIcon, CompanyDropdown, CompanyOption, CompanyLogoWrapper, CompanyOptionInfo, CompanyOptionName, SelectedIndicator, GlowingDot, BottomSection, ModulesScroll, ModulesContainer, CompactModuleItem, CompactModuleIcon, CompactModuleLabel, LogoutItem, LogoutLabel } from './styles.ts';
import useHideOnScroll from '../../../hooks/useHideOnScroll.ts';

const BottomNavContainer = styled(Box)`
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #4A75AE;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1200;
  height: 60px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const NavItemsWrapper = styled.div`
  display: flex;
  min-width: 100%;
  justify-content: space-around;
  align-items: center;
  padding: 0 8px;
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  min-width: 60px;
  cursor: pointer;
  color: ${({ active }) => (active ? '#fff' : '#e4e4e4')};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    color: #fff;
  }
`;

const NavIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 4px;
`;

const NavLabel = styled.span`
  font-size: 0.7rem;
  white-space: nowrap;
`;

const ActiveIndicator = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 3px;
  background-color: ${({ active }) => (active ? '#fff' : '#4A75AE')};
  border-radius: 0 0 3px 3px;
`;

const ExtraModulesBadge = styled.div`
  position: absolute;
  top: 2px;
  right: 10px;
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

const MobileBottomNavigation = ({
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
  const [activeItem, setActiveItem] = useState('marketing');
  const [modules, setModules] = useState([]);
  const [brandColors, setBrandColors] = useState({ primary: '#578acd', secondary: '#1d3e70', text: '#ffffff' });
  const [showExtraModules, setShowExtraModules] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipText, setTooltipText] = useState('');
  const [expandedTop, setExpandedTop] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const colorThief = new ColorThief();
  const hideNav = useHideOnScroll();

  useEffect(() => {
    if (userData._id) {
      HomeService.get(userData._id).then(res => {
        setCompanies(res.data);
        if (res.data.length === 0) setHasNoCompanies(true);
        else {
          const firstCompany = res.data[0];
          setActiveCompany(firstCompany.id);
          extractBrandColors(firstCompany.logo);
        }
      });
    }
  }, [userData, modulesUpdating]);

  useEffect(() => {
    if (activeCompany && companies.length > 0) {
      const company = companies.find(c => c.id === activeCompany);
      if (company) extractBrandColors(company.logo);
      ModulesService.get(activeCompany).then(res => setModules(res.data));
    }
  }, [activeCompany, companies, modulesUpdating]);

  const extractBrandColors = (logoUrl) => {
    if (!logoUrl) return setBrandColors({ primary: '#578acd', secondary: '#1d3e70', text: '#ffffff' });

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
      } catch (e) {
        setBrandColors({ primary: '#578acd', secondary: '#1d3e70', text: '#ffffff' });
      }
    };

    img.onerror = () => setBrandColors({ primary: '#578acd', secondary: '#1d3e70', text: '#ffffff' });
  };

  const getContrastColor = (rgb) => {
    const brightness = Math.round(((rgb[0] * 299) + (rgb[1] * 587) + (rgb[2] * 114)) / 1000);
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  const selectedCompany = companies.find(c => c.id === activeCompany);
  const handleCompanySelect = (company) => {
    setActiveCompany(company.id);
    setExpandedTop(false);
    extractBrandColors(company.logo);
  };

  const toggleExtrasWithTooltip = () => {
    setShowExtraModules(prev => !prev);
    setTooltipText(t('supportModulesTooltip'));
    setTooltipOpen(true);
    setTimeout(() => setTooltipOpen(false), 3000);
  };

  const handleItemClick = (key) => {
    if (key === 'logout') {
      localStorage.removeItem('accessToken');
      window.location.replace('/');
      return;
    }
    const fixedKey = key ? key.toLowerCase() : key;
    activateModule(fixedKey);
    setActiveItem(fixedKey);
  };

  const iconComponents = {
    home: IoIosHome, payments: FaMoneyBill, products: MdSell, customers: RiAdminLine, employees: TiBusinessCard,
    calendar: FaCalendar, orders: CiCreditCard1, online: CgWebsite, marketing: CampaignIcon, notifications: IoMdNotifications,
    chat: IoMdChatboxes, config: RiSettingsLine, logout: IoMdLogOut
  };

  const isMainModule = (key) => ['home', 'marketing', 'customers', 'payments'].includes(key);

  const allModules = modules.map(module => ({
    key: module?.key.toLowerCase(),
    icon: iconComponents[module?.key.toLowerCase()] || CgExtension,
    label: t(`config.establishmentModules.${module?.key}`) || module?.key
  }));

  const mainNavItems = allModules.filter(item => isMainModule(item?.key));
  const extraNavItems = allModules.filter(item => !isMainModule(item?.key));

  return (
    <>
      <SidebarWrapper>
      {/* <TopSection primary={brandColors.primary}>
        <CompanyHeader onClick={() => setExpandedTop(!expandedTop)}>
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
            {expandedTop ? <CgChevronUp size={20} /> : <CgChevronDown size={20} />}
          </ChevronIcon>
        </CompanyHeader>

        {expandedTop && (
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
      </TopSection> */}

      <BottomNavContainer
        sx={{
          top: expanded ? '120px' : 'unset',
          transform: hideNav ? 'translateY(100%)' : 'translateY(0)',
          transition: 'transform 0.3s'
        }}
      >
        <NavItemsWrapper>
          {mainNavItems.map(item => (
            <Tooltip key={item?.key} title={item.label} placement="top" arrow>
              <NavItem onClick={() => handleItemClick(item?.key)} active={activeItem === item?.key}>
                <ActiveIndicator active={activeItem === item?.key} />
                <NavIcon style={{marginBottom:'-5px'}}>{React.createElement(item.icon, { size: 20 })}</NavIcon>
                <NavLabel>{item.label}</NavLabel>
              </NavItem>
            </Tooltip>
          ))}

        {extraNavItems.length > 0 && (
          <Tooltip title={tooltipText} open={tooltipOpen} placement="top" arrow>
            <NavItem
              onClick={toggleExtrasWithTooltip}
              active={showExtraModules}
              activecolor={brandColors.primary}
            >
              <div style={{ position: 'relative' }}>
                <NavIcon style={{marginBottom:'-5px'}}>
                  <CgExtension size={20} />
                </NavIcon>
                {!showExtraModules && (
                  <ExtraModulesBadge>
                    {extraNavItems.length}
                  </ExtraModulesBadge>
                )}
              </div>
              <NavLabel>Extras</NavLabel>
              <ActiveIndicator active={showExtraModules} activecolor={brandColors.primary} />
            </NavItem>
          </Tooltip>
        )}

          {[{ key: 'config', icon: RiSettingsLine, label: t('configurations') }, { key: 'logout', icon: IoMdLogOut, label: t('logout') }].map(item => (
            <Tooltip key={item?.key} title={item.label} placement="top" arrow>
              <NavItem onClick={() => handleItemClick(item?.key)} active={activeItem === item?.key}>
                <ActiveIndicator active={activeItem === item?.key} />
                <NavIcon style={{marginBottom:'-5px'}}>{React.createElement(item.icon, { size: 20 })}</NavIcon>
                <NavLabel>{item.label}</NavLabel>
              </NavItem>
            </Tooltip>
          ))}
        </NavItemsWrapper>
      </BottomNavContainer>
      </SidebarWrapper>
    </>
  );
};

export default MobileBottomNavigation;
