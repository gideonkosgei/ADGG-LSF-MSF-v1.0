import {api,headers,headers_files} from '../configs';

//user authentication
export const endpoint_user_authentication = {
    url: `${api}/user/auth`,
    method: 'GET',
    headers: headers   
  }; 

//user profile details
export const endpoint_user_profile_details = {
  url: `${api}/user/`,
  method: 'GET',
  headers: headers   
};  

//user account info
export const endpoint_user_account_info = {
  url: `${api}/user/account-info`,
  method: 'GET',
  headers: headers   
};  

//timezone list
export const endpoint_timezones = {
  url: `${api}/timezones`,
  method: 'GET',
  headers: headers   
};   

//change password
export const endpoint_change_password = {
  url: `${api}/user/account/change-password/self-service`,
  method: 'PUT',
  headers: headers   
}; 

//reset forgotten password
export const endpoint_reset_password = {
  url: `${api}/user/account/reset-password/self-service`,
  method: 'PUT',
  headers: headers   
};

//country list
export const endpoint_countries = {
  url: `${api}/countries`,
  method: 'GET',
  headers: headers   
};  

  

//get admin units
export const endpoint_admin_units = {
  url: `${api}/admin-units/`,
  method: 'GET',
  headers: headers   
};  

//POST NEW USER ACCOUNT PROFILE
export const endpoint_new_user_account = {
  url: `${api}/users/org/create-user-account`,
  method: 'POST',
  headers: headers   
};  


//clients
export const endpoint_clients = {
  url: `${api}/clients/`,
  method: 'GET',
  headers: headers   
};  

//farm Details
export const endpoint_farm_details = {
  url: `${api}/farm/`,
  method: 'GET',
  headers: headers   
};  

//farm Details
export const endpoint_animal_statistics = {
  url: `${api}/animalStats/`,
  method: 'GET',
  headers: headers   
};  

//get all animals belonging to an organization
export const endpoint_animal_org = {
  url: `${api}/animals/org/`,
  method: 'GET',
  headers: headers   
}; 

//get all animal by id
export const endpoint_animal = {
  url: `${api}/animal/`,
  method: 'GET',
  headers: headers   
};

//get auth levels
export const endpoint_auth_levels = {
  url: `${api}/auth-levels`,
  method: 'GET',
  headers: headers   
};

//get auth levels
export const endpoint_auth_roles = {
  url: `${api}/auth-roles`,
  method: 'GET',
  headers: headers   
};

//get lookup to populate combo boxes
export const endpoint_lookup = {
  url: `${api}/lookup/`,
  method: 'GET',
  headers: headers   
}; 

//get lookup to populate combo boxes
export const endpoint_herd = {
  url: `${api}/herds`,
  method: 'GET',
  headers: headers   
};

export const endpoint_herd_animals = {
  url: `${api}/animal/herd`,
  method: 'GET',
  headers: headers   
};



//get weight & Growth Details for Specific Animal
export const endpoint_weight = {
  url: `${api}/events/weight/animal/`,
  method: 'GET',
  headers: headers   
};

//get specific weight & Growth Details : filtered by event ID
export const endpoint_weight_specific = {
  url: `${api}/events/weight/`,
  method: 'GET',
  headers: headers   
};

//Update weight & growth details
export const endpoint_weight_update = {
  url: `${api}/events/weight/`,
  method: 'PUT',
  headers: headers   
};


//post new weight event
export const endpoint_weight_add = {
  url: `${api}/events/weight`,
  method: 'POST',
  headers: headers   
};

//get weight summaries for charts
export const endpoint_weight_summary = {
  url: `${api}/events/weight/charts`,
  method: 'POST',
  headers: headers   
};

//get PD data for a specific animal
export const endpoint_pd = {
  url: `${api}/events/pd/animal/`,
  method: 'GET',
  headers: headers   
};
//Update PD Record
export const endpoint_pd_update = {
  url: `${api}/events/pd/`,
  method: 'PUT',
  headers: headers   
};


