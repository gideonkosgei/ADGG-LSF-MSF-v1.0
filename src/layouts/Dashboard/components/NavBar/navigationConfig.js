import BarChartIcon from '@material-ui/icons/BarChart';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import ListAltIcon from '@material-ui/icons/ListAlt';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

const p = [
  {
     pages: [             
      {
        title: 'Overview',
        href: '/overview',
        icon: HomeIcon,
        role : 'admin'
      },
      {
        title: 'Dashboards',
        href: '/dashboards',
        icon: DashboardIcon,
        children: [        
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
          {
            title: 'Animals',
            href: '/management/animals'
          },         
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
          }          
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
          {
            title: 'Batches',
            href: '/reports/batches'
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
            href: '/administration/org',
            children: [
              {
                title: 'Org profile',
                href: '/administration/org/profile'                     
              },
              {
                title: 'User Accounts',
                href: '/administration/org/user-accounts'                     
              },  
              {
                title: 'Access',
                href: '/administration/org'                     
              },               
            ],                  
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

console.log(p[0].pages[0].href)


export default p;
