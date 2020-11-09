import {api,headers} from '../configs';

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

//timezone list
export const endpoint_timezones = {
  url: `${api}/timezones`,
  method: 'GET',
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

//get lookup to populate combo boxes
export const endpoint_lookup = {
  url: `${api}/lookup/`,
  method: 'GET',
  headers: headers   
}; 

//get lookup to populate combo boxes
export const endpoint_herd = {
  url: `${api}/herds/org/`,
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
  url: `${api}/events/calving/animal/`,
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


// view milking batched on validation queue
export const endpoint_batch_milk_validation_view = {
  url: `${api}/batches/milking/validation/`,
  method: 'GET',
  headers: headers   
};

export const endpoint_batch_milk_validation_un_processed_view= {
  url: `${api}/batches/milking/`,
  method: 'GET',
  headers: headers   
};

//deleted milking batches
export const endpoint_batch_milk_discarded_records= {
  url: `${api}/batches/deleted/milking/`,
  method: 'GET',
  headers: headers   
};

//posted milking batches
export const endpoint_batch_milk_posted_records= {
  url: `${api}/batches/posted/milking/`,
  method: 'GET',
  headers: headers   
};

// batch process - milking actions
export const endpoint_batch_milk_actions= {
  url: `${api}/batches/milking/action`,
  method: 'POST',
  headers: headers   
};

export const endpoint_batch_milk_errors= {
  url: `${api}/batches/milking/errors/`,
  method: 'GET',
  headers: headers   
};

export const endpoint_batch_milk_template= {
  url: `${api}/batches/milking/list/`,
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
















