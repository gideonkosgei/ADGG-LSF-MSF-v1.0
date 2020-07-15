import moment from 'moment';
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

// get counties
export const getCounties =  function (config,country_id) {   
  const options = {
    url:`${config.url}${country_id}`,
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


// get sub counties
export const getSubCounties =  function (config,country_id,county_id) {   
  const options = {
    url:`${config.url}${country_id}/county/${county_id}`,  
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


// get wards
export const getWards =  function (config,country_id,county_id,sub_county_id) {   
  const options = {
    url:`${config.url}${country_id}/county/${county_id}/sub-county/${sub_county_id}`,  
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


// get villages
export const getVillages =  function (config,country_id,county_id,sub_county_id,ward_id) {   
  const options = {
    url:`${config.url}${country_id}/county/${county_id}/sub-county/${sub_county_id}/ward/${ward_id}`,  
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

// get clients
export const getClients =  function (config,organisation_id) {   
  const options = {
    url:`${config.url}${organisation_id}`,
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

// get farm details
export const getFarmDetails =  function (config,farm_id) {   
  const options = {
    url:`${config.url}${farm_id}`,
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

// get animal overview statistics
export const getAnimalStats =  function (config,organisation_id) {   
  const options = {
    url:`${config.url}${organisation_id}`,
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


// get all animals that belong to an organization
export const getAnimalsOrg =  function (config,organisation_id) {   
  const options = {
    url:`${config.url}${organisation_id}`,
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

// get specific animal by ID
export const getAnimal =  function (config,id) {   
  const options = {
    url:`${config.url}${id}`,
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

// get lookup values
export const getLookups =  function (config,id) {   
  const options = {
    url:`${config.url}'${id}'`,
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

// get lookup values
export const getHerds =  function (config,id) {   
  const options = {
    url:`${config.url}'${id}'`,
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

// get weight & growth Deatials
export const getWeights =  function (config,id) {   
  const options = {
    url:`${config.url}'${id}'`,
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

// add bew weight event
export const postWeight =  function (config,animal_id,values,user_id) {  
  let {body_length,body_score,field_agent_id,heart_girth,weight,weight_date} = values;
  body_length = (typeof body_length === 'undefined')? '0':body_length.replace('','0');  
  body_score = (typeof body_score === 'undefined')? '0':body_score.replace('','0');
  field_agent_id = (typeof field_agent_id === 'undefined')? '0':field_agent_id.replace('','0');
  heart_girth = (typeof heart_girth === 'undefined')? '0':heart_girth.replace('','0');
  weight = (typeof weight === 'undefined')? '0':weight.replace('','0');
  weight_date = (typeof weight_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):weight_date;  
 
  const body = {
    "animal_id": animal_id,
    "body_length": body_length,
    "heart_girth": heart_girth,
    "weight" : weight,
    "body_score": body_score,
    "data_collection_date": weight_date,
    "field_agent_id": field_agent_id,
    "created_by": user_id
  };


  const options = {
    url:`${config.url}`,
    method: config.method,
    headers: config.headers,
    data: body  
  }    
  return new Promise((resolve, reject) => {
    axios(options)
    .then(res => {           
        resolve(res.data);
    })    
    .catch(err => reject(err));
  });       
}