export const endpoint_pd_specific = {
  url: `${api}/events/pd/`,
  method: 'GET',
  headers: headers   
};

//post new weight event
export const endpoint_pd_add = {
  url: `${api}/events/pd`,
  method: 'POST',
  headers: headers   
};

//get sync data for a specific animal
export const endpoint_sync = {
  url: `${api}/events/sync/animal/`,
  method: 'GET',
  headers: headers   
};

//post sync event
export const endpoint_sync_add = {
  url: `${api}/events/sync`,
  method: 'POST',
  headers: headers   
};

//get specific sync Details : filtered by event ID
export const endpoint_sync_specific = {
  url: `${api}/events/sync/`,
  method: 'GET',
  headers: headers   
};

//put sync event
export const endpoint_sync_update = {
  url: `${api}/events/sync/`,
  method: 'PUT',
  headers: headers   
};



//get insemination data for a specific animal
export const endpoint_insemination = {
  url: `${api}/events/insemination/animal/`,
  method: 'GET',
  headers: headers   
};

export const endpoint_insemination_specific = {
  url: `${api}/events/insemination/`,
  method: 'GET',
  headers: headers   
};

//post insemination event
export const endpoint_insemination_add = {
  url: `${api}/events/insemination`,
  method: 'POST',
  headers: headers   
};

//Update Insemination Record
export const endpoint_insemination_update = {
  url: `${api}/events/insemination/`,
  method: 'PUT',
  headers: headers   
};

//get exit/disposal data for a specific animal
export const endpoint_exit = {
  url: `${api}/events/exit/animal/`,
  method: 'GET',
  headers: headers   
};
export const endpoint_exit_list = {
  url: `${api}/events/exit/list/`,
  method: 'GET',
  headers: headers   
};

//post exit event
export const endpoint_exit_add = {
  url: `${api}/events/exit`,
  method: 'POST',
  headers: headers   
};

//get specific Exit Details : filtered by event ID
export const endpoint_exit_specific = {
  url: `${api}/events/exit/`,
  method: 'GET',
  headers: headers   
};

//Update Exit & Disposal Details
export const endpoint_exit_update = {
  url: `${api}/events/exit/`,
  method: 'PUT',
  headers: headers   
};


//get calving data for a specific animal
export const endpoint_calving = {
  url: `${api}/events/calving/animal`,
  method: 'GET',
  headers: headers   
};

export const endpoint_calving_specific = {
  url: `${api}/events/calving/`,
  method: 'GET',
  headers: headers   
};

//post calving event
export const endpoint_calving_add = {
  url: `${api}/events/calving`,
  method: 'POST',
  headers: headers   
};

//Update Calving Record
export const endpoint_calving_update = {
  url: `${api}/events/calving/`,
  method: 'PUT',
  headers: headers   
};

//get milking data for a specific animal
export const endpoint_milking = {
  url: `${api}/events/milking/animal/`,
  method: 'GET',
  headers: headers   
};

//get milking parameter
export const endpoint_milking_parameter = {
  url: `${api}/events/milking/parameters/`,
  method: 'GET',
  headers: headers   
};

//get specific milking record : filtered by event ID
export const endpoint_milking_specific = {
  url: `${api}/events/milking/`,
  method: 'GET',
  headers: headers   
};
//post milking event
export const endpoint_milking_add = {
  url: `${api}/events/milking`,
  method: 'POST',
  headers: headers   
};

//post milking event
export const endpoint_milking_update = {
  url: `${api}/events/milking/`,
  method: 'PUT',
  headers: headers   
};

//get health data for a specific animal
export const endpoint_health = {
  url: `${api}/events/health/animal/`,
  method: 'GET',
  headers: headers   
};

//post health event
export const endpoint_health_add = {
  url: `${api}/events/health`,
  method: 'POST',
  headers: headers   
};

//get specific Health Details : filtered by event ID
export const endpoint_health_specific = {
  url: `${api}/events/health/`,
  method: 'GET',
  headers: headers   
};

