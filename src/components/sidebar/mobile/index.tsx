import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import ColorThief from 'colorthief';
import { useTranslation } from 'react-i18next';
import { CgWebsite, CgChevronDown, CgChevronUp } from 'react-icons/cg';
import { CiCreditCard1 } from 'react-icons/ci';
import { FaMoneyBill, FaCalendar } from 'react-icons/fa';
import { IoIosHome, IoMdChatboxes, IoMdLogOut, IoMdNotifications } from 'react-icons/io';
import { MdSell } from 'react-icons/md';
import { RiAdminLine, RiSettingsLine } from 'react-icons/ri';
import { TiBusinessCard } from 'react-icons/ti';
import { BsBuilding, BsDot } from 'react-icons/bs';
import ModulesService from '../../../services/modules.service.ts';
import HomeService from '../../../services/home.service.ts';
import { Box } from '@mui/material';
import { LogoutOutlined } from '@mui/icons-material';
import { LogOutIcon } from 'lucide-react';
import CampaignIcon from '@mui/icons-material/Campaign';
import { SidebarWrapper, TopSection, CompanyHeader, CompanyAvatar, CompanyLogo, CompanyPlaceholder, CompanyInfo, CompanyName, ChevronIcon, CompanyDropdown, CompanyOption, CompanyLogoWrapper, CompanyOptionInfo, CompanyOptionName, SelectedIndicator, GlowingDot, BottomSection, ModulesScroll, ModulesContainer, CompactModuleItem, CompactModuleIcon, CompactModuleLabel, LogoutItem, LogoutLabel } from './styles.ts';

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

  const handleItemClick = (key) => {
    const fixedKey = key.toLowerCase(); // Padronize
    activateModule(fixedKey);
    setActiveItem(fixedKey);
  };

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setActiveCompany(company.id);
    setExpanded(false);
    extractBrandColors(company.logo);
  };

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
          {modules.map(module => {
            const key = module?.key?.toLowerCase();
            const IconComponent = iconComponents[key];
            return (
              key && IconComponent && (
                <CompactModuleItem
                  key={module.key}
                  onClick={() => handleItemClick(module.key)}
                  active={activeItem === key}
                  title={t(`config.establishmentModules.${module.key}`)}
                >
                  <CompactModuleIcon active={activeItem === key} text={brandColors.text}>
                    <IconComponent size={18} />
                  </CompactModuleIcon>
                  {activeItem === key && (
                    <CompactModuleLabel text={brandColors.text}>
                      {t(`config.establishmentModules.${module.key}`)}
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