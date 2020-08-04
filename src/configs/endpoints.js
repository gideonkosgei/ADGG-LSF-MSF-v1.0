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

//counties
export const endpoint_counties = {
  url: `${api}/admin-units/country/`,
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

//get insemination data for a specific animal
export const endpoint_insemination = {
  url: `${api}/events/insemination/animal/`,
  method: 'GET',
  headers: headers   
};

//post insemination event
export const endpoint_insemination_add = {
  url: `${api}/events/insemination`,
  method: 'POST',
  headers: headers   
};

//get exit/disposal data for a specific animal
export const endpoint_exit = {
  url: `${api}/events/exit/animal/`,
  method: 'GET',
  headers: headers   
};

//post exit event
export const endpoint_exit_add = {
  url: `${api}/events/exit`,
  method: 'POST',
  headers: headers   
};


//get calving data for a specific animal
export const endpoint_calving = {
  url: `${api}/events/calving/animal/`,
  method: 'GET',
  headers: headers   
};

//post calving event
export const endpoint_calving_add = {
  url: `${api}/events/calving`,
  method: 'POST',
  headers: headers   
};

//get milking data for a specific animal
export const endpoint_milking = {
  url: `${api}/events/milking/animal/`,
  method: 'GET',
  headers: headers   
};

//post milking event
export const endpoint_milking_add = {
  url: `${api}/events/milking`,
  method: 'POST',
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