//Update Health Record
export const endpoint_health_update = {
  url: `${api}/events/health/`,
  method: 'PUT',
  headers: headers   
};

//New animal Registration
export const endpoint_animal_add = {
  url: `${api}/animal`,
  method: 'POST',
  headers: headers   
};

//Update Animal Details
export const endpoint_animal_update = {
  url: `${api}/animal/`,
  method: 'PUT',
  headers: headers   
};


// parameterization
// Get limit parameter all
export const endpoint_parameter_limit_all = {
  url: `${api}/parameters/limit`,
  method: 'GET',
  headers: headers   
};

export const endpoint_parameter_limit_one = {
  url: `${api}/parameters/limit/`,
  method: 'GET',
  headers: headers   
};

export const endpoint_parameter_limit_add = {
  url: `${api}/parameters/limit`,
  method: 'POST',
  headers: headers   
};

export const endpoint_parameter_update = {
  url: `${api}/parameters/limit/`,
  method: 'PUT',
  headers: headers   
};


//system parameterization - local settings
// 1. get all setting for a particular organization/farm

export const endpoint_parameter_local_settings_org_all = {
  url: `${api}/parameters/local-settings/`,
  method: 'GET',
  headers: headers   
};

// 2. get specific setting for a particular organization/farm - filter by param/setting id
export const endpoint_parameter_local_settings_org_one = {
  url: `${api}/parameters/local-settings/param/`,
  method: 'GET',
  headers: headers   
};

// 3. create a local setting for a particular organization/farm
export const endpoint_parameter_local_settings_org_add = {
  url: `${api}/parameters/local-settings`,
  method: 'POST',
  headers: headers   
};

// 4. update a local setting for a particular organization/farm
export const endpoint_parameter_local_settings_org_update = {
  url: `${api}/parameters/local-settings/param/`,
  method: 'PUT',
  headers: headers   
};


//upload Batch Milking Records
export const endpoint_batch_milking_upload = {
  url: `${api}/batches/milking/upload`,
  method: 'POST',
  headers: headers   
};

//upload Batch weight & growth Records
export const endpoint_batch_weight_upload = {
  url: `${api}/batches/weight/upload`,
  method: 'POST',
  headers: headers   
};

//upload Batch PD Records
export const endpoint_batch_pd_upload = {
  url: `${api}/batches/pd/upload`,
  method: 'POST',
  headers: headers   
};

//upload Batch AI Records
export const endpoint_batch_ai_upload = {
  url: `${api}/batches/ai/upload`,
  method: 'POST',
  headers: headers   
};

//upload Batch sync Records
export const endpoint_batch_sync_upload = {
  url: `${api}/batches/sync/upload`,
  method: 'POST',
  headers: headers   
};

//upload Batch animal registration Records
export const endpoint_batch_animal_upload = {
  url: `${api}/batches/animal/upload`,
  method: 'POST',
  headers: headers   
};

//upload Batch calving Records
export const endpoint_batch_calving_upload = {
  url: `${api}/batches/calving/upload`,
  method: 'POST',
  headers: headers   
};


//upload Batch Exit & Disposal Records
export const endpoint_batch_exit_upload = {
  url: `${api}/batches/exit/upload`,
  method: 'POST',
  headers: headers   
  
};


// view  batched on validation queue
export const endpoint_batch_validation_view = {
  url: `${api}/batches/validation/`,
  method: 'GET',
  headers: headers   
};

export const endpoint_batch_validation_un_processed_view= {
  url: `${api}/batches/view/`,
  method: 'GET',
  headers: headers   
};

//deleted  batches
export const endpoint_batch_discarded_records= {
  url: `${api}/batches/deleted/`,
  method: 'GET',
  headers: headers   
};

//posted  batches
export const endpoint_batch_posted_records= {
  url: `${api}/batches/posted/`,
  method: 'GET',
  headers: headers   
};

