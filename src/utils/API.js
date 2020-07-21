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
// add bew weight event
export const getWeightSummaries =  function (config,animal_id,year) {  

  const body = {
    "animal_id": animal_id,
    "year": year    
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

// get PD events 
export const getPD =  function (config,id) {   
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

// add new pd event
export const postPd =  function (config,animal_id,values,user_id) { 

  let {cost,exam_time,service_date,pd_stage,pd_results,pd_method,body_score,field_agent_id,exam_date} = values;
  cost = (typeof cost === 'undefined')? '0':cost.replace('','0');  
  pd_stage = (typeof pd_stage === 'undefined')? '0':pd_stage.replace('','0');
  field_agent_id = (typeof field_agent_id === 'undefined')? '0':field_agent_id.replace('','0');
  body_score = (typeof body_score === 'undefined')? '0':body_score.replace('','0');
  pd_method = (typeof pd_method === 'undefined')? '0':pd_method.replace('','0');
  pd_results = (typeof pd_results === 'undefined')? '0':pd_results.replace('','0');
  service_date = (typeof service_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):service_date;  
  exam_date = (typeof exam_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):exam_date;  
  exam_time = (typeof exam_time === 'undefined')? moment(new Date()).format('HH:mm:ss'):exam_time;  
  
  const body = {
    "animal_id": animal_id,
    "service_date": service_date,
    "time_examined": exam_time,
    "pd_results" : pd_results,
    "pd_stage": pd_stage,
    "body_score": body_score,
    "cost": cost,
    "pd_method": pd_method,
    "data_collection_date": exam_date,
    "field_agent_id": field_agent_id,
    "created_by": user_id
  };
 
  const options = {
    url:`${config.url}`,
    method: config.method,
    headers: config.headers,
    data: body  
  }; 
 
 
  return new Promise((resolve, reject) => {
    axios(options)
    .then(res => {           
        resolve(res.data);
    })    
    .catch(err => reject(err));
  });       
}

// get sync events 
export const getSync =  function (config,id) {   
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


// add new sync event
export const postSync =  function (config,animal_id,values,user_id) { 

  let {animal_parity,cost,field_agent_id,hormone_source,hormone_type,other_hormone_source,other_hormone_type,sync_number,sync_date,sync_other_person,sync_person,sync_person_phone,sync_time} = values;
  
  animal_parity = (typeof animal_parity === 'undefined')? '0':animal_parity.replace('','0');  
  cost = (typeof cost === 'undefined')? '0':cost.replace('','0');
  field_agent_id = (typeof field_agent_id === 'undefined')? '0':field_agent_id.replace('','0');
  hormone_source = (typeof hormone_source === 'undefined')? '0':hormone_source.replace('','0');
  hormone_type = (typeof hormone_type === 'undefined')? '0':hormone_type.replace('','0');
  other_hormone_source = (typeof other_hormone_source === 'undefined')? '0':other_hormone_source.replace('','0');
  other_hormone_type = (typeof other_hormone_type === 'undefined')? '0':other_hormone_type.replace('','0');
  sync_number = (typeof sync_number === 'undefined')? '0':sync_number.replace('','0');
  sync_other_person = (typeof sync_other_person === 'undefined')? '0':sync_other_person.replace('','0');
  sync_person = (typeof sync_person === 'undefined')? '0':sync_person.replace('','0');
  sync_person_phone = (typeof sync_person_phone === 'undefined')? '0':sync_person_phone.replace('','0');
  sync_date = (typeof sync_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):sync_date; 
  sync_time = (typeof sync_time === 'undefined')? moment(new Date()).format('HH:mm:ss'):sync_time; 

  const body = {
      "animal_id": animal_id,
      "sync_date": sync_date,
      "sync_time": sync_time,
      "sync_number" : sync_number,
      "animal_parity": animal_parity,
      "hormone_type": hormone_type,
      "other_hormone_type": other_hormone_type,
      "hormone_source": hormone_source,
      "other_hormone_source": other_hormone_source,
      "sync_cost": cost,
      "sync_person": sync_person,
      "sync_other_person": sync_other_person,
      "sync_person_phone": sync_person_phone,
      "field_agent_id": field_agent_id,
      "created_by": user_id
  };
  
 
  const options = {
    url:`${config.url}`,
    method: config.method,
    headers: config.headers,
    data: body  
  }; 

  return new Promise((resolve, reject) => {
    axios(options)
    .then(res => {           
        resolve(res.data);
    })    
    .catch(err => reject(err));
  });       
}

// get Insemination events 
export const getInsemination =  function (config,id) {   
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




// add new insemination event
export const postInsemination =  function (config,animal_id,values,user_id) { 

  let {ai_type,body_condition_score,breed_composition,breed_of_bull,cost,cow_weight,field_agent_id,origin_country_bull,other_Semen_source,other_breed_of_bull,semen_batch,service_date,source_of_semen,straw_id,straw_semen_type} = values;
    
  ai_type = (typeof ai_type === 'undefined')? '0':ai_type.replace('','0');  
  body_condition_score = (typeof body_condition_score === 'undefined')? '0':body_condition_score.replace('','0');
  field_agent_id = (typeof field_agent_id === 'undefined')? '0':field_agent_id.replace('','0');
  straw_semen_type = (typeof straw_semen_type === 'undefined')? '0':straw_semen_type.replace('','0');
  straw_id = (typeof straw_id === 'undefined')? '':straw_id;
  source_of_semen = (typeof source_of_semen === 'undefined')? '0':source_of_semen.replace('','0');
  semen_batch = (typeof semen_batch === 'undefined')? '':semen_batch;
  other_breed_of_bull = (typeof other_breed_of_bull === 'undefined')? '0':other_breed_of_bull.replace('','0');
  other_Semen_source = (typeof other_Semen_source === 'undefined')? '0':other_Semen_source.replace('','0');
  origin_country_bull = (typeof origin_country_bull === 'undefined')? '':origin_country_bull;
  cow_weight = (typeof cow_weight === 'undefined')? '0':cow_weight.replace('','0');
  breed_composition = (typeof breed_composition === 'undefined')? '0':breed_composition.replace('','0');
  cost = (typeof cost === 'undefined')? '0':cost.replace('','0');
  breed_of_bull = (typeof breed_of_bull === 'undefined')? '0':breed_of_bull.replace('','0');
  service_date = (typeof service_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):service_date; 
  

  const body = {
      "animal_id": animal_id,
      "ai_date": service_date,
      "straw_semen_type": straw_semen_type,
      "type_of_ai" : ai_type,
      "straw_id": straw_id,
      "country_of_origin": origin_country_bull,
      "body_condition_score": body_condition_score,
      "breed_composition_bull": breed_composition,
      "ai_cost": cost,
      "cow_weight": cow_weight,
      "semen_batch": semen_batch,
      "semen_source": source_of_semen,
      "semen_source_other": other_Semen_source,
      "breed_of_bull": breed_of_bull,
      "breed_of_bull_other": other_breed_of_bull, 
      "field_agent_id": field_agent_id,
      "created_by": user_id
  };
 
  const options = {
    url:`${config.url}`,
    method: config.method,
    headers: config.headers,
    data: body  
  }; 

  return new Promise((resolve, reject) => {
    axios(options)
    .then(res => {           
        resolve(res.data);
    })    
    .catch(err => reject(err));
  });       
}

//exit & disposal event

// get Exit events 
export const getExit =  function (config,id) {   
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
















