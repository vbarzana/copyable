import {Icon} from '@chakra-ui/react'
import {MdBarChart, MdHome, MdLock, MdOutlineShoppingCart, MdPerson} from 'react-icons/md'

// Admin Imports
import MainDashboard from 'pages/admin/default'
import Profile from 'pages/admin/profile'
import DataTables from 'pages/admin/data-tables'
import RTL from 'pages/rtl/rtl-default'

// Auth Imports
import SignInCentered from 'pages/auth/sign-in'
import {IRoute} from 'types/navigation'

const routes: IRoute[] = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard
  },
  {
    name: 'Data Tables',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    path: '/data-tables',
    component: DataTables
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
    component: Profile
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
    component: SignInCentered
  }
]

export default routes