// batch process -  actions (progress/discard/validate)
export const endpoint_batch_actions= {
  url: `${api}/batches/action`,
  method: 'POST',
  headers: headers   
};

export const endpoint_batch_errors= {
  url: `${api}/batches/errors/`,
  method: 'GET',
  headers: headers   
};

export const endpoint_batch_template= {
  url: `${api}/batches/template/`,
  method: 'GET',
  headers: headers   
};

//get calender items
export const endpoint_calender_items= {
  url: `${api}/calender/event/`,
  method: 'GET',
  headers: headers   
};

export const endpoint_calender_event_create= {
  url: `${api}/calender/event`,
  method: 'POST',
  headers: headers   
};

export const endpoint_event_setup= {
  url: `${api}/events/setup/`,
  method: 'GET',
  headers: headers   
};

export const endpoint_event_setup_all= {
  url: `${api}/events/setup`,
  method: 'GET',
  headers: headers   
}

export const endpoint_event_setup_update= {
  url: `${api}/events/setup/`,
  method: 'PUT',
  headers: headers   
}

//partners
export const endpoint_service_provider= {
  url: `${api}/partners/service-provider/`,
  method: 'GET',
  headers: headers   
}

export const endpoint_service_provider_add= {
  url: `${api}/partners/service-provider`,
  method: 'POST',
  headers: headers   
};
export const endpoint_service_provider_edit= {
  url: `${api}/partners/service-provider/`,
  method: 'PUT',
  headers: headers   
};


//agents
export const endpoint_agent= {
  url: `${api}/partners/agent/`,
  method: 'GET',
  headers: headers   
}
export const endpoint_agent_add= {
  url: `${api}/partners/agent`,
  method: 'POST',
  headers: headers   
};
export const endpoint_agent_edit= {
  url: `${api}/partners/agent/`,
  method: 'PUT',
  headers: headers   
};


// AI Straws
//agents
export const endpoint_straw= {
  url: `${api}/straws/`,
  method: 'GET',
  headers: headers   
}
export const endpoint_straw_add= {
  url: `${api}/straws`,
  method: 'POST',
  headers: headers   
};
export const endpoint_straw_edit= {
  url: `${api}/straws/`,
  method: 'PUT',
  headers: headers   
};


// Administration : userlist
export const endpoint_user_list= {
  url: `${api}/users/list`,
  method: 'GET',
  headers: headers   
}

/*export const endpoint_straw_add= {
  url: `${api}/straws`,
  method: 'POST',
  headers: headers   
};
export const endpoint_straw_edit= {
  url: `${api}/straws/`,
  method: 'PUT',
  headers: headers   
};*/

// all organizations
export const endpoint_orgs= {
  url: `${api}/orgs`,
  method: 'GET',
  headers: headers   
}

// org access list
export const endpoint_orgs_access= {
  url: `${api}/orgs/access/`,
  method: 'GET',
  headers: headers   
}

// org access list put
export const endpoint_orgs_access_update= {
  url: `${api}/orgs/access/`,
  method: 'PUT',
  headers: headers   
}

// org access switch
export const endpoint_orgs_access_switch = {
  url: `${api}/orgs/switch/access`,
  method: 'PUT',
  headers: headers   
}


// DASHBOARD: ANALYTICS
// TOP COWS
export const endpoint_top_cows = {
  url: `${api}/stats/top-cows/`,
  method: 'GET',
  headers: headers   
}


// ANNUAL ANIMAL PERFORMANCE
export const endpoint_annual_milk_performance = {
  url: `${api}/stats/milk-performance-comparator/`,
  method: 'GET',
  headers: headers   
}

// BREEDS DISTRIBUTION
export const endpoint_breeds_distribution = {
  url: `${api}/stats/breed-distribution/`,
  method: 'GET',
  headers: headers   
}

// DASHBOARD OVERVIEW
export const endpoint_dashboard_overview = {
  url: `${api}/stats/dashboard-overview/`,
  method: 'GET',
  headers: headers   
}

