/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { lazy } from 'react';
import { Redirect } from 'react-router-dom';
import AuthLayout from './layouts/Auth';
import ErrorLayout from './layouts/Error';
import DashboardLayout from './layouts/Dashboard';
import DashboardAnalyticsView from './views/DashboardAnalytics';
import DashboardDefaultView from './views/DashboardDefault';
import OverviewView from './views/Overview';
import PresentationView from './views/Presentation';



const routes = [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/auth/login" />
  },
  {
    path: '/auth',
    component: AuthLayout,
    routes: [
      {
        path: '/auth/login',
        exact: true,
        component: lazy(() => import('views/Login'))
      },
      {
        path: '/auth/register',
        exact: true,
        component: lazy(() => import('views/Register'))
      },
      {
        path: '/auth/forgot-password',
        exact: true,
        component: lazy(() => import('views/ForgotPassword'))
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  },
  {
    path: '/errors',
    component: ErrorLayout,
    routes: [
      {
        path: '/errors/error-401',
        exact: true,
        component: lazy(() => import('views/Error401'))
      },
      {
        path: '/errors/error-404',
        exact: true,
        component: lazy(() => import('views/Error404'))
      },
      {
        path: '/errors/error-500',
        exact: true,
        component: lazy(() => import('views/Error500'))
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  },
  {
    route: '*',
    component: DashboardLayout,
    routes: [
      {
        path: '/calendar',
        exact: true,
        component: lazy(() => import('views/Calendar'))
      },
      {
        path: '/changelog',
        exact: true,
        component: lazy(() => import('views/Changelog'))
      },
      {
        path: '/chat',
        exact: true,
        component: lazy(() => import('views/Chat'))
      },
      {
        path: '/chat/:id',
        exact: true,
        component: lazy(() => import('views/Chat'))
      },
      {
        path: '/dashboards/analytics',
        exact: true,
        component: DashboardAnalyticsView
      },
      {
        path: '/dashboards/default',
        exact: true,
        component: DashboardDefaultView
      },
      {
        path: '/invoices/:id',
        exact: true,
        component: lazy(() => import('views/InvoiceDetails'))
      },
      {
        path: '/kanban-board',
        exact: true,
        component: lazy(() => import('views/KanbanBoard'))
      },
      {
        path: '/mail',
        exact: true,
        component: lazy(() => import('views/Mail'))
      },
      {
        path: '/management/customers',
        exact: true,
        component: lazy(() => import('views/CustomerManagementList'))
      },
      {
        path: '/management/clients',
        exact: true,
        component: lazy(() => import('views/Clients'))
      },
      {
        path: '/management/animals',
        exact: true,
        component: lazy(() => import('views/Animals'))
      },
      {
        path: '/management/animals/:id',
        exact: true,
        component: lazy(() => import('views/Animals'))
      },
      {
        path: '/management/animals-add/',
        exact: true,
        component: lazy(() => import('views/Animals/components/AnimalDetails'))
      },
      {
        path: '/management/details/view/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Details'))
      },     
      {
        path: '/management/details/edit/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Details/components/edit'))
      },      
          
     /* {
        path: '/management/analytics/',
        exact: true,
        component: lazy(() => import('views/Animals/components/Analytics'))
      },*/
      /*{
        path: '/management/calender/',
        exact: true,
        component: lazy(() => import('views/Animals/components/Calender'))
      },*/ 
      {
        path: '/management/health/',
        exact: true,
        component: lazy(() => import('views/Animals/components/Health'))
      },
     /* {
        path: '/management/notifications/',
        exact: true,
        component: lazy(() => import('views/Animals/components/Notifications'))
      },*/
      {
        path: '/management/pd/view/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/PD'))
      },
      {
        path: '/management/pd/add/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/PD/components/add'))          
      },
      {
        path: '/management/pd/edit/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/PD/components/edit'))          
      },
      {
        path: '/management/insemination/view/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Insemination'))
      },
      {
        path: '/management/insemination/add/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Insemination/components/add'))
      },
      {
        path: '/management/insemination/edit/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Insemination/components/edit'))
      },

      {
        path: '/management/exit/view/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Exits'))
      },

      {
        path: '/management/exit/add/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Exits/components/add'))
      },
      {
        path: '/management/exit/edit/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Exits/components/edit'))
      },

      {
        path: '/management/exit-list',
        exact: true,
        component: lazy(() => import('views/Animals/components/ExitList'))
      },
      {
        path: '/management/exit-list/details/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/ExitList/components/details'))
      },
      {
        path: '/management/health/view/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Health'))
      },
      {
        path: '/management/health/add/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Health/components/add'))
      },
      {
        path: '/management/health/edit/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Health/components/edit'))
      },
      {
        path: '/management/sync/view/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Sync'))
      },
      {
        path: '/management/sync/add/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Sync/components/add'))          
      },
      {
        path: '/management/sync/edit/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Sync/components/edit'))          
      },
      
      {
        path: '/management/calving/view/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Calving'))
      },
      {
        path: '/management/calving/add/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Calving/components/add'))          
      },
      {
        path: '/management/calving/edit/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Calving/components/edit'))          
      },
      {
        path: '/management/milking/view/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Milking'))
      },
      {
        path: '/management/milking/add/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Milking/components/add'))          
      },
      {
        path: '/management/milking/edit/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Milking/components/edit'))          
      },
      


      {
        path: '/management/weight/view/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Weight'))        
      }, 
      {
        path: '/management/weight/charts/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Weight/components/charts'))        
      }, 
      {
        path: '/management/weight/add/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Weight/components/add'))          
      },
      {
        path: '/management/weight/edit/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Weight/components/edit'))          
      },      
      {
        path: '/management/customers/:id',
        exact: true,
        component: lazy(() => import('views/CustomerManagementDetails'))
      },
      {
        path: '/management/farms/:id/:tab',
        exact: true,
        component: lazy(() => import('views/Farms'))
      },
      {
        path: '/management/customers/:id/:tab',
        exact: true,
        component: lazy(() => import('views/CustomerManagementDetails'))
      },
      {
        path: '/management/projects',
        exact: true,
        component: lazy(() => import('views/ProjectManagementList'))
      },
      {
        path: '/management/orders',
        exact: true,
        component: lazy(() => import('views/OrderManagementList'))
      },
      {
        path: '/management/orders/:id',
        exact: true,
        component: lazy(() => import('views/OrderManagementDetails'))
      },
      // AI STRAWS
      {
        path: '/management/straws/:status',
        exact: true,
        component: lazy(() => import('views/Straws/components/Straw/components/view'))        
      },       
      {
        path: '/management/straws/add',
        exact: true,
        component: lazy(() => import('views/Straws/components/Straw/components/add'))        
      }, 
      {
        path: '/management/straws/edit/:id',
        exact: true,
        component: lazy(() => import('views/Straws/components/Straw/components/edit'))        
      },


      {
        path: '/overview',
        exact: true,
        component: OverviewView
      },
      {
        path: '/presentation',
        //path: isLoggedIn? '/presentation': "/auth/login",
        exact: true,
        component: PresentationView
      },
      {
        path: '/profile/:id',
        exact: true,
        component: lazy(() => import('views/Profile'))
      },
      {
        path: '/profile/:id/:tab',
        exact: true,
        component: lazy(() => import('views/Profile'))
      },
      {
        path: '/projects/create',
        exact: true,
        component: lazy(() => import('views/ProjectCreate'))
      },
      {
        path: '/projects/:id',
        exact: true,
        component: lazy(() => import('views/ProjectDetails'))
      },
      {
        path: '/projects/:id/:tab',
        exact: true,
        component: lazy(() => import('views/ProjectDetails'))
      },
      {
        path: '/projects',
        exact: true,
        component: lazy(() => import('views/ProjectList'))
      },
      {
        path: '/settings',
        exact: true,
        component: lazy(() => import('views/Settings'))
      },
      {
        path: '/settings/:tab',
        exact: true,
        component: lazy(() => import('views/Settings'))
      },

      {
        path: '/settings/parameters/limits',
        exact: true,
        component: lazy(() => import('views/Parameters/components/Limits/components/view'))        
      }, 
      {
        path: '/settings/parameters/limits/add',
        exact: true,
        component: lazy(() => import('views/Parameters/components/Limits/components/add'))        
      },
      {
        path: '/settings/parameters/limits/edit/:id',
        exact: true,
        component: lazy(() => import('views/Parameters/components/Limits/components/edit'))        
      },  
      {
        path: '/settings/parameters/local-settings',
        exact: true,
        component: lazy(() => import('views/Parameters/components/LocalSettings/components/view'))        
      },
      {
        path: '/settings/parameters/local-settings/add',
        exact: true,
        component: lazy(() => import('views/Parameters/components/LocalSettings/components/add'))        
      },
      {
        path: '/settings/parameters/local-settings/edit/:id',
        exact: true,
        component: lazy(() => import('views/Parameters/components/LocalSettings/components/edit'))        
      },  

      // events matrix
      {
        path: '/settings/parameters/events-matrix',
        exact: true,
        component: lazy(() => import('views/Parameters/components/EventsMatrix/components/view'))        
      }, 
      {
        path: '/settings/parameters/events-matrix/edit/:id',
        exact: true,
        component: lazy(() => import('views/Parameters/components/EventsMatrix/components/edit'))        
      }, 

      //service providers
      {
        path: '/settings/partners/service-providers',
        exact: true,
        component: lazy(() => import('views/Partners/components/ServiceProviders/components/view'))        
      }, 
      {
        path: '/settings/partners/service-providers/add',
        exact: true,
        component: lazy(() => import('views/Partners/components/ServiceProviders/components/add'))        
      }, 
      {
        path: '/settings/partners/service-providers/edit/:id',
        exact: true,
        component: lazy(() => import('views/Partners/components/ServiceProviders/components/edit'))        
      },
      //agents
      {
        path: '/settings/partners/agents',
        exact: true,
        component: lazy(() => import('views/Partners/components/Agents/components/view'))        
      }, 
      {
        path: '/settings/partners/agents/add',
        exact: true,
        component: lazy(() => import('views/Partners/components/Agents/components/add'))        
      }, 
      {
        path: '/settings/partners/agents/edit/:id',
        exact: true,
        component: lazy(() => import('views/Partners/components/Agents/components/edit'))        
      },
      


      

      // Batch processes Routes
      {
        path: '/batch-process/milking-records/add',
        exact: true,
        component: lazy(() => import('views/Batch/components/Milking/components/add'))        
      }, 
      // deleted milk batches
      {
        path: '/batch-process/milking-records/deleted',
        exact: true,
        component: lazy(() => import('views/Batch/components/Milking/components/deleted'))        
      }, 
      // Batch processes Routes subsequent Steps
      {
        path: '/batch-process/milking-records/add/:uuid',
        exact: true,
        component: lazy(() => import('views/Batch/components/Milking/components/add'))        
      },
       // Batch processes Routes
       {
        path: '/batch-process/milking-records/home',
        exact: true,
        component: lazy(() => import('views/Batch'))        
      },  
       // Batch processes - view processing queue
       {
        path: '/batch-process/milking-records/stage/:step',
        exact: true,
        component: lazy(() => import('views/Batch/components/Milking/components/view'))        
      },  
       
      
      {
        path: '/downloads',
        exact: true,
        component: lazy(() => import('views/Downloads'))        
      }, 
      
      
      
      
      
      {
        path: '/social-feed',
        exact: true,
        component: lazy(() => import('views/SocialFeed'))
      },
      {
        path: '/getting-started',
        exact: true,
        component: lazy(() => import('views/GettingStarted'))
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }        
    ]
  }
];

export default routes;
