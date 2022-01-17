import BarChartIcon from '@material-ui/icons/BarChart';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import AccountTreeIcon from '@material-ui/icons/AccountTree';

let p = [
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
            title: 'Farms',
            href: '/management/farms/view/0'
          },
          {
            title: 'Herds',
            href: '/management/herds'
          },
          {
            title: 'Animals',
            href: '/management/animals'
          },
          {
            title: 'Exit List',
            href: '/management/exit-list'
          },
          /*{
            title: 'AI Straws',
            href: '/management/straws/view/1'
          },*/
          {
            title: 'Graduation',
            href: '/management/graduation/view/0'
          },
          {
            title: 'Partners',
            icon: AccountTreeIcon,
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
        title: 'Calendar',
        href: '/calendar',
        icon: CalendarTodayIcon
      },
     
      {
        title: 'Batch Processing',
        href: '/batch-processing',
        icon: ListAltIcon,
        children: [
          {
            title: 'Batch Processing',
            href: '/batch-processing',
          }
        ]
      },

      {
        title: 'Account Settings',
        href: '/settings',
        icon: AccountCircleIcon,
        children: [
          {
            title: 'General',
            href: '/settings/general'
          },
          {
            title: 'Security',
            href: '/settings/security'
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
            title: 'Batches',
            href: '/reports/batches'
          },
        ]
      }
    ]
  },
];

export default p;







