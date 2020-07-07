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


