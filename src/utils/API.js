const axios = require('axios');

// user Authentication  
export const authenticate =  function (config,username,password) {     
  const data = {
    username:username,
    password:password
  };
  const options = {
    url: config.url,
    method: config.method,
    headers: config.headers,   
    params: data
  }

  return new Promise((resolve, reject) => {
    axios(options).then(res => {        
        resolve(res.data);
    }).catch(err => reject(err));
});
       
}

// user profile  
export const getProfileDetails =  function (config,user_id) {   
  const options = {
    url: `${config.url}${user_id}`,
    method: config.method,
    headers: config.headers    
  }  
  return new Promise((resolve, reject) => {
    axios(options)
    .then(res => {        
        resolve(res.data);
    })
    .catch(err => reject(err));
});       
}


// user timezones 
export const getTimezones =  function (config) {   
  const options = {
    url: `${config.url}`,
    method: config.method,
    headers: config.headers    
  }  
  return new Promise((resolve, reject) => {
    axios(options)
    .then(res => {        
        resolve(res.data);
    })
    .catch(err => reject(err));
});       
}


// user countries
export const getCountries =  function (config) {   
  const options = {
    url: `${config.url}`,
    method: config.method,
    headers: config.headers    
  }  
  return new Promise((resolve, reject) => {
    axios(options)
    .then(res => {        
        resolve(res.data);
    })
    .catch(err => reject(err));
});       
}


// country by id
export const getCountryById =  function (config,id) {   
  const options = {
    url: `${config.url}/${id}`,
    method: config.method,
    headers: config.headers    
  }  
 
  return new Promise((resolve, reject) => {
    axios(options)
    .then(res => {             
        resolve(res.data);
    })
    .catch(err => reject(err));
});       
}






