import React, { useEffect, useState } from 'react'
import { SidebarContainer, SidebarContainerBody, SidebarContainerBodyElement, SidebarContainerBodyElementContainer, SidebarContainerBodyElementIcon, SidebarContainerFooter, SidebarContainerHeader, SidebarContainerHeaderProfile, SidebarContainerHeaderProfileName } from './styles.ts';
import UserNoImage from '../../images/user.png'
import { IoIosHome } from "react-icons/io";
import { FaMoneyBill } from "react-icons/fa";
import { RiAdminLine } from "react-icons/ri";
import { IoMdChatboxes } from "react-icons/io";
import { TiBusinessCard } from "react-icons/ti";
import { MdSell } from "react-icons/md";
import { FaCalendar } from "react-icons/fa";
import HomeService from '../../services/home.service.ts';
import Select from 'react-select';

export const dashboardModules = [
  {
      module:'',
      name:'Home',
      icon:<IoIosHome size={26} />,
  },
  {
    module:'',
    name:'Pagamentos',
    icon:<FaMoneyBill size={26} />,
  },
  {
    module:'',
    name:'Produtos',
    icon:<MdSell size={26} />,
  },
  {
    module:'',
    name:'Clientes',
    icon:<RiAdminLine size={26} />,
  },
  {
    module:'',
    name:'Funcionários',
    icon:<TiBusinessCard size={26} />,
  },
  {
    module:'',
    name:'Calendário',
    icon:<FaCalendar size={26} />,
  },
  //{
  //   module:'',
  //   name:'Chat',
  //   icon:<IoMdChatboxes size={26} />,
  // },
  // {
  //   module:'',
  //   name:'Automacao',
  //   icon:<IoMdChatboxes size={26} />,
  // },
  // {
  //   module:'',
  //   name:'Marketing',
  //   icon:<IoMdChatboxes size={26} />,
  // },
  // {
  //   module:'',
  //   name:'Equipments',
  //   icon:<IoMdChatboxes size={26} />,
  // },
]

const Sidebar: React.FC<{ isMenuActive: boolean, setIsMenuActive:any, activateModule, userData, setActiveCompany, companies, setCompanies }> = ({...props}) => {

  const options = props.companies.map((company) => ({
    value: company.id,
    label: (
      <div style={{color:'black'}}>
        <img src={company.logo} alt={company.name} style={{ width: '20px', marginRight: '10px' }} />
        {company.name}
      </div>
    ),
  }));

  useEffect(() => {
    if (props.userData._id) {
      HomeService.get(props.userData._id)
        .then((res) => props.setCompanies(res.data))
    }
  }, [props.userData]);


  return (
    <SidebarContainer>
      <SidebarContainerHeader>
        <SidebarContainerHeaderProfile src={UserNoImage}/>
        <SidebarContainerHeaderProfileName>{props.userData.name}</SidebarContainerHeaderProfileName>
        <Select
          value={options.find(option => option.value === props.activeCompany)}
          onChange={(selectedOption) => props.setActiveCompany(selectedOption.value)}
          options={options}
          isSearchable={false}
        />
    </SidebarContainerHeader>
      <SidebarContainerBody>
        {dashboardModules.map((list)=>{
          return (
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          <SidebarContainerBodyElementContainer onClick={()=>{
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            window.outerWidth < 600?props.setIsMenuActive(!props.isMenuActive):'';
            props.activateModule(list.name)
            }}>
            <SidebarContainerBodyElementIcon>{list.icon}</SidebarContainerBodyElementIcon>
            <SidebarContainerBodyElement>{list.name}</SidebarContainerBodyElement>
          </SidebarContainerBodyElementContainer>
          )
        })}
      </SidebarContainerBody>
      <SidebarContainerFooter>
        <SidebarContainerBodyElement style={{marginLeft:'3%'}}>Notificações</SidebarContainerBodyElement>
        <SidebarContainerBodyElement style={{marginLeft:'3%'}}>Configurações</SidebarContainerBodyElement>
        <SidebarContainerBodyElement style={{marginLeft:'3%'}}>Logout</SidebarContainerBodyElement>
      </SidebarContainerFooter>
    </SidebarContainer>
  );
}

export default Sidebar;