import React from 'react'
import { SidebarContainer, SidebarContainerBody, SidebarContainerBodyElement, SidebarContainerBodyElementContainer, SidebarContainerBodyElementIcon, SidebarContainerFooter, SidebarContainerHeader, SidebarContainerHeaderProfile, SidebarContainerHeaderProfileName } from './styles.ts';
import UserNoImage from '../../images/user.png'
import { IoIosHome } from "react-icons/io";
import { FaMoneyBill } from "react-icons/fa";
import { GiGymBag } from "react-icons/gi";
import { RiAdminLine } from "react-icons/ri";
import { FaNewspaper } from "react-icons/fa";
import { GiTeacher } from "react-icons/gi";
import { IoMdChatboxes } from "react-icons/io";
import { FaBeerMugEmpty } from "react-icons/fa6";
import useActiveModule from '../../hooks/moduleHook.ts';

export const dashboardModules = [
  {
      module:'',
      name:'Home',
      icon:<IoIosHome size={26} />,
  },
  {
    module:'',
    name:'Cervejas',
    icon:<FaBeerMugEmpty size={26} />,
  },
  {
      module:'',
      name:'Pagamentos',
      icon:<FaMoneyBill size={26} />,
  },
  {
    module:'',
    name:'Clientes',
    icon:<RiAdminLine size={26} />,
  },
  {
    module:'',
    name:'Chat',
    icon:<IoMdChatboxes size={26} />,
  },

]

const Sidebar: React.FC<{ isMenuActive: boolean, setIsMenuActive:any, activateModule }> = ({...props}) => {
  return (
    <SidebarContainer>
      <SidebarContainerHeader>
        <SidebarContainerHeaderProfile src={UserNoImage}/>
        <SidebarContainerHeaderProfileName>Nome do usuário</SidebarContainerHeaderProfileName>
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