// UNPROCESSED GRADUATION LIST
export const endpoint_graduation_list = {
  url: `${api}/graduation/list/`,
  method: 'GET',
  headers: headers   
}

//  GRADUATION RECORD
export const endpoint_graduation_record = {
  url: `${api}/graduation/record/`,
  method: 'GET',
  headers: headers   
}

export const endpoint_graduation_record_edit = {
  url: `${api}/graduation/record/`,
  method: 'PUT',
  headers: headers   
}

// VIEW BACKGROUND PROCESS 
export const endpoint_background_process_view_all = {
  url: `${api}/background-process/org/`,
  method: 'GET',
  headers: headers   
}

export const endpoint_background_process_view_one = {
  url: `${api}/background-process/`,
  method: 'GET',
  headers: headers   
}

// edit background process record
export const endpoint_background_process_edit = {
  url: `${api}/background-process/`,
  method: 'PUT',
  headers: headers   
}


// Analytics - Lactation Table
export const endpoint_lactation_table = {
  url: `${api}/stats/lactation-table/`,
  method: 'GET',
  headers: headers   
}

// Analytics - Due Dates Table
export const endpoint_due_date = {
  url: `${api}/stats/due-dates/`,
  method: 'GET',
  headers: headers   
}

// Analytics - PD action List Table
export const endpoint_pd_action_list = {
  url: `${api}/stats/pd-action-list/`,
  method: 'GET',
  headers: headers   
}

// Analytics - Service action List Table
export const endpoint_service_action_list = {
  url: `${api}/stats/service-action-list/`,
  method: 'GET',
  headers: headers   
}

// Analytics - Health Summary Table
export const endpoint_health_summary_table = {
  url: `${api}/stats/health-management-trends/`,
  method: 'GET',
  headers: headers   
}

// Analytics - Lactation Curve
export const endpoint_lactation_curve = {
  url: `${api}/stats/lactation-curve/`,
  method: 'GET',
  headers: headers   
}

// Post hoof health event
export const endpoint_hoof_health_add = {
  url: `${api}/events/hoof-health`,
  method: 'POST',
  headers: headers   
};

export const endpoint_hoof_health_edit = {
  url: `${api}/events/hoof-health/`,
  method: 'PUT',
  headers: headers   
};

//Get all hoof health Records
export const endpoint_hoof_health_get = {
  url: `${api}/events/hoof-health/`,
  method: 'GET',
  headers: headers   
};


// Post animal injury event record
export const endpoint_injury_add = {
  url: `${api}/events/injury`,
  method: 'POST',
  headers: headers   
};

// Edit animal injury event record
export const endpoint_injury_edit = {
  url: `${api}/events/injury/`,
  method: 'PUT',
  headers: headers   
};

//Get all animal injury event records
export const endpoint_injury_get = {
  url: `${api}/events/injury/`,
  method: 'GET',
  headers: headers   
};


// Post parasite infection event record
export const endpoint_parasite_infection_add = {
  url: `${api}/events/parasite-infection`,
  method: 'POST',
  headers: headers   
};

// Edit parasite infection event record
export const endpoint_parasite_infection_edit = {
  url: `${api}/events/parasite-infection/`,
  method: 'PUT',
  headers: headers   
};

//Get all parasite infection event records
export const endpoint_parasite_infection_get = {
  url: `${api}/events/parasite-infection/`,
  method: 'GET',
  headers: headers   
};

// Post Hoof Treatment event record
export const endpoint_hoof_treatment_add = {
  url: `${api}/events/hoof-treatment`,
  method: 'POST',
  headers: headers   
};

// Edit parasite infection event record
export const endpoint_hoof_treatment_edit = {
  url: `${api}/events/hoof-treatment/`,
  method: 'PUT',
  headers: headers   
};

//Get all parasite infection event records
export const endpoint_hoof_treatment_get = {
  url: `${api}/events/hoof-treatment/`,
  method: 'GET',
  headers: headers   
};

