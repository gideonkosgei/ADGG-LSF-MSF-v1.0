/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
//import React from 'react';
//import { colors} from '@material-ui/core';
import BarChartIcon from '@material-ui/icons/BarChart';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
//import ChatIcon from '@material-ui/icons/ChatOutlined';
//import CodeIcon from '@material-ui/icons/Code';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
//import ErrorIcon from '@material-ui/icons/ErrorOutline';
//import FolderIcon from '@material-ui/icons/FolderOutlined';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import ListAltIcon from '@material-ui/icons/ListAlt';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
//import LockOpenIcon from '@material-ui/icons/LockOpenOutlined';
//import MailIcon from '@material-ui/icons/MailOutlined';
//import PresentToAllIcon from '@material-ui/icons/PresentToAll';
//import PeopleIcon from '@material-ui/icons/PeopleOutlined';
//import PersonIcon from '@material-ui/icons/PersonOutlined';
//import ReceiptIcon from '@material-ui/icons/ReceiptOutlined';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
//import ViewModuleIcon from '@material-ui/icons/ViewModule';
//import { Label } from 'components';


export default [
  {
     pages: [      
      {
        title: 'Overview',
        href: '/overview',
        icon: HomeIcon
      },
      {
        title: 'Dashboards',
        href: '/dashboards',
        icon: DashboardIcon,
        children: [
          /*{
            title: 'Default',
            href: '/dashboards/default'
          },*/
          {
            title: 'Analytics',
            href: '/dashboards/analytics'
          }
        ]
      },
      {
        title: 'Management',
        href: '/management',
        icon: BarChartIcon,
        children: [
          /*{
            title: 'Clients',
            href: '/management/clients'
          },*/
          {
            title: 'Animals',
            href: '/management/animals'
          },
          /*{
            title: 'Action List',
            href: '/management/exit-list'
          },*/
          {
            title: 'Exit List',
            href: '/management/exit-list'
          },
          {
            title: 'AI Straws',
            href: '/management/straws/view/1'
          },
          {
            title: 'Graduation',
            href: '/management/graduation/view/0'
          },
          /*
          {
            title: 'Farm Details',
            href: '/management/farms/1/summary'
          },*/
           
        ]
      },
      {
        title: 'Calendar',
        href: '/calendar',
        icon: CalendarTodayIcon       
      },
      {
        title: 'Batch Processes',
        href: '/batch-process',
        icon: ListAltIcon, 
        children: [
          {
            title: 'Animal Reg',
            href: '/batch-process/animal/home',                     
          },
          {
            title: 'Milking ',
            href: '/batch-process/milking-records/home',                     
          },
          {
            title: 'Weight & Growth ',
            href: '/batch-process/weight/home',                     
          },
          {
            title: 'PD Batch',
            href: '/batch-process/pd/home',                     
          },
          {
            title: 'Insemination ',
            href: '/batch-process/ai/home',                     
          },
          {
            title: 'Exit/Disposal ',
            href: '/batch-process/exit/home',                     
          },
          {
            title: 'Synchronization ',
            href: '/batch-process/sync/home',                     
          },
          {
            title: 'Calving ',
            href: '/batch-process/calving/home',                     
          },
        ]     
      },
     
      {
        title: 'Settings',
        href: '/settings',
        icon: SettingsIcon,
        children: [
          {
            title: 'Account',
            href: '/settings',
            children: [
              {
                title: 'General',
                href: '/settings/general'
              },
              {
                title: 'Security',
                href: '/settings/security'
              },
              {
                title: 'Switch Organization',
                href: '/switch/org'
              },
            ]
          },         
         
          {
            title: 'System Parameters',
            href: '/settings/parameters',
            children: [
              {
                title: 'Limits',
                href: '/settings/parameters/limits'
              },
              {
                title: 'Local Settings',
                href: '/settings/parameters/local-settings'
              },                 
              {
                title: 'Events Matrix',
                href: '/settings/parameters/events-matrix'
              }
            ]
          },
          
          {
            title: 'Partners',
            href: '/settings/partners/service-providers',
            children: [
              {
                title: 'Service Providers',
                href: '/settings/partners/service-providers'
              },
              {
                title: 'Agents',
                href: '/settings/partners/agents'
              }
            ] 
          }         
        ]
      }, 
      {
        title: 'Reports',
        href: '/reports',
        icon: LibraryBooksIcon,
        children: [
          {
            title: 'Events',
            href: '/events',
            children: [
              {
                title: 'Milking',
                href: '/reports/events/milking'
              },
              {
                title: 'Weight & Growth',
                href: '/reports/events/weight'
              },
              {
                title: 'Insemination',
                href: '/reports/events/ai'
              },
              {
                title: 'Calving',
                href: '/reports/events/calving'
              },
              {
                title: 'PD',
                href: '/reports/events/pd'
              },
              {
                title: 'Sync',
                href: '/reports/events/sync'
              },
              {
                title: 'Exit & Disposal',
                href: '/reports/events/exit'
              },
            ]
          },
          {
            title: 'Animal Registration',
            href: '/management/animals'
          },          
        ]
      },       
      {
        title: 'Downloads',
        href: '/downloads',
        icon: CloudDownloadIcon,        
      }, 
      {
        title: 'Administration',       
        icon: SupervisorAccountIcon,  
        children: [
          {
            title: 'Organization',
            href: '/administration/org'                     
          },
          {
            title: 'Background Processes',
            href: '/background-processes/org'                     
          },
          {
            title: 'farm/org logo',
            href: '/administration/upload-logo'
          }, 
        ]  
         

        
      },     
    ]
  },
 
  
];
