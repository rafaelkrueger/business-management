import { IoIosHome } from "react-icons/io";
import { FaMoneyBill } from "react-icons/fa";
import { MdSell } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import { TiBusinessCard } from "react-icons/ti";
import { FaCalendar } from "react-icons/fa";
import { CiCreditCard1 } from "react-icons/ci";
import { CgWebsite } from "react-icons/cg";
import CampaignIcon from "@mui/icons-material/Campaign";

export const dashboardModules = [
  {
    module: '',
    name: 'Home',
    icon: <IoIosHome size={26} />,
  },
  {
    module: '',
    name: 'Payments',
    icon: <FaMoneyBill size={26} />,
  },
  {
    module: '',
    name: 'Products',
    icon: <MdSell size={26} />,
  },
  {
    module: '',
    name: 'Employees',
    icon: <TiBusinessCard size={26} />,
  },
  {
    module: '',
    name: 'Calendar',
    icon: <FaCalendar size={26} />,
  },
  {
    module: '',
    name: 'Orders',
    icon: <CiCreditCard1 size={26} />,
  },
  {
    module: '',
    name: 'Online Management',
    icon: <CgWebsite size={26} />,
  },
  {
    module: '',
    name: 'Marketing',
    icon: <CampaignIcon size={26} />,
  },
];

export default dashboardModules;