// Post vaccination event record
export const endpoint_vaccination_add = {
  url: `${api}/events/vaccination`,
  method: 'POST',
  headers: headers   
};

// Edit vaccination event record
export const endpoint_vaccination_edit = {
  url: `${api}/events/vaccination/`,
  method: 'PUT',
  headers: headers   
};

//Get all vaccination event records
export const endpoint_vaccination_get = {
  url: `${api}/events/vaccination/`,
  method: 'GET',
  headers: headers   
};

// Herd level Milking Summary
export const endpoint_herd_milking_cow_summary = {
  url: `${api}/stats/herd-milking-summary/`,
  method: 'GET',
  headers: headers   
}

//get weight curve data
export const endpoint_weight_growth_curve = {
  url: `${api}/stats/weight-growth-curve/`,
  method: 'GET',
  headers: headers   
};

export const endpoint_get_lactation_number= {
  url: `${api}/parameters/lactation-number/`,
  method: 'GET',
  headers: headers   
}

// view specific batch record
export const endpoint_batch_record = {
  url: `${api}/batches/record/any`,
  method: 'GET',
  headers: headers   
};

//Data capture Validations
export const endpoint_dp_validations = {
  url: `${api}/validations/events/data-capture`,
  method: 'GET',
  headers: headers   
};

//orginization profile details
export const endpoint_org_details = {
  url: `${api}/org`,
  method: 'GET',
  headers: headers   
};

//upload org profile logo
export const endpoint_org_profile_logo = {
  url: `${api}/org/upload/profile-logo`,
  method: 'POST',
  headers: headers_files  
};
//view avatar
export const endpoint_get_avatar = {
  url: `${api}/org/profile-logo`,
  method: 'GET',
  headers: headers  
};

export const endpoint_milkRevalidate = {
  url: `${api}/batches/milking/modify-and-revalidate`,
  method: 'PUT',
  headers: headers   
};

export const endpoint_animalRevalidate = {
  url: `${api}/batches/animal/modify-and-revalidate`,
  method: 'PUT',
  headers: headers   
};


export const endpoint_weightRevalidate = {
  url: `${api}/batches/weight/modify-and-revalidate`,
  method: 'PUT',
  headers: headers   
};

export const endpoint_aiRevalidate = {
  url: `${api}/batches/ai/modify-and-revalidate`,
  method: 'PUT',
  headers: headers   
};

export const endpoint_animals_by_type = {
  url: `${api}/animal/type`,
  method: 'GET',
  headers: headers   
};

//get batch types
export const endpoint_batch_types = {
  url: `${api}/batches/types/all`,
  method: 'GET',
  headers: headers   
}; 

//get batch stages
export const endpoint_batch_stages = {
  url: `${api}/batches/stages/all`,
  method: 'GET',
  headers: headers   
}; 

//get batch statuses
export const endpoint_batch_status = {
  url: `${api}/batches/status/all`,
  method: 'GET',
  headers: headers   
}; 

//get batch validation statuses
export const endpoint_batch_validation_status = {
  url: `${api}/batches/validation-status/all`,
  method: 'GET',
  headers: headers   
}; 

//get batch report all
export const endpoint_batch_report_all = {
  url: `${api}/batches/report/all`,
  method: 'GET',
  headers: headers   
}; 

// add herd
export const endpoint_herd_add= {
  url: `${api}/herds`,
  method: 'POST',
  headers: headers   
};

// update herd
export const endpoint_herd_update= {
  url: `${api}/herds`,
  method: 'PUT',
  headers: headers   
};


//get farms
export const endpoint_farms = {
  url: `${api}/farms`,
  method: 'GET',
  headers: headers   
};  

// add farm
export const endpoint_farm_add= {
  url: `${api}/farms`,
  method: 'POST',
  headers: headers   
};

// update farm
export const endpoint_farm_update= {
  url: `${api}/farms`,
  method: 'PUT',
  headers: headers   
};







