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
     /* { // this should be removed
        path: '/management/animal/trendss/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Analytics'))
      }, */   
                 
     {
        path: '/management/analytics/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Analytics'))
      },
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
      {
        path: '/management/health/:tab',
        exact: true,
        component: lazy(() => import('views/Animals/components/Health'))
      },
      {
        path: '/management/health/hoof-health/add/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Health/components/HoofHealth/components/add'))          
      },
      {
        path: '/management/health/hoof-health/view/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Health/components/HoofHealth'))          
      },
      {
        path: '/management/health/hoof-health/edit/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Health/components/HoofHealth/components/edit'))          
      },

      {
        path: '/management/health/hoof-treatment/add/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Health/components/HoofTreatment/components/add'))          
      },
      {
        path: '/management/health/hoof-treatment/view/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Health/components/HoofTreatment'))          
      },
      {
        path: '/management/health/hoof-treatment/edit/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Health/components/HoofTreatment/components/edit'))          
      },
      {
        path: '/management/health/vaccination/add/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Health/components/Vaccination/components/add'))          
      },
      {
        path: '/management/health/vaccination/view/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Health/components/Vaccination'))          
      },
      {
        path: '/management/health/vaccination/edit/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Health/components/Vaccination/components/edit'))          
      },

      {
        path: '/management/health/injury/add/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Health/components/Injury/components/add'))          
      },
      {
        path: '/management/health/injury/view/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Health/components/Injury'))  
      },
      {
        path: '/management/health/injury/edit/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Health/components/Injury/components/edit'))          
      },
     
      {
        path: '/management/health/parasite-infection/add/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Health/components/ParasiteInfection/components/add'))          
      },
      {
        path: '/management/health/parasite-infection/edit/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Health/components/ParasiteInfection/components/edit'))          
      },
      {
        path: '/management/health/parasite-infection/view/:id',
        exact: true,
        component: lazy(() => import('views/Animals/components/Health/components/ParasiteInfection'))  
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
        path: '/management/herds',
        exact: true,
        component: lazy(() => import('views/Herds/components/Herds/components/view'))
      },
      {
        path: '/management/herds/add',
        exact: true,
        component: lazy(() => import('views/Herds/components/Herds/components/add'))        
      },
      {
        path: '/management/herds/edit/:id',
        exact: true,
        component: lazy(() => import('views/Herds/components/Herds/components/edit'))        
      },

     /* {
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
      },*/
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
        path: '/management/straws/view/:status',
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

      //GRADUATION
      // View Graduation List
      {
      path: '/management/graduation/view/:status',
      exact: true,
      component: lazy(() => import('views/Graduation/components/Graduation/components/view'))        
      },  
      // Process Graduation Record
      {
        path: '/management/graduation/edit/:id',
        exact: true,
        component: lazy(() => import('views/Graduation/components/Graduation/components/edit'))        
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
        path: '/switch/org',
        exact: true,
        component: lazy(() => import('views/Settings/components/SwitchOrg'))
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

       //Administration
       {
        path: '/administration/org',
        exact: true,
        component: lazy(() => import('views/Administration/components/Organization/components/view'))        
      },       
      {
        path: '/administration/org/edit/:id/:name',
        exact: true,
        component: lazy(() => import('views/Administration/components/Organization/components/edit'))        
      },
      {
        path: '/administration/upload-logo',
        exact: true,
        component: lazy(() => import('views/Administration/components/SystemUploads'))        
      },
      {
        path: '/administration/org/profile',
        exact: true,
        component: lazy(() => import('views/Administration/components/Profile'))        
      },
      {
        path: '/administration/org/user-accounts',
        exact: true,
        component: lazy(() => import('views/Administration/components/UserAccounts'))        
      },
      {
        path: '/administration/org/user-accounts/add',
        exact: true,
        component: lazy(() => import('views/Administration/components/UserAccounts/components/add'))        
      },
      {
        path: '/administration/org/user-accounts/edit/:id',
        exact: true,
        component: lazy(() => import('views/Administration/components/UserAccounts/components/edit'))        
      },

      // BACKGROUND-PROCESS VIEW
      {
        path: '/background-processes/org',
        exact: true,
        component: lazy(() => import('views/Administration/components/BackgroundProcesses/components/view'))        
      },   
      {
        path: '/background-processes/org/edit/:id',
        exact: true,
        component: lazy(() => import('views/Administration/components/BackgroundProcesses/components/edit'))        
      }, 
      

      //uploads

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
      //posted milk batches
      {
        path: '/batch-process/milking-records/posted',
        exact: true,
        component: lazy(() => import('views/Batch/components/Milking/components/posted'))        
      }, 
      {
        path: '/batch-process/milking-records/finalized/:uuid',
        exact: true,
        component: lazy(() => import('views/Batch/components/Milking/components/finalized'))        
      }, 
      {
        path: '/batch-process/milking-list',
        exact: true,
        component: lazy(() => import('views/Batch/components/Milking/components/milk_list'))        
      }, 
      {
        path: '/batch-process/ai/template',
        exact: true,
        component: lazy(() => import('views/Batch/components/AI/components/template'))        
      }, 

      {
        path: '/batch-process/calving/template',
        exact: true,
        component: lazy(() => import('views/Batch/components/Calving/components/template'))        
      }, 
      {
        path: '/batch-process/pd/template',
        exact: true,
        component: lazy(() => import('views/Batch/components/PD/components/template'))        
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

      /*
        Weight & Growth Batch Processes
      */

      {
        path: '/batch-process/weight/home',
        exact: true,
        component: lazy(() => import('views/Batch/components/Weight/components/home'))        
      },  

       // Add New Batch processes Routes
       {
        path: '/batch-process/weight/add',
        exact: true,
        component: lazy(() => import('views/Batch/components/Weight/components/add'))        
      }, 
      // Deleted  batches
      {
        path: '/batch-process/weight/deleted',
        exact: true,
        component: lazy(() => import('views/Batch/components/Weight/components/deleted'))        
      }, 
      //Posted Batches
      {
        path: '/batch-process/weight/posted',
        exact: true,
        component: lazy(() => import('views/Batch/components/Weight/components/posted'))        
      }, 
      {
        path: '/batch-process/weight/finalized/:uuid',
        exact: true,
        component: lazy(() => import('views/Batch/components/Weight/components/finalized'))        
      },

      // weight template
      {
        path: '/batch-process/weight/template',
        exact: true,
        component: lazy(() => import('views/Batch/components/Weight/components/weight_list'))        
      }, 
       // Batch processes Routes
       {
        path: '/batch-process/weight/home',
        exact: true,
        component: lazy(() => import('views/Batch'))        
      },  
       // Batch processes - view processing queue
       {
        path: '/batch-process/weight/stage/:step',
        exact: true,
        component: lazy(() => import('views/Batch/components/Weight/components/view'))        
      },  
      // Batch processes Routes subsequent Steps
      {
        path: '/batch-process/weight/add/:uuid',
        exact: true,
        component: lazy(() => import('views/Batch/components/Weight/components/add'))        
      },

      /*
        PD Batch Processes
      */
     {
        path: '/batch-process/pd/home',
        exact: true,
        component: lazy(() => import('views/Batch/components/PD/components/home'))        
      },  

       // Add New Batch processes Routes
       {
        path: '/batch-process/pd/add',
        exact: true,
        component: lazy(() => import('views/Batch/components/PD/components/add'))        
      }, 
      // Deleted  batches
      {
        path: '/batch-process/pd/deleted',
        exact: true,
        component: lazy(() => import('views/Batch/components/PD/components/deleted'))        
      }, 
      //Posted Batches
      {
        path: '/batch-process/pd/posted',
        exact: true,
        component: lazy(() => import('views/Batch/components/PD/components/posted'))        
      }, 
      {
        path: '/batch-process/pd/finalized/:uuid',
        exact: true,
        component: lazy(() => import('views/Batch/components/PD/components/finalized'))        
      },

      
       // Batch processes Routes
       {
        path: '/batch-process/pd/home',
        exact: true,
        component: lazy(() => import('views/Batch'))        
      },  
       // Batch processes - view processing queue
       {
        path: '/batch-process/pd/stage/:step',
        exact: true,
        component: lazy(() => import('views/Batch/components/PD/components/view'))        
      },  
      // Batch processes Routes subsequent Steps
      {
        path: '/batch-process/pd/add/:uuid',
        exact: true,
        component: lazy(() => import('views/Batch/components/PD/components/add'))        
      },


      /*
        PD Batch Processes
      */
     {
        path: '/batch-process/pd/home',
        exact: true,
        component: lazy(() => import('views/Batch/components/PD/components/home'))        
      },  

       // Add New Batch processes Routes
       {
        path: '/batch-process/pd/add',
        exact: true,
        component: lazy(() => import('views/Batch/components/PD/components/add'))        
      }, 
      // Deleted  batches
      {
        path: '/batch-process/pd/deleted',
        exact: true,
        component: lazy(() => import('views/Batch/components/PD/components/deleted'))        
      }, 
      //Posted Batches
      {
        path: '/batch-process/pd/posted',
        exact: true,
        component: lazy(() => import('views/Batch/components/PD/components/posted'))        
      }, 
      {
        path: '/batch-process/pd/finalized/:uuid',
        exact: true,
        component: lazy(() => import('views/Batch/components/PD/components/finalized'))        
      },

      
       // Batch processes Routes
       {
        path: '/batch-process/pd/home',
        exact: true,
        component: lazy(() => import('views/Batch'))        
      },  
       // Batch processes - view processing queue
       {
        path: '/batch-process/pd/stage/:step',
        exact: true,
        component: lazy(() => import('views/Batch/components/PD/components/view'))        
      },  
      // Batch processes Routes subsequent Steps
      {
        path: '/batch-process/pd/add/:uuid',
        exact: true,
        component: lazy(() => import('views/Batch/components/PD/components/add'))        
      },




      /*
        Exit Batch Processes
      */
     {
      path: '/batch-process/exit/home',
      exact: true,
      component: lazy(() => import('views/Batch/components/Exit/components/home'))        
    },  

     // Add New Batch processes Routes
     {
      path: '/batch-process/exit/add',
      exact: true,
      component: lazy(() => import('views/Batch/components/Exit/components/add'))        
    }, 
    // Deleted  batches
    {
      path: '/batch-process/exit/deleted',
      exact: true,
      component: lazy(() => import('views/Batch/components/Exit/components/deleted'))        
    }, 
    //Posted Batches
    {
      path: '/batch-process/exit/posted',
      exact: true,
      component: lazy(() => import('views/Batch/components/Exit/components/posted'))        
    }, 
    {
      path: '/batch-process/exit/finalized/:uuid',
      exact: true,
      component: lazy(() => import('views/Batch/components/Exit/components/finalized'))        
    },
     // Batch processes Routes
     {
      path: '/batch-process/exit/home',
      exact: true,
      component: lazy(() => import('views/Batch'))        
    },  
     // Batch processes - view processing queue
     {
      path: '/batch-process/exit/stage/:step',
      exact: true,
      component: lazy(() => import('views/Batch/components/Exit/components/view'))        
    },  
    // Batch processes Routes subsequent Steps
    {
      path: '/batch-process/exit/add/:uuid',
      exact: true,
      component: lazy(() => import('views/Batch/components/Exit/components/add'))        
    },


  
      /*
        AI Batch Processes
      */
     {
      path: '/batch-process/ai/home',
      exact: true,
      component: lazy(() => import('views/Batch/components/AI/components/home'))        
    },  

     // Add New Batch processes Routes
     {
      path: '/batch-process/ai/add',
      exact: true,
      component: lazy(() => import('views/Batch/components/AI/components/add'))        
    }, 
    // Deleted  batches
    {
      path: '/batch-process/ai/deleted',
      exact: true,
      component: lazy(() => import('views/Batch/components/AI/components/deleted'))        
    }, 
    //Posted Batches
    {
      path: '/batch-process/ai/posted',
      exact: true,
      component: lazy(() => import('views/Batch/components/AI/components/posted'))        
    }, 
    {
      path: '/batch-process/ai/finalized/:uuid',
      exact: true,
      component: lazy(() => import('views/Batch/components/AI/components/finalized'))        
    },
     // Batch processes Routes
     {
      path: '/batch-process/ai/home',
      exact: true,
      component: lazy(() => import('views/Batch'))        
    },  
     // Batch processes - view processing queue
     {
      path: '/batch-process/ai/stage/:step',
      exact: true,
      component: lazy(() => import('views/Batch/components/AI/components/view'))        
    },  
    // Batch processes Routes subsequent Steps
    {
      path: '/batch-process/ai/add/:uuid',
      exact: true,
      component: lazy(() => import('views/Batch/components/AI/components/add'))        
    },

    
      /*
        Animal Registration Batch Processes
      */
     {
      path: '/batch-process/animal/home',
      exact: true,
      component: lazy(() => import('views/Batch/components/Animal/components/home'))        
    },  

     // Add New Batch processes Routes
     {
      path: '/batch-process/animal/add',
      exact: true,
      component: lazy(() => import('views/Batch/components/Animal/components/add'))        
    }, 
    // Deleted  batches
    {
      path: '/batch-process/animal/deleted',
      exact: true,
      component: lazy(() => import('views/Batch/components/Animal/components/deleted'))        
    }, 
    //Posted Batches
    {
      path: '/batch-process/animal/posted',
      exact: true,
      component: lazy(() => import('views/Batch/components/Animal/components/posted'))        
    }, 
    {
      path: '/batch-process/animal/finalized/:uuid',
      exact: true,
      component: lazy(() => import('views/Batch/components/Animal/components/finalized'))        
    },
     // Batch processes Routes
     {
      path: '/batch-process/animal/home',
      exact: true,
      component: lazy(() => import('views/Batch'))        
    },  
     // Batch processes - view processing queue
     {
      path: '/batch-process/animal/stage/:step',
      exact: true,
      component: lazy(() => import('views/Batch/components/Animal/components/view'))        
    },  
    // Batch processes Routes subsequent Steps
    {
      path: '/batch-process/animal/add/:uuid',
      exact: true,
      component: lazy(() => import('views/Batch/components/Animal/components/add'))        
    },


    
      /*
        Calving Batch Processes
      */
     {
      path: '/batch-process/calving/home',
      exact: true,
      component: lazy(() => import('views/Batch/components/Calving/components/home'))        
    },  

     // Add New Batch processes Routes
     {
      path: '/batch-process/calving/add',
      exact: true,
      component: lazy(() => import('views/Batch/components/Calving/components/add'))        
    }, 
    // Deleted  batches
    {
      path: '/batch-process/calving/deleted',
      exact: true,
      component: lazy(() => import('views/Batch/components/Calving/components/deleted'))        
    }, 
    //Posted Batches
    {
      path: '/batch-process/calving/posted',
      exact: true,
      component: lazy(() => import('views/Batch/components/Calving/components/posted'))        
    }, 
    {
      path: '/batch-process/calving/finalized/:uuid',
      exact: true,
      component: lazy(() => import('views/Batch/components/Calving/components/finalized'))        
    },
     // Batch processes Routes
     {
      path: '/batch-process/calving/home',
      exact: true,
      component: lazy(() => import('views/Batch'))        
    },  
     // Batch processes - view processing queue
     {
      path: '/batch-process/calving/stage/:step',
      exact: true,
      component: lazy(() => import('views/Batch/components/Calving/components/view'))        
    },  
    // Batch processes Routes subsequent Steps
    {
      path: '/batch-process/calving/add/:uuid',
      exact: true,
      component: lazy(() => import('views/Batch/components/Calving/components/add'))        
    },






    /*
        Sync Batch Processes
      */
     {
      path: '/batch-process/sync/home',
      exact: true,
      component: lazy(() => import('views/Batch/components/Sync/components/home'))        
    },  

     // Add New Batch processes Routes
     {
      path: '/batch-process/sync/add',
      exact: true,
      component: lazy(() => import('views/Batch/components/Sync/components/add'))        
    }, 
    // Deleted  batches
    {
      path: '/batch-process/sync/deleted',
      exact: true,
      component: lazy(() => import('views/Batch/components/Sync/components/deleted'))        
    }, 
    //Posted Batches
    {
      path: '/batch-process/sync/posted',
      exact: true,
      component: lazy(() => import('views/Batch/components/Sync/components/posted'))        
    }, 
    {
      path: '/batch-process/sync/finalized/:uuid',
      exact: true,
      component: lazy(() => import('views/Batch/components/Sync/components/finalized'))        
    },
     // Batch processes Routes
     {
      path: '/batch-process/sync/home',
      exact: true,
      component: lazy(() => import('views/Batch'))        
    },  
     // Batch processes - view processing queue
     {
      path: '/batch-process/sync/stage/:step',
      exact: true,
      component: lazy(() => import('views/Batch/components/Sync/components/view'))        
    },  
    // Batch processes Routes subsequent Steps
    {
      path: '/batch-process/sync/add/:uuid',
      exact: true,
      component: lazy(() => import('views/Batch/components/Sync/components/add'))        
    },

    //reports
    {
      path: '/reports/events/milking',
      exact: true,
      component: lazy(() => import('views/Reports/components/Events/components/milking/'))        
    },
    {
      path: '/reports/events/weight',
      exact: true,
      component: lazy(() => import('views/Reports/components/Events/components/weight/'))        
    },
    {
      path: '/reports/events/ai',
      exact: true,
      component: lazy(() => import('views/Reports/components/Events/components/ai/'))        
    },
    {
      path: '/reports/events/calving',
      exact: true,
      component: lazy(() => import('views/Reports/components/Events/components/calving/'))        
    },
    {
      path: '/reports/events/pd',
      exact: true,
      component: lazy(() => import('views/Reports/components/Events/components/pd/'))        
    },
    {
      path: '/reports/events/sync',
      exact: true,
      component: lazy(() => import('views/Reports/components/Events/components/sync/'))        
    },
    {
      path: '/reports/events/exit',
      exact: true,
      component: lazy(() => import('views/Reports/components/Events/components/exit/'))        
    },


    {
      path: '/reports/batches',
      exact: true,
      component: lazy(() => import('views/Reports/components/Batches/components/home'))        
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
