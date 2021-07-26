import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import PeopleIcon from '@material-ui/icons/People';
import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';
import StorageIcon from '@material-ui/icons/Storage';

let p = [
  {
    pages: [
      {
        title: 'User Accounts',
        icon: PeopleIcon,
        href: '/administration/org/user-accounts',
        children: [

          {
            title: 'User Accounts',
            href: '/administration/org/user-accounts'
          }
        ],
      },


      {
        title: 'Setup',
        icon: SettingsIcon,
        children: [
          {
            title: 'Org profile',
            href: '/administration/org/profile'
          },
          {
            title: 'Org Setup',
            href: '/administration/org/setup'
          },
        ],
      },

      {
        title: 'System Parameters',
        icon: PhonelinkSetupIcon,
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
      },

      {
        title: 'Entities',
        icon: StorageIcon,
        children: [
          {
            title: 'Farms',
            href: '/management/farms/view/1'
          },
          {
            title: 'Animals',
            href: '/management/animals/view/1'
          },
        ]
      }
    ]
  },
];

export default p;
