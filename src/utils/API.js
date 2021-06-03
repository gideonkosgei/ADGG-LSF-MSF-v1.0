import moment from 'moment';
const axios = require('axios');

/* 
  GENERIC METHODS
  --------------
  Reduce Repetition -> that why we have generaric function
                    -> makes the code lean
                    -> Easy to Maintain
  General Rules 
    1) The 1st parameter is the config 
    2) The 2nd parameter is a description of the function -> for debugging
*/

/*  GENERIC 2 PARAMETERS  */
export const genericFunctionTwoParameters =  function (param1,param2) { 
  // console.log(param2);  
   const options = {
     url:`${param1.url}`,
     method: param1.method,
     headers: param1.headers  
   }   
   return new Promise((resolve, reject) => {
     axios(options)
     .then(res => {             
         resolve(res.data);
     }).catch(err => reject(err));
   });       
 }

  /*  GENERIC 3 PARAMETERS  */
export const genericFunctionThreeParameters =  function (param1,param2,param3) { 
 // console.log(param2);  
  const options = {
    url:`${param1.url}/${param3}`,
    method: param1.method,
    headers: param1.headers  
  }     
  return new Promise((resolve, reject) => {
    axios(options)
    .then(res => {             
        resolve(res.data);
    }).catch(err => reject(err));
  });       
}

 /*  GENERIC 4 PARAMETERS  */
 export const genericFunctionFourParameters =  function (param1,param2,param3,param4) {  

  const options = {
    url:`${param1.url}/${param3}/${param4}`,
    method: param1.method,
    headers: param1.headers  
  }   
  return new Promise((resolve, reject) => {
    axios(options)
    .then(res => {                    
        resolve(res.data);
    }).catch(err => reject(err));
  });       
}

/*  GENERIC 5 PARAMETERS  */
export const genericFunctionFiveParameters =  function (param1,param2,param3,param4,param5) { 
  //console.log(param2);  
  const options = {
    url:`${param1.url}/${param3}/${param4}/${param5}`,
    method: param1.method,
    headers: param1.headers  
  } 
 
  return new Promise((resolve, reject) => {
    axios(options)
    .then(res => {             
        resolve(res.data);
    }).catch(err => reject(err));
  });       
}

/*  GENERIC 7 PARAMETERS  */
export const genericFunctionSevenParameters =  function (param1,param2,param3,param4,param5,param6,param7) {   
  const options = {
    url:`${param1.url}/${param3}/${param4}/${param5}/${param6}/${param7}`,
    method: param1.method,
    headers: param1.headers  
  }   
  return new Promise((resolve, reject) => {
    axios(options)
    .then(res => {             
        resolve(res.data);
    }).catch(err => reject(err));
  });       
}




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
    axios(options)
    .then(res => {             
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
};

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

// get admin units
export const getAdminUnits =  function (config,unit,option) {   
  const options = {
    url:`${config.url}${unit}/${option}`,
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
export const getAnimalStats =  function (config,organisation_id,level,herd) {   
  const options = {
    url:`${config.url}${organisation_id}/${level}/${herd}`,
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
export const getAnimalsOrg =  function (config,organisation_id,status) {   
  const options = {
    url:`${config.url}${organisation_id}/${status}`,
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
export const getHerds =  function (config,option,id) {   
  const options = {
    url:`${config.url}/${option}/${id}`,
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

// get weight & growth Detaills
  export const getWeights =  function (config,id,option) {   
    const options = {
      url:`${config.url}${id}/${option}`,
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



// get specific weight & growth Details
export const getWeightByEventId =   function (config,id) {   
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
  body_length = (typeof body_length === 'undefined' || body_length ==='' )? null:body_length;  
  body_score = (typeof body_score === 'undefined' || body_score ==='')? null:body_score;
  field_agent_id = (typeof field_agent_id === 'undefined' || field_agent_id ==='')? null:field_agent_id;
  heart_girth = (typeof heart_girth === 'undefined' || heart_girth ==='')? null:heart_girth;
  weight = (typeof weight === 'undefined' || weight ==='')? null:weight;
  weight_date = (typeof weight_date === 'undefined' || weight_date ==='')? moment(new Date()).format('YYYY-MM-DD'):weight_date;  
  
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

// update weight event
export const updateWeight =  function (config,event_id,values,user_id) {    
  let {body_length,body_score,field_agent_id,heart_girth,weight,event_date} = values;
  body_length = (typeof body_length === 'undefined' || body_length ==='' )? null:body_length;  
  body_score = (typeof body_score === 'undefined' || body_score ==='' )? null:body_score;
  field_agent_id = (typeof field_agent_id === 'undefined' || field_agent_id ==='' )? null:field_agent_id;
  heart_girth = (typeof heart_girth === 'undefined' || heart_girth ==='' )? null:heart_girth;
  weight = (typeof weight === 'undefined' || weight ==='' )? null:weight;
  event_date = (typeof event_date === 'undefined' || event_date ==='' )? moment(new Date()).format('YYYY-MM-DD'):event_date;  
 
  const body = {    
    "body_length": body_length,
    "heart_girth": heart_girth,
    "weight" : weight,
    "body_score": body_score,
    "data_collection_date": event_date,
    "field_agent_id": field_agent_id,
    "updated_by": user_id
  };
  const options = {
    url:`${config.url}${event_id}`,
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
  export const getPD =  function (config,id,option) {   
    const options = {
      url:`${config.url}${id}/${option}`,
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
};


export const getPdByEventId =  function (config,id) {   
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

// add new pd event
export const postPd =  function (config,animal_id,values,user_id) { 

  let {cost,exam_time,service_date,pd_stage,pd_results,pd_method,body_score,field_agent_id,exam_date} = values;
  cost = (typeof cost === 'undefined' ||cost === '')? null:cost;  
  pd_stage = (typeof pd_stage === 'undefined' ||pd_stage === '')? null:pd_stage;
  field_agent_id = (typeof field_agent_id === 'undefined' ||field_agent_id === '')? null:field_agent_id;
  body_score = (typeof body_score === 'undefined' ||body_score === '')? null:body_score;
  pd_method = (typeof pd_method === 'undefined' ||pd_method === '')? null:pd_method;
  pd_results = (typeof pd_results === 'undefined' ||pd_results === '')? null:pd_results;
  service_date = (typeof service_date === 'undefined' ||service_date === '')? moment(new Date()).format('YYYY-MM-DD'):service_date;  
  exam_date = (typeof exam_date === 'undefined' ||exam_date === '')? moment(new Date()).format('YYYY-MM-DD'):exam_date;  
  exam_time = (typeof exam_time === 'undefined'||exam_time === '')? moment(new Date()).format('HH:mm:ss'):exam_time;  
  pd_stage = (parseInt(pd_results) === 2 )? null : pd_stage;   
  
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


export const updatePd =  function (config,event_id,values,user_id) { 

  let {cost,exam_time,service_date,pd_stage,pd_results,pd_method,body_score,field_agent_id,exam_date} = values;
  
  cost = (typeof cost === 'undefined' ||cost === '')? null:cost;  
  pd_stage = (typeof pd_stage === 'undefined' ||pd_stage === '')? null:pd_stage;
  field_agent_id = (typeof field_agent_id === 'undefined' ||field_agent_id === '')? null:field_agent_id;
  body_score = (typeof body_score === 'undefined' ||body_score === '')? null:body_score;
  pd_method = (typeof pd_method === 'undefined' ||pd_method === '')? null:pd_method;
  pd_results = (typeof pd_results === 'undefined' ||pd_results === '')? null:pd_results;
  service_date = (typeof service_date === 'undefined' ||service_date === '')? moment(new Date()).format('YYYY-MM-DD'):service_date;  
  exam_date = (typeof exam_date === 'undefined' ||exam_date === '')? moment(new Date()).format('YYYY-MM-DD'):exam_date;  
  exam_time = (typeof exam_time === 'undefined'||exam_time === '')? moment(new Date()).format('HH:mm:ss'):exam_time;  
  pd_stage = (parseInt(pd_results) === 2 )? null : pd_stage;   
   
  const body = {  
    "service_date": service_date,
    "time_examined": exam_time,
    "pd_results" : pd_results,
    "pd_stage": pd_stage,
    "body_score": body_score,
    "cost": cost,
    "pd_method": pd_method,
    "data_collection_date": exam_date,
    "field_agent_id": field_agent_id,
    "updated_by": user_id
  };
 
  const options = {
    url:`${config.url}${event_id}`,
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
  export const getSync =  function (config,id,option) {   
    const options = {
      url:`${config.url}${id}/${option}`,
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
  let {animal_parity,cost,field_agent_id,hormone_source,hormone_type,other_hormone_type,sync_number,sync_date,sync_other_person,sync_person,sync_person_phone,sync_time} = values;
  
  animal_parity = (typeof animal_parity === 'undefined' || animal_parity === '') ? null: isNaN(parseInt(animal_parity))?null:parseInt(animal_parity);  
  cost = (typeof cost === 'undefined' || cost === '')? null:cost;
  field_agent_id = (typeof field_agent_id === 'undefined' || field_agent_id === '')? null:field_agent_id;
  hormone_source = (typeof hormone_source === 'undefined' || hormone_source === '')? null:hormone_source;
  hormone_type = (typeof hormone_type === 'undefined' || hormone_type === '')? null:hormone_type;  
  other_hormone_type = (typeof other_hormone_type === 'undefined' || other_hormone_type === '')? null:other_hormone_type;
  sync_number = (typeof sync_number === 'undefined' || sync_number === '')? null:sync_number;
  sync_other_person = (typeof sync_other_person === 'undefined' || sync_other_person === '')? null:sync_other_person;
  sync_person = (typeof sync_person === 'undefined' || sync_person === '')? null:parseInt(sync_person);
  sync_person_phone = (typeof sync_person_phone === 'undefined' || sync_person_phone === '')? null:sync_person_phone;
  sync_date = (typeof sync_date === 'undefined' || sync_date === '')? moment(new Date()).format('YYYY-MM-DD'):sync_date; 
  sync_time = (typeof sync_time === 'undefined' || sync_time === '')? moment(new Date()).format('HH:mm:ss'):sync_time;
  
  //hormone_type = (parseInt(hormone_type) ===3)? null : hormone_type;
  other_hormone_type = (parseInt(hormone_type) === 1 || parseInt(hormone_type) === 2)? null : other_hormone_type;
  
  if(isNaN(sync_person)){
    sync_person = null;
    sync_other_person = null;
    field_agent_id = null;
  }

  field_agent_id = (sync_person === 1 )? user_id : null;
  sync_other_person = (sync_person === 1)? null : sync_other_person; 

  const body = {
      "animal_id": animal_id,
      "sync_date": sync_date,
      "sync_time": sync_time,
      "sync_number" : sync_number,
      "animal_parity": animal_parity,
      "hormone_type": hormone_type,
      "other_hormone_type": other_hormone_type,
      "hormone_source": hormone_source,
      "other_hormone_source": null,
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
};


// update sync event record
export const updateSync =  function (config,event_id,values,user_id) { 

  let {animal_parity,cost,field_agent_id,hormone_source,hormone_type,other_hormone_source,other_hormone_type,sync_number,sync_date,sync_other_person,sync_person,sync_person_phone,sync_time} = values;
  
  animal_parity = (typeof animal_parity === 'undefined' || animal_parity === '') ? null: isNaN(parseInt(animal_parity))?null:parseInt(animal_parity);  
  cost = (typeof cost === 'undefined' || cost === '')? null:cost;
  field_agent_id = (typeof field_agent_id === 'undefined' || field_agent_id === '')? null:field_agent_id;
  hormone_source = (typeof hormone_source === 'undefined' || hormone_source === '')? null:hormone_source;
  hormone_type = (typeof hormone_type === 'undefined' || hormone_type === '')? null:hormone_type;  
  other_hormone_source = (typeof other_hormone_source === 'undefined' || other_hormone_source === '')? null:other_hormone_source;
  other_hormone_type = (typeof other_hormone_type === 'undefined' || other_hormone_type === '')? null:other_hormone_type;
  sync_number = (typeof sync_number === 'undefined' || sync_number === '')? null:sync_number;
  sync_other_person = (typeof sync_other_person === 'undefined' || sync_other_person === '')? null:sync_other_person;
  sync_person = (typeof sync_person === 'undefined' || sync_person === '')? null:parseInt(sync_person);
  sync_person_phone = (typeof sync_person_phone === 'undefined' || sync_person_phone === '')? null:sync_person_phone;
  sync_date = (typeof sync_date === 'undefined' || sync_date === '')? moment(new Date()).format('YYYY-MM-DD'):sync_date; 
  sync_time = (typeof sync_time === 'undefined' || sync_time === '')? moment(new Date()).format('HH:mm:ss'):sync_time;
  
  other_hormone_type = (parseInt(hormone_type) === 1 || parseInt(hormone_type) === 2)? null : other_hormone_type;
  
  if(isNaN(sync_person)){
    sync_person = null;
    sync_other_person = null;
    field_agent_id = null;
  }

  field_agent_id = (sync_person === 1 )? user_id : null;
  sync_other_person = (sync_person === 1)? null : sync_other_person;

  const body = {      
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
      "updated_by": user_id
  };
  
 
  const options = {
    url:`${config.url}${event_id}`,
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
};


 // Get Specific Sync Event Record
 export const getSyncByEventId =   function (config,id) {   
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

// get Insemination events 
export const getInsemination =  function (config,id,option) {   
  const options = {
    url:`${config.url}${id}/${option}`,
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


// get Insemination events 
export const getInseminationEventById =  function (config,id) {   
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




// add new insemination event
export const postInsemination =  function (config,animal_id,values,user_id) { 
  let {ai_type,body_condition_score,cost,field_agent_id,service_date,straw_id} = values;
    
  ai_type = (typeof ai_type === 'undefined' || ai_type === '')? null:ai_type;  
  body_condition_score = (typeof body_condition_score === 'undefined' || body_condition_score === '')? null:body_condition_score;
  field_agent_id = (typeof field_agent_id === 'undefined' || field_agent_id === '')? null:field_agent_id;  
  straw_id = (typeof straw_id === 'undefined' || straw_id === '')? null:straw_id;   
  cost = (typeof cost === 'undefined' || cost === '')? null:cost;
  service_date = (typeof service_date === 'undefined' || service_date === '')? moment(new Date()).format('YYYY-MM-DD'):service_date; 
  

  const body = {
      "animal_id": animal_id,
      "ai_date": service_date,      
      "type_of_ai" : ai_type,
      "straw_id": straw_id,    
      "body_condition_score": body_condition_score,      
      "ai_cost": cost,      
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
};


//update insemination event record
export const updateInsemination =  function (config,event_id,values,user_id) { 

  let {ai_type,body_condition_score,cost,field_agent_id,service_date,straw_record_id} = values;   
  
  ai_type = (typeof ai_type === 'undefined' || ai_type === '')? null:ai_type;  
  body_condition_score = (typeof body_condition_score === 'undefined' || body_condition_score === '')? null:body_condition_score;
  field_agent_id = (typeof field_agent_id === 'undefined' || field_agent_id === '')? null:field_agent_id;  
  straw_record_id = (typeof straw_record_id === 'undefined' || straw_record_id === '')? null:straw_record_id; 
  cost = (typeof cost === 'undefined' || cost === '')? null:cost;
  service_date = (typeof service_date === 'undefined' || service_date === '')? moment(new Date()).format('YYYY-MM-DD'):service_date; 
  
  const body = {    
    "ai_date": service_date,      
    "type_of_ai" : ai_type,
    "straw_id": straw_record_id,    
    "body_condition_score": body_condition_score,      
    "ai_cost": cost,      
    "field_agent_id": field_agent_id,
    "updated_by": user_id
};

 
  const options = {
    url:`${config.url}${event_id}`,
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
};

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


// get Exit events 
  export const getExitList =  function (config,id) {   
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
};

//partners
export const getServiceProviders =  function (config,id,option) {   
  const options = {
    url:`${config.url}${id}/${option}`,
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

//get ai straws
export const getStraws =  function (config,id,option,is_active) {   
  const options = {
    url:`${config.url}${id}/${option}/${is_active}`,
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


//get ai straws
export const getStrawsAll =  function (config,id,option,is_active) {   
  const options = {
    url:`${config.url}${id}/${option}/${is_active}`,
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

//post ai straw
export const postStraw =  function (config,values,user_id,org_id) { 
  let {
        straw_id, 
        barcode, 
        bull_tag_id, 
        bull_name ,
        breed, 
        breed_composition, 
        semen_source,
        origin_country, 
        farm_name,batch_number ,
        ejaculation_number ,
        production_date, 
        specification ,
        additional_info  
      } = values;
 
 

  straw_id = (typeof straw_id === 'undefined' || straw_id === '')? null:straw_id
  barcode = (typeof barcode === 'undefined' || barcode === '')? null:barcode;
  bull_tag_id = (typeof bull_tag_id === 'undefined' || bull_tag_id === '')? null:bull_tag_id;
  bull_name = (typeof bull_name === 'undefined' || bull_name === '')? null:bull_name;
  breed = (typeof breed === 'undefined' || breed === '')? null:breed;
  breed_composition = (typeof breed_composition === 'undefined' || breed_composition === '')? null:isNaN(parseInt(breed_composition))?null:parseInt(breed_composition) ;
  semen_source = (typeof semen_source === 'undefined' || semen_source === '')? null:isNaN(parseInt(semen_source))?null:parseInt(semen_source);
  origin_country = (typeof origin_country === 'undefined' || origin_country === '')? null:isNaN(parseInt(origin_country))?null:parseInt(origin_country);   
  farm_name = (typeof farm_name === 'undefined' || farm_name === '')? null:farm_name;
  batch_number = (typeof batch_number === 'undefined' || batch_number === '')? null:batch_number;
  ejaculation_number = (typeof ejaculation_number === 'undefined' || ejaculation_number === '')? null:ejaculation_number;
  production_date = (typeof production_date === 'undefined' || production_date === '')? null:production_date;
  specification  = (typeof specification === 'undefined' || specification === '')? null:specification;
  additional_info = (typeof additional_info === 'undefined' || additional_info === '')? null:additional_info;
  
  const body = {
    "straw_id": straw_id,
    "barcode": barcode,
    "bull_tag_id": bull_tag_id,
    "bull_name": bull_name,           
    "breed": breed,            
    "breed_composition": breed_composition,
    "semen_source": semen_source,
    "origin_country": origin_country,
    "farm_name": farm_name,
    "batch_number": batch_number,
    "ejaculation_number": ejaculation_number,
    "production_date": production_date,          
    "specification": specification,           
    "additional_info": additional_info,
    "created_by": user_id,
    "org_id":org_id
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

//update AI Straw
export const putStraw =  function (config,values,user_id,id) { 
  let { 
      straw_id, 
      barcode, 
      bull_tag_id, 
      bull_name ,
      breed_id, 
      breed_composition_id,
      semen_source,
      origin_country, 
      farm_name,batch_number ,
      ejaculation_number ,
      production_date, 
      specification_id ,
      additional_info,
      is_active  
    } = values;
  
  breed_composition_id = (typeof breed_composition_id === 'undefined' || breed_composition_id === '')? null:isNaN(parseInt(breed_composition_id))?null:parseInt(breed_composition_id) ;
  semen_source = (typeof semen_source === 'undefined' || semen_source === '')? null:isNaN(parseInt(semen_source))?null:parseInt(semen_source);
  origin_country = (typeof origin_country === 'undefined' || origin_country === '')? null:isNaN(parseInt(origin_country))?null:parseInt(origin_country);   
  

  const body = {
    "straw_id": straw_id,
    "barcode": barcode,
    "bull_tag_id": bull_tag_id,
    "bull_name": bull_name,           
    "breed": breed_id,            
    "breed_composition": breed_composition_id,
    "semen_source": semen_source,
    "origin_country": origin_country,
    "farm_name": farm_name,
    "batch_number": batch_number,
    "ejaculation_number": ejaculation_number,
    "production_date": production_date,          
    "specification": specification_id,           
    "additional_info": additional_info,
    "updated_by": user_id,
    "is_active": is_active    
  };

  const options = {
    url:`${config.url}${id}`,
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


export const getAgents =  function (config,id,option) {   
  const options = {
    url:`${config.url}${id}/${option}`,
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


export const postServiceProvider =  function (config,values,user_id,org_id) { 
  let {
      phone_number,
      acronym,
      city,
      contact_person,
      contact_person_mobile_number,
      country,
      description,
      email,
      name,
      postal_address,
      postal_code,
      service_provider_type,
      services_offered
    } = values;

    phone_number = (typeof phone_number === 'undefined' || phone_number === '')? null: phone_number;
    acronym = (typeof acronym === 'undefined' || acronym === '')? null: acronym;
    city = (typeof city === 'undefined' || city === '')? null: city;
    contact_person = (typeof contact_person === 'undefined' || contact_person === '')? null: contact_person;
    contact_person_mobile_number = (typeof contact_person_mobile_number === 'undefined' || contact_person_mobile_number === '')? null: contact_person_mobile_number;
    country = (typeof country === 'undefined' || country === '')? null: country;
    description = (typeof description === 'undefined' || description === '')? null: description;
    email = (typeof email === 'undefined' || email === '')? null: email;
    name = (typeof name === 'undefined' || name === '')? null: name;
    postal_address = (typeof postal_address === 'undefined' || postal_address === '')? null: postal_address;
    postal_code = (typeof postal_code === 'undefined' || postal_code === '')? null: postal_code;
    service_provider_type = (typeof service_provider_type === 'undefined' || service_provider_type === '')? null: service_provider_type;
    services_offered = (typeof services_offered === 'undefined' || services_offered === '')? null: services_offered;

 
  const body = {
    "name": name,
    "acronym": acronym,
    "postal_address": postal_address ,
    "postal_code": postal_code,
    "city": city,
    "phone": phone_number,
    "email": email,
    "description": description,
    "services_offered": services_offered,
    "contact_person": contact_person,
    "contact_person_mobile_number": contact_person_mobile_number,
    "service_provider_type": service_provider_type,
    "country": country,
    "org_id": org_id,
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

export const postAgent =  function (config,values,user_id,org_id) { 
  let { 
      phone_number,
      occupation,
      city,
      physical_address,
      affiliation,
      country,
      speciality,
      email,
      name,
      postal_address,
      postal_code
    } = values;


    phone_number = (typeof phone_number === 'undefined' || phone_number === '')? null:phone_number;  
    occupation = (typeof occupation === 'undefined' || occupation === '')? null:occupation;  
    city = (typeof city === 'undefined' || city === '')? null:city;  
    physical_address = (typeof physical_address === 'undefined' || physical_address === '')? null:physical_address;  
    affiliation = (typeof affiliation === 'undefined' || affiliation === '')? null:affiliation;  
    country = (typeof country === 'undefined' || country === '')? null:country;  
    speciality = (typeof speciality === 'undefined' || speciality === '')? null:speciality;  
    email = (typeof email === 'undefined' || email === '')? null:email;  
    name = (typeof name === 'undefined' || name === '')? null:name;  
    postal_address = (typeof postal_address === 'undefined' || postal_address === '')? null:postal_address;  
    postal_code = (typeof postal_code === 'undefined' || postal_code === '')? null:postal_code;  
  
  const body = {
    "name": name,
    "occupation": occupation,    
    "physical_address": physical_address ,
    "postal_address": postal_address ,
    "postal_code": postal_code,
    "city": city,
    "phone": phone_number,
    "email": email,   
    "speciality": speciality,    
    "affiliation": affiliation,
    "country": country,
    "org_id": org_id,
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

export const putServiceProvider =  function (config,values,user_id,org_id,record_id) { 
  let { 
      phone,
      acronym,
      city,
      contact_person,
      contact_person_mobile_number,
      country_id,
      description,
      email,
      name,
      postal_address,
      postal_code,
      service_provider_type_id,
      services_offered
    } = values;
 


    phone = (typeof phone === 'undefined' || phone === '')? null: phone;
    acronym = (typeof acronym === 'undefined' || acronym === '')? null: acronym;
    city = (typeof city === 'undefined' || city === '')? null: city;
    contact_person = (typeof contact_person === 'undefined' || contact_person === '')? null: contact_person;
    contact_person_mobile_number = (typeof contact_person_mobile_number === 'undefined' || contact_person_mobile_number === '')? null: contact_person_mobile_number;
    country_id = (typeof country_id === 'undefined' || country_id === '')? null: country_id;
    description = (typeof description === 'undefined' || description === '')? null: description;
    email = (typeof email === 'undefined' || email === '')? null: email;
    name = (typeof name === 'undefined' || name === '')? null: name;
    postal_address = (typeof postal_address === 'undefined' || postal_address === '')? null: postal_address;
    postal_code = (typeof postal_code === 'undefined' || postal_code === '')? null: postal_code;
    service_provider_type_id = (typeof service_provider_type_id === 'undefined' || service_provider_type_id === '')? null: service_provider_type_id;
    services_offered = (typeof services_offered === 'undefined' || services_offered === '')? null: services_offered;

  const body = {
    "name": name,
    "acronym": acronym,
    "postal_address": postal_address ,
    "postal_code": postal_code,
    "city": city,
    "phone": phone,
    "email": email,
    "description": description,
    "services_offered": services_offered,
    "contact_person": contact_person,
    "contact_person_mobile_number": contact_person_mobile_number,
    "service_provider_type": service_provider_type_id,
    "country": country_id,
    "org_id": org_id,
    "updated_by": user_id
  };

  const options = {
    url:`${config.url}${record_id}`,
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

export const putAgents =  function (config,values,user_id,record_id) { 
  let {
      phone,
      occupation,
      city,
      physical_address,
      affiliation_id,
      country_id,
      speciality,
      email,
      name,
      postal_address,
      postal_code
    } = values;

    phone  = (typeof phone === 'undefined' || phone === '')? null:phone;
    occupation  = (typeof occupation === 'undefined' || occupation === '')? null:occupation;
    city  = (typeof city === 'undefined' || city === '')? null:city;
    physical_address  = (typeof physical_address === 'undefined' || physical_address === '')? null:physical_address;
    affiliation_id = (typeof affiliation_id === 'undefined' || affiliation_id === '')? null:affiliation_id;
    country_id  = (typeof country_id === 'undefined' || country_id === '')? null:country_id;
    speciality  = (typeof speciality === 'undefined' || speciality === '')? null:speciality;
    email  = (typeof email === 'undefined' || email === '')? null:email;
    name  = (typeof name === 'undefined' || name === '')? null:name;
    postal_address  = (typeof postal_address === 'undefined' || postal_address === '')? null:postal_address;
    postal_code  = (typeof postal_code === 'undefined' || postal_code === '')? null:postal_code;
  

  const body = {
    "name": name,
    "occupation": occupation,    
    "physical_address": physical_address ,
    "postal_address": postal_address ,
    "postal_code": postal_code,
    "city": city,
    "phone": phone,
    "email": email,   
    "speciality": speciality,    
    "affiliation": affiliation_id,
    "country": country_id,    
    "updated_by": user_id
  };
    const options = {
    url:`${config.url}${record_id}`,
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



// add new exit event
export const postExit =  function (config,animal_id,values,user_id) {  

  let {disposal_amount,disposal_reason,disposal_reason_other,exit_date,new_breeder_name,new_breeder_phone_no,new_country,new_district,new_farmer_name,new_farmer_phone_no,new_region,new_ward,new_village} = values;
    
    disposal_amount = (typeof disposal_amount === 'undefined' || disposal_amount === '')? null:disposal_amount;  
    disposal_reason = (typeof disposal_reason === 'undefined' || disposal_reason === '')? null:disposal_reason; 
    disposal_reason_other = (typeof disposal_reason_other === 'undefined' || disposal_reason_other === '')? null:disposal_reason_other;
    new_breeder_name = (typeof new_breeder_name === 'undefined' || new_breeder_name === '')? null:new_breeder_name;
    new_breeder_phone_no = (typeof new_breeder_phone_no === 'undefined' || new_breeder_phone_no === '')? null:new_breeder_phone_no;
    new_farmer_name = (typeof new_farmer_name === 'undefined' || new_farmer_name === '')? null:new_farmer_name;
    new_farmer_phone_no = (typeof new_farmer_phone_no === 'undefined' || new_farmer_phone_no === '')? null:new_farmer_phone_no;
    new_country = (typeof new_country === 'undefined' || new_country === '')? null:new_country;
    new_district = (typeof new_district === 'undefined' || new_district === '')? null:new_district;
    new_region = (typeof new_region === 'undefined' || new_region === '')? null:new_region;
    new_ward = (typeof new_ward === 'undefined' || new_ward === '')? null:new_ward;
    new_village = (typeof new_village === 'undefined' || new_village === '')? null:new_village;
    exit_date = (typeof exit_date === 'undefined' || exit_date === '')? moment(new Date()).format('YYYY-MM-DD'):exit_date; 
  
    const body = {
        "animal_id": animal_id,
        "exit_date": exit_date,
        "disposal_amount": disposal_amount,
        "disposal_reason" : disposal_reason,
        "disposal_reason_other": disposal_reason_other,
        "new_breeder_name": new_breeder_name,
        "new_breeder_phone_number": new_breeder_phone_no,
        "new_country": new_country,
        "new_district": new_district,
        "new_farmer_name":new_farmer_name,
        "new_farmer_phone_number": new_farmer_phone_no,
        "new_region": new_region,
        "new_ward": new_ward,
        "new_village": new_village,
        "field_agent_id": null,
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


// Updayte exit event Record
export const updateExit =  function (config,event_id,values,user_id) {  
  let {disposal_amount,disposal_reason,disposal_reason_other,exit_date,field_agent_id,new_breeder_name,new_breeder_phone_no,new_country,new_district,new_farmer_name,new_farmer_phone_no,new_region,new_village} = values;
  
  disposal_amount = (typeof disposal_amount === 'undefined' || disposal_amount === '')? null:disposal_amount;  
  disposal_reason = (typeof disposal_reason === 'undefined' || disposal_reason === '')? null:disposal_reason; 
  disposal_reason_other = (typeof disposal_reason_other === 'undefined' || disposal_reason_other === '')? null:disposal_reason_other;
  new_breeder_name = (typeof new_breeder_name === 'undefined' || new_breeder_name === '')? null:new_breeder_name;
  new_breeder_phone_no = (typeof new_breeder_phone_no === 'undefined' || new_breeder_phone_no === '')? null:new_breeder_phone_no;
  new_farmer_name = (typeof new_farmer_name === 'undefined' || new_farmer_name === '')? null:new_farmer_name;
  new_farmer_phone_no = (typeof new_farmer_phone_no === 'undefined' || new_farmer_phone_no === '')? null:new_farmer_phone_no;
  new_country = (typeof new_country === 'undefined' || new_country === '')? null:new_country;
  new_district = (typeof new_district === 'undefined' || new_district === '')? null:new_district;
  new_region = (typeof new_region === 'undefined' || new_region === '')? null:new_region;
  //new_ward = (typeof new_ward === 'undefined' || new_ward === '')? null:new_ward;
  new_village = (typeof new_village === 'undefined' || new_village === '')? null:new_village;
  exit_date = (typeof exit_date === 'undefined' || exit_date === '')? moment(new Date()).format('YYYY-MM-DD'):exit_date; 

  const body = {      
        "exit_date": exit_date,
        "disposal_amount": disposal_amount,
        "disposal_reason" : disposal_reason,
        "disposal_reason_other": disposal_reason_other,
        "new_breeder_name": new_breeder_name,
        "new_breeder_phone_number": new_breeder_phone_no,
        "new_country": new_country,
        "new_district": new_district,
        "new_farmer_name":new_farmer_name,
        "new_farmer_phone_number": new_farmer_phone_no,
        "new_region": new_region,
        "new_village": new_village,
        "field_agent_id": field_agent_id,
        "updated_by": user_id
  };
 
  const options = {
    url:`${config.url}${event_id}`,
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



  // get specific Exit & Diposal Details
  export const getExitByEventId =   function (config,id) {   
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


// get calving events 
export const getCalving =  function (config,id,option) {   
  const options = {
    url:`${config.url}${id}/${option}`,
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


export const getCalvingByEventId =  function (config,id) {   
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

// add new Calving event
export const postCalving =  function (config,animal_id,values,user_id,lactation_number) {    
  let {
      // calf 1
      calving_status,
      calving_type_other,
      types_calving, 
      Calf_weight,
      calf_body_condition_score,      
      calf_color,
      calf_deformities,
      calf_heart_girth,
      calf_name,
      calf_tag_id,
      ease_of_calving,
      ease_of_calving_other,
      other_calf_deformities,
      use_of_calf,
      use_of_calf_other,
      calf_gender,

      //calf 2
      calving_status2,
      calving_type_other2,
      types_calving2, 
      Calf_weight2,
      calf_body_condition_score2,      
      calf_color2,
      calf_deformities2,
      calf_heart_girth2,
      calf_name2,
      calf_tag_id2,
      ease_of_calving2,
      ease_of_calving_other2,
      other_calf_deformities2,
      use_of_calf2,
      use_of_calf_other2,
      calf_gender2,
       
      //global
      calving_birth_type,
      calving_method, 
      field_agent_id,
      calving_date
    } = values;
    

    calving_status = (typeof calving_status === 'undefined' || calving_status === '')? null:calving_status;  
    calving_type_other = (typeof calving_type_other === 'undefined' || calving_type_other === '')? null:calving_type_other;  
    types_calving = (typeof types_calving === 'undefined' || types_calving === '')? null:types_calving;  
    Calf_weight = (typeof Calf_weight === 'undefined' || Calf_weight === '')? null:Calf_weight;  
    calf_body_condition_score = (typeof calf_body_condition_score === 'undefined' || calf_body_condition_score === '')? null:calf_body_condition_score;       
    calf_color = (typeof calf_color === 'undefined' || calf_color === '')? null:calf_color;  
    calf_deformities = (typeof calf_deformities === 'undefined' || calf_deformities === '')? null:calf_deformities;  
    calf_heart_girth = (typeof calf_heart_girth === 'undefined' || calf_heart_girth === '')? null:calf_heart_girth;  
    calf_name = (typeof calf_name === 'undefined' || calf_name === '')? null:calf_name;  
    calf_tag_id = (typeof calf_tag_id === 'undefined' || calf_tag_id === '')? null:calf_tag_id;  
    ease_of_calving = (typeof ease_of_calving === 'undefined' || ease_of_calving === '')? null:ease_of_calving;  
    ease_of_calving_other = (typeof ease_of_calving_other === 'undefined' || ease_of_calving_other === '')? null:ease_of_calving_other;  
    other_calf_deformities = (typeof other_calf_deformities === 'undefined' || other_calf_deformities === '')? null:other_calf_deformities;  
    use_of_calf = (typeof use_of_calf === 'undefined' || use_of_calf === '')? null:use_of_calf;  
    use_of_calf_other = (typeof use_of_calf_other === 'undefined' || use_of_calf_other === '')? null:use_of_calf_other;  
    calf_gender = (typeof calf_gender === 'undefined' || calf_gender === '')? null:calf_gender;  

    //calf 2
    calving_status2 = (typeof calving_status2 === 'undefined' || calving_status2 === '')? null:calving_status2;  
    calving_type_other2 = (typeof calving_type_other2 === 'undefined' || calving_type_other2 === '')? null:calving_type_other2;  
    types_calving2 = (typeof types_calving2 === 'undefined' || types_calving2 === '')? null:types_calving2;  
    Calf_weight2 = (typeof Calf_weight2 === 'undefined' || Calf_weight2 === '')? null:Calf_weight2;  
    calf_body_condition_score2 = (typeof calf_body_condition_score2 === 'undefined' || calf_body_condition_score2 === '')? null:calf_body_condition_score2;       
    calf_color2 = (typeof calf_color2 === 'undefined' || calf_color2 === '')? null:calf_color2;  
    calf_deformities2 = (typeof calf_deformities2 === 'undefined' || calf_deformities2 === '')? null:calf_deformities2;  
    calf_heart_girth2 = (typeof calf_heart_girth2 === 'undefined' || calf_heart_girth2 === '')? null:calf_heart_girth2;  
    calf_name2 = (typeof calf_name2 === 'undefined' || calf_name2 === '')? null:calf_name2;  
    calf_tag_id2 = (typeof calf_tag_id2 === 'undefined' || calf_tag_id2 === '')? null:calf_tag_id2;  
    ease_of_calving2 = (typeof ease_of_calving2 === 'undefined' || ease_of_calving2 === '')? null:ease_of_calving2;  
    ease_of_calving_other2 = (typeof ease_of_calving_other2 === 'undefined' || ease_of_calving_other2 === '')? null:ease_of_calving_other2;  
    other_calf_deformities2 = (typeof other_calf_deformities2 === 'undefined' || other_calf_deformities2 === '')? null:other_calf_deformities2;  
    use_of_calf2 = (typeof use_of_calf2 === 'undefined' || use_of_calf2 === '')? null:use_of_calf2;  
    use_of_calf_other2 = (typeof use_of_calf_other2 === 'undefined' || use_of_calf_other2 === '')? null:use_of_calf_other2;  
    calf_gender2 = (typeof calf_gender2 === 'undefined' || calf_gender2 === '')? null:calf_gender2;  
      
    //global
    calving_birth_type = (typeof calving_birth_type === 'undefined' || calving_birth_type === '')? null:calving_birth_type;  
    calving_method = (typeof calving_method === 'undefined' || calving_method === '')? null:calving_method;   
    field_agent_id = (typeof field_agent_id === 'undefined' || field_agent_id === '')? null:field_agent_id;  
    calving_date = (typeof calving_date === 'undefined' || calving_date === '')? moment(new Date()).format('YYYY-MM-DD'):calving_date;  

    
    const body = {
      //global
      "animal_id": animal_id,
      "calving_date": calving_date,
      "birth_type": calving_birth_type,
      "calving_method": calving_method,
      "lactation_number":lactation_number,
      "field_agent_id": field_agent_id,
      "created_by": user_id,

      //calf 1
      "body_condition_score" : calf_body_condition_score,
      "calf_color": calf_color,
      "calf_deformities": calf_deformities,
      "other_calf_deformities": other_calf_deformities,
      "heart_girth": calf_heart_girth,
      "calf_name": calf_name,
      "calf_sex":calf_gender,
      "calf_weight": Calf_weight,
      "ease_of_calving_other": ease_of_calving_other,      
      "calving_type_other":calving_type_other,
      "calving_type":types_calving,
      "ease_of_calving":ease_of_calving,
      "calving_status":calving_status,
      "use_of_calf":use_of_calf,
      "use_of_calf_other":use_of_calf_other,
      "calf_tag_id":calf_tag_id,

      //calf 2
      "body_condition_score2" : calf_body_condition_score2,
      "calf_color2": calf_color2,
      "calf_deformities2": calf_deformities2,
      "other_calf_deformities2": other_calf_deformities2,
      "heart_girth2": calf_heart_girth2,
      "calf_name2": calf_name2,
      "calf_sex2":calf_gender2,
      "calf_weight2": Calf_weight2,
      "ease_of_calving_other2": ease_of_calving_other2,      
      "calving_type_other2":calving_type_other2,
      "calving_type2":types_calving2,
      "ease_of_calving2":ease_of_calving2,
      "calving_status2":calving_status2,
      "use_of_calf2":use_of_calf2,
      "use_of_calf_other2":use_of_calf_other2,
      "calf_tag_id2":calf_tag_id2,      
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
};


export const updateCalving =  function (config,record_id,values,user_id) {    
  let { 
     // calf 1
     calving_status,
     calving_type_other,
     types_calving, 
     Calf_weight,
     calf_body_condition_score,      
     calf_color,
     calf_deformities,
     calf_heart_girth,
     calf_name,
     calf_tag_id,
     ease_of_calving,
     ease_of_calving_other,
     other_calf_deformities,
     use_of_calf,
     use_of_calf_other,
     calf_gender,

     //calf 2
     calving_status2,
     calving_type_other2,
     types_calving2, 
     Calf_weight2,
     calf_body_condition_score2,      
     calf_color2,
     calf_deformities2,
     calf_heart_girth2,
     calf_name2,
     calf_tag_id2,
     ease_of_calving2,
     ease_of_calving_other2,
     other_calf_deformities2,
     use_of_calf2,
     use_of_calf_other2,
     calf_gender2,
      
     //global
     calving_birth_type,
     calving_method, 
     field_agent_id,
     calving_date,
     lactation_number
    
    } = values;

    
    calving_status = (typeof calving_status === 'undefined' || calving_status === '')? null:calving_status;  
    calving_type_other = (typeof calving_type_other === 'undefined' || calving_type_other === '')? null:calving_type_other;  
    types_calving = (typeof types_calving === 'undefined' || types_calving === '')? null:types_calving;  
    Calf_weight = (typeof Calf_weight === 'undefined' || Calf_weight === '')? null:Calf_weight;  
    calf_body_condition_score = (typeof calf_body_condition_score === 'undefined' || calf_body_condition_score === '')? null:calf_body_condition_score;       
    calf_color = (typeof calf_color === 'undefined' || calf_color === '')? null:calf_color;  
    calf_deformities = (typeof calf_deformities === 'undefined' || calf_deformities === '')? null:calf_deformities;  
    calf_heart_girth = (typeof calf_heart_girth === 'undefined' || calf_heart_girth === '')? null:calf_heart_girth;  
    calf_name = (typeof calf_name === 'undefined' || calf_name === '')? null:calf_name;  
    calf_tag_id = (typeof calf_tag_id === 'undefined' || calf_tag_id === '')? null:calf_tag_id;  
    ease_of_calving = (typeof ease_of_calving === 'undefined' || ease_of_calving === '')? null:ease_of_calving;  
    ease_of_calving_other = (typeof ease_of_calving_other === 'undefined' || ease_of_calving_other === '')? null:ease_of_calving_other;  
    other_calf_deformities = (typeof other_calf_deformities === 'undefined' || other_calf_deformities === '')? null:other_calf_deformities;  
    use_of_calf = (typeof use_of_calf === 'undefined' || use_of_calf === '')? null:use_of_calf;  
    use_of_calf_other = (typeof use_of_calf_other === 'undefined' || use_of_calf_other === '')? null:use_of_calf_other;  
    calf_gender = (typeof calf_gender === 'undefined' || calf_gender === '')? null:calf_gender;  

    //calf 2
    calving_status2 = (typeof calving_status2 === 'undefined' || calving_status2 === '')? null:calving_status2;  
    calving_type_other2 = (typeof calving_type_other2 === 'undefined' || calving_type_other2 === '')? null:calving_type_other2;  
    types_calving2 = (typeof types_calving2 === 'undefined' || types_calving2 === '')? null:types_calving2;  
    Calf_weight2 = (typeof Calf_weight2 === 'undefined' || Calf_weight2 === '')? null:Calf_weight2;  
    calf_body_condition_score2 = (typeof calf_body_condition_score2 === 'undefined' || calf_body_condition_score2 === '')? null:calf_body_condition_score2;       
    calf_color2 = (typeof calf_color2 === 'undefined' || calf_color2 === '')? null:calf_color2;  
    calf_deformities2 = (typeof calf_deformities2 === 'undefined' || calf_deformities2 === '')? null:calf_deformities2;  
    calf_heart_girth2 = (typeof calf_heart_girth2 === 'undefined' || calf_heart_girth2 === '')? null:calf_heart_girth2;  
    calf_name2 = (typeof calf_name2 === 'undefined' || calf_name2 === '')? null:calf_name2;  
    calf_tag_id2 = (typeof calf_tag_id2 === 'undefined' || calf_tag_id2 === '')? null:calf_tag_id2;  
    ease_of_calving2 = (typeof ease_of_calving2 === 'undefined' || ease_of_calving2 === '')? null:ease_of_calving2;  
    ease_of_calving_other2 = (typeof ease_of_calving_other2 === 'undefined' || ease_of_calving_other2 === '')? null:ease_of_calving_other2;  
    other_calf_deformities2 = (typeof other_calf_deformities2 === 'undefined' || other_calf_deformities2 === '')? null:other_calf_deformities2;  
    use_of_calf2 = (typeof use_of_calf2 === 'undefined' || use_of_calf2 === '')? null:use_of_calf2;  
    use_of_calf_other2 = (typeof use_of_calf_other2 === 'undefined' || use_of_calf_other2 === '')? null:use_of_calf_other2;  
    calf_gender2 = (typeof calf_gender2 === 'undefined' || calf_gender2 === '')? null:calf_gender2;  
      
    //global
    calving_birth_type = (typeof calving_birth_type === 'undefined' || calving_birth_type === '')? null:calving_birth_type;  
    calving_method = (typeof calving_method === 'undefined' || calving_method === '')? null:calving_method;   
    field_agent_id = (typeof field_agent_id === 'undefined' || field_agent_id === '')? null:field_agent_id;  
    calving_date = (typeof calving_date === 'undefined' || calving_date === '')? moment(new Date()).format('YYYY-MM-DD'):calving_date;  
    lactation_number = (typeof lactation_number === 'undefined' || lactation_number === '')? null:lactation_number;
    
    const body = {
      //global     
      "calving_date": calving_date,
      "birth_type": calving_birth_type,
      "calving_method": calving_method,
      "lactation_number":lactation_number,
      "field_agent_id": field_agent_id,
      "updated_by": user_id,

      //calf 1
      "body_condition_score" : calf_body_condition_score,
      "calf_color": calf_color,
      "calf_deformities": calf_deformities,
      "other_calf_deformities": other_calf_deformities,
      "heart_girth": calf_heart_girth,
      "calf_name": calf_name,
      "calf_sex":calf_gender,
      "calf_weight": Calf_weight,
      "ease_of_calving_other": ease_of_calving_other,      
      "calving_type_other":calving_type_other,
      "calving_type":types_calving,
      "ease_of_calving":ease_of_calving,
      "calving_status":calving_status,
      "use_of_calf":use_of_calf,
      "use_of_calf_other":use_of_calf_other,
      "calf_tag_id":calf_tag_id,

      //calf 2
      "body_condition_score2" : calf_body_condition_score2,
      "calf_color2": calf_color2,
      "calf_deformities2": calf_deformities2,
      "other_calf_deformities2": other_calf_deformities2,
      "heart_girth2": calf_heart_girth2,
      "calf_name2": calf_name2,
      "calf_sex2":calf_gender2,
      "calf_weight2": Calf_weight2,
      "ease_of_calving_other2": ease_of_calving_other2,      
      "calving_type_other2":calving_type_other2,
      "calving_type2":types_calving2,
      "ease_of_calving2":ease_of_calving2,
      "calving_status2":calving_status2,
      "use_of_calf2":use_of_calf2,
      "use_of_calf_other2":use_of_calf_other2,
      "calf_tag_id2":calf_tag_id2,      
    };

  const options = {
    url:`${config.url}${record_id}`,
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


// get Milking events 
export const getMilking =  function (config,id,option) {   
  const options = {
    url:`${config.url}${id}/${option}`,
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
};

//get milking parameters
export const getMilkingParameters =  function (config,id,milk_date) {   
  const options = {
    url:`${config.url}${id}/${milk_date}`,
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
};


// add new Milking event
export const postMilking =  function (config,animal_id,values,user_id,quality_toggle,lactation_id, lactation_number, days_in_milk,test_day_no) {      
  let {milk_mid_day,milk_lactose,milk_am_litres,milk_protein,milk_urea,milk_somatic_cell_count,field_agent_id,milk_butter_fat,milk_date,milk_pm_litres,milk_sample_type,milking_notes,milk_Weight} = values;
 
    milk_urea = quality_toggle ? (typeof milk_urea === 'undefined' || milk_urea === '')? null:milk_urea : null; 
    milk_protein = quality_toggle ? (typeof milk_protein === 'undefined' || milk_protein === '')? null:milk_protein: null; 
    milk_butter_fat = quality_toggle ? (typeof milk_butter_fat === 'undefined' || milk_butter_fat === '')? null:milk_butter_fat: null;   
    milk_Weight = quality_toggle ? (typeof milk_Weight === 'undefined' || milk_Weight === '')? null:milk_Weight: null;
    milk_somatic_cell_count =  quality_toggle ? (typeof milk_somatic_cell_count === 'undefined' || milk_somatic_cell_count === '')? null:milk_somatic_cell_count: null;  
    milk_sample_type =  quality_toggle ?(typeof milk_sample_type === 'undefined' || milk_sample_type === '')? null:milk_sample_type: null;
    milk_lactose = quality_toggle ? (typeof milk_lactose === 'undefined'  || milk_lactose === '')? null:milk_lactose: null;  

    milking_notes = (typeof milking_notes === 'undefined' || milking_notes === '')? null:milking_notes;        
    field_agent_id = (typeof field_agent_id === 'undefined' || field_agent_id === '')? null:field_agent_id;       
    milk_pm_litres = (typeof milk_pm_litres === 'undefined' || milk_pm_litres === '')? null:milk_pm_litres;     
    milk_date = (typeof milk_date === 'undefined' || milk_date === '')? moment(new Date()).format('YYYY-MM-DD'):milk_date;
    milk_mid_day = (typeof milk_mid_day === 'undefined' || milk_mid_day === '')? null:milk_mid_day;
    milk_am_litres = (typeof milk_am_litres === 'undefined' || milk_am_litres === '')? null:milk_am_litres; 
    
  const body = {
    "animal_id": animal_id, 
    "milk_date": milk_date,
    "days_in_milk": days_in_milk,
    "lactation_id" :lactation_id,
    "lactation_number" :lactation_number,
    "milking_notes": milking_notes,   
    "milk_sample_type_id": milk_sample_type,
    "milk_pm_litres": milk_pm_litres,
    "milk_butter_fat": milk_butter_fat,
    "milk_lactose": milk_lactose,
    "milk_mid_day": milk_mid_day,    
    "milk_protein": milk_protein,
    "milk_am_litres": milk_am_litres,
    "milk_somatic_cell_count": milk_somatic_cell_count,
    "milk_urea": milk_urea,
    "testday_no": test_day_no,
    "milk_Weight":milk_Weight,        
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
};


// update  Milking Record
export const updateMilking =  function (config,event_id,values,user_id) {  
    
  let {milk_mid_day,testday_no,milk_lactose,milk_am_litres,milk_protein,milk_urea,milk_somatic_cell_count,field_agent_id,milk_butter_fat,milk_date,lactation_id,lactation_number,days_in_milk,milk_pm_litres,milk_sample_type,milking_notes,milk_Weight} = values;
  milk_urea = (typeof milk_urea === 'undefined'|| milk_urea === '')? null:milk_urea; 
  milking_notes = (typeof milking_notes === 'undefined' || milking_notes === '')? null:milking_notes; 
  testday_no = (typeof testday_no === 'undefined' || testday_no === '')? null:testday_no;
  lactation_id = (typeof lactation_id === 'undefined' || lactation_id === '')? null:lactation_id; 
  milk_somatic_cell_count = (typeof milk_somatic_cell_count === 'undefined' || milk_somatic_cell_count === '')? null:milk_somatic_cell_count;  
  milk_sample_type = (typeof milk_sample_type === 'undefined' || milk_sample_type === '')? null:milk_sample_type;
  field_agent_id = (typeof field_agent_id === 'undefined' || field_agent_id === '')? null:field_agent_id;       
  milk_pm_litres = (typeof milk_pm_litres === 'undefined' || milk_pm_litres === '')? null:milk_pm_litres;  
  milk_lactose = (typeof milk_lactose === 'undefined' || milk_lactose === '')? null:milk_lactose;    
  milk_date = (typeof milk_date === 'undefined' || milk_date === '')? moment(new Date()).format('YYYY-MM-DD'):milk_date; 
  milk_butter_fat = (typeof milk_butter_fat === 'undefined' || milk_butter_fat === '')? null:milk_butter_fat;   
  milk_Weight = (typeof milk_Weight === 'undefined' || milk_Weight === '')? null:milk_Weight;
  lactation_number = (typeof lactation_number === 'undefined' || lactation_number === 'undefined')? null:lactation_number;
  days_in_milk = (typeof days_in_milk === 'undefined' || days_in_milk === '')? null:days_in_milk; 
  milk_protein = (typeof milk_protein === 'undefined' || milk_protein === '')? null:milk_protein;
  milk_mid_day = (typeof milk_mid_day === 'undefined' || milk_mid_day === '')? null:milk_mid_day;
  milk_am_litres = (typeof milk_am_litres === 'undefined' || milk_am_litres === '')? null:milk_am_litres;   

  const body = {    
    "milk_date": milk_date,
    "days_in_milk": days_in_milk,
    "lactation_id" :lactation_id,
    "lactation_number" :lactation_number,
    "milking_notes": milking_notes,   
    "milk_sample_type_id": milk_sample_type,
    "milk_pm_litres": milk_pm_litres,
    "milk_butter_fat": milk_butter_fat,
    "milk_lactose": milk_lactose,
    "milk_mid_day": milk_mid_day,    
    "milk_protein": milk_protein,
    "milk_am_litres": milk_am_litres,
    "milk_somatic_cell_count": milk_somatic_cell_count,
    "milk_urea": milk_urea,
    "testday_no": testday_no,
    "milk_Weight":milk_Weight,        
    "field_agent_id": field_agent_id,
    "updated_by": user_id
  };

  const options = {
    url:`${config.url}${event_id}`,
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
};

// get specific milking record details
export const getMilkingByEventId =   function (config,id) {   
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


// get Health events 
export const getHealth =  function (config,id) {   
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
};


// add new Health event
export const postHealth =  function (config,animal_id,values,user_id) {
  let {drug_cost,field_agent_id,health_category,health_date,health_provider,health_type,other_health_type} = values;    
    
    drug_cost = (typeof drug_cost === 'undefined')? '0':drug_cost.replace('','0');  
    health_category = (typeof health_category === 'undefined')?'':health_category;
    field_agent_id = (typeof field_agent_id === 'undefined')? '0':field_agent_id.replace('','0');
    health_provider = (typeof health_provider === 'undefined')? '0':health_provider.replace('','0');
    health_type = (typeof health_type === 'undefined')?'':health_type.replace('','0');;
    other_health_type = (typeof other_health_type === 'undefined')? '0':other_health_type;  
    health_date = (typeof health_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):health_date; 

 
  const body = {
    "animal_id": animal_id,
    "health_date": health_date,
    "health_category": health_category,
    "health_provider" : health_provider,
    "health_type": health_type,
    "other_health_type": other_health_type,      
    "field_agent_id": field_agent_id,
    "created_by": user_id,
    "drug_cost":drug_cost
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
};


// Update health event record
export const putHealth =  function (config,event_id,values,user_id) {
  let {drug_cost,field_agent_id,health_category,health_date,health_provider,health_type,other_health_type} = values;    
    
    drug_cost = (typeof drug_cost === 'undefined')? '0':drug_cost.replace('','0');  
    health_category = (typeof health_category === 'undefined')?'':health_category;
    field_agent_id = (typeof field_agent_id === 'undefined')? '0':field_agent_id.replace('','0');
    health_provider = (typeof health_provider === 'undefined')? '0':health_provider.replace('','0');
    health_type = (typeof health_type === 'undefined')?'':health_type.replace('','0');;
    other_health_type = (typeof other_health_type === 'undefined')? '0':other_health_type;  
    health_date = (typeof health_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):health_date; 

 
  const body = {    
    "health_date": health_date,
    "health_category": health_category,
    "health_provider" : health_provider,
    "health_type": health_type,
    "other_health_type": other_health_type,      
    "field_agent_id": field_agent_id,
    "updated_by": user_id,
    "drug_cost":drug_cost
  };
  
  const options = {
    url:`${config.url}${event_id}`,
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
};



// new animal registration
export const postAnimalRegistration =  function (config,org_id,values,user_id,sire,dam) { 
     
    const farm_id = null;
    let {
      herd_id,main_breed_other,animal_name,animal_type, breed_composition,breed_composition_details,color,
      color_other,country_of_origin,deformaties,dob,entry_type,hair_sample_id,herd_book_number,
      main_breed,notes,purchase_cost, secondary_breed, secondary_breed_other, sire_type,tag_id
    } = values;

    herd_id = (typeof herd_id === 'undefined' || herd_id ==='')? null:herd_id;
    main_breed_other =  (typeof main_breed_other === 'undefined' || main_breed_other ==='')?null:main_breed_other;
    animal_name =  (typeof animal_name === 'undefined' || animal_name ==='')? null:animal_name; 
    animal_type =  (typeof animal_type === 'undefined' || animal_type ==='')? null:animal_type; 
    breed_composition =  (typeof breed_composition === 'undefined' || breed_composition ==='')? null:breed_composition; 
    breed_composition_details =  (typeof breed_composition_details === 'undefined' || breed_composition_details ==='')? null:breed_composition_details; 
    color =  (typeof color === 'undefined' || color ==='')? null:color;
    color_other =  (typeof color_other === 'undefined' || color_other ==='')? null:color_other;
    country_of_origin =  (typeof country_of_origin === 'undefined' || country_of_origin ==='')? null:country_of_origin;    
    deformaties =  (typeof deformaties === 'undefined' || deformaties ==='')? null:deformaties; 
    dob =  (typeof dob === 'undefined' || dob ==='')? moment(new Date()).format('YYYY-MM-DD'):dob;    
    entry_type =  (typeof entry_type === 'undefined' || entry_type ==='')? null:entry_type;
    hair_sample_id =  (typeof hair_sample_id === 'undefined' || hair_sample_id ==='')? null:hair_sample_id;
    herd_book_number =  (typeof herd_book_number === 'undefined' || herd_book_number ==='')? null:herd_book_number;  
    main_breed =  (typeof main_breed === 'undefined' || main_breed ==='')? null:main_breed;
    main_breed_other =  (typeof main_breed_other === 'undefined' || main_breed_other ==='')? null:main_breed_other;    
    notes =  (typeof notes === 'undefined' || notes ==='')? null:notes;
    purchase_cost =  (typeof purchase_cost === 'undefined' || purchase_cost ==='')? null:purchase_cost;   
    secondary_breed =  (typeof secondary_breed === 'undefined' || secondary_breed ==='')? null:secondary_breed;   
    sire_type =  (typeof sire_type === 'undefined' || sire_type ==='')? null:sire_type;
    tag_id =  (typeof tag_id === 'undefined' || tag_id ==='')? null:tag_id;
    secondary_breed_other =  (typeof secondary_breed_other === 'undefined' || secondary_breed_other ==='')? null:secondary_breed_other;    
    sire =  (typeof sire === 'undefined' || sire ==='')? null:sire;
    dam =  (typeof dam === 'undefined' || dam ==='')? null:dam;
    
    const body = {
      "created_by": user_id,
      "animal_type": animal_type,
      "birthdate": dob,
      "name": animal_name ,
      "breed_composition": breed_composition ,
      "hair_sample_id": hair_sample_id ,
      "main_breed": main_breed , 
      "tag_id" : tag_id,
      "breed_combination" :"",
      "notes" : notes,      
      "breed_composition_details" :breed_composition_details,
      "color" : color,
      "color_other" :color_other,
      "country_of_origin" :country_of_origin,
      "deformities" :deformaties,      
      "entry_type" :entry_type,
      "herd_book_number" :herd_book_number,
      "main_breed_other" :main_breed_other,
      "purchase_cost" :purchase_cost,
      "secondary_breed" :secondary_breed,
      "secondary_breed_other" :secondary_breed_other,
      "sire_type" :sire_type,
      "sire_id" :sire,
      "dam_id" :dam,
      "herd_id" :herd_id,
      "org_id" :org_id,
      "farm_id" :farm_id    
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


// new animal registration
export const putAnimalDetails =  function (config,org_id,values,user_id,animal_id,sire,dam) { 
     
  const farm_id = null;
  let {
    herd_id,main_breed_other,animal_name,animal_type, breed_composition,breed_composition_details,color,
    color_other,country_of_origin,deformaties,dob,entry_type,hair_sample_id,herd_book_number,
    main_breed,notes,purchase_cost, secondary_breed, secondary_breed_other, sire_type,tag_id,reg_date,entry_date
  } = values;

  herd_id = (typeof herd_id === 'undefined' || herd_id ==='' || herd_id==='null' )? null:parseInt(herd_id);
  main_breed_other =  (typeof main_breed_other === 'undefined' || main_breed_other ==='' || main_breed_other==='null' )?null:main_breed_other;
  animal_name =  (typeof animal_name === 'undefined' || animal_name ==='' || animal_name==='null')? null:animal_name; 
  animal_type =  (typeof animal_type === 'undefined' || animal_type ==='' || animal_type==='null')? null:animal_type; 
  breed_composition =  (typeof breed_composition === 'undefined' || breed_composition ==='' || breed_composition==='null')? null:breed_composition; 
  breed_composition_details =  (typeof breed_composition_details === 'undefined' || breed_composition_details ==='' || breed_composition_details==='null')? null:breed_composition_details; 
  color =  (typeof color === 'undefined' || color ==='' || color ==='null' || color=== "[\"\"]")? null:color;
  color_other =  (typeof color_other === 'undefined' || color_other ===''  || color_other==='null')? null:color_other;
  country_of_origin =  (typeof country_of_origin === 'undefined' || country_of_origin ==='' || country_of_origin==='null')? null:country_of_origin;    
  deformaties =  (typeof deformaties === 'undefined' || deformaties ==='' || deformaties==='null'|| deformaties=== "[\"\"]")? null:deformaties; 
  dob =  (typeof dob === 'undefined' || dob ==='' || dob==='null')? moment(new Date()).format('YYYY-MM-DD'):dob;
  reg_date =  (typeof reg_date === 'undefined' || reg_date ==='' || reg_date==='null')? moment(new Date()).format('YYYY-MM-DD'):reg_date;
  entry_date =  (typeof entry_date === 'undefined' || entry_date ==='' || entry_date==='null')? moment(new Date()).format('YYYY-MM-DD'):entry_date;  
  entry_type =  (typeof entry_type === 'undefined' || entry_type ==='' || entry_type==='null')? null:entry_type;
  hair_sample_id =  (typeof hair_sample_id === 'undefined' || hair_sample_id ==='' || hair_sample_id==='null')? null:hair_sample_id;
  herd_book_number =  (typeof herd_book_number === 'undefined' || herd_book_number ===''  || herd_book_number==='null')? null:herd_book_number;  
  main_breed =  (typeof main_breed === 'undefined' || main_breed ==='' || main_breed==='null')? null:main_breed;
  main_breed_other =  (typeof main_breed_other === 'undefined' || main_breed_other ==='' || main_breed_other==='null')? null:main_breed_other;    
  notes =  (typeof notes === 'undefined' || notes ==='' || notes==='null')? null:notes;
  purchase_cost =  (typeof purchase_cost === 'undefined' || purchase_cost ==='' || purchase_cost==='null')? null:purchase_cost;   
  secondary_breed =  (typeof secondary_breed === 'undefined' || secondary_breed ==='' || secondary_breed==='null' || secondary_breed === "[\"\"]")? null:secondary_breed;
  sire_type =  (typeof sire_type === 'undefined' || sire_type ==='' || sire_type==='null')? null:sire_type;
  tag_id =  (typeof tag_id === 'undefined' || tag_id ==='' || tag_id==='null')? null:tag_id;
  secondary_breed_other =  (typeof secondary_breed_other === 'undefined' || secondary_breed_other ==='' || secondary_breed_other==='null')? null:secondary_breed_other;
  sire =  (typeof sire === 'undefined' || sire ==='' || sire==='null')? null:sire;
  dam =  (typeof dam === 'undefined' || dam ==='' || dam==='null')? null:dam;

  
  const body = { 
    "updated_by": user_id,      
    "animal_type": animal_type,
    "birthdate": dob,
    "name": animal_name ,
    "breed_composition": breed_composition ,
    "hair_sample_id": hair_sample_id ,
    "main_breed": main_breed ,
    "reg_date": reg_date , 
    "tag_id" : tag_id,
    "breed_combination" :"",
    "notes" : notes,   
    "breed_composition_details" :breed_composition_details,
    "color" : color,
    "color_other" :color_other,
    "country_of_origin" :country_of_origin,
    "deformities" :deformaties,
    "entry_date" :entry_date,
    "entry_type" :entry_type,
    "herd_book_number" :herd_book_number,
    "main_breed_other" :main_breed_other,
    "purchase_cost" :purchase_cost,
    "secondary_breed" :secondary_breed,
    "secondary_breed_other" :secondary_breed_other,
    "sire_type" :sire_type,
    "sire_id" :sire,
    "dam_id" :dam,
    "herd_id" :herd_id,
    "org_id" :org_id,
    "farm_id" :farm_id    
  };

const options = {
  url:`${config.url}'${animal_id}'`, 
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


// get specific health Details
export const getHealthByEventId =   function (config,id) {   
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



// parameters
// 1. Limit parameters all
export const getParametersLimitAll =   function (config) {   
  const options = {
    url:`${config.url}`,
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
};

// post & put org profile logo
export const postOrgProfileLogo =   function (config,org_id,formData,user_id,type) {   
  const options = {
    url:`${config.url}/${org_id}/${user_id}/${type}`, 
    method: config.method,
    headers: config.headers,
    data: formData  
  };  
  return new Promise((resolve, reject) => {
    axios(options)
    .then(res => {             
        resolve(res.data);
    })    
    .catch(err => reject(err));
  });       
};

// 2. Limit parameters one
export const getParametersLimitOne =   function (config,id) {   
  const options = {
    url:`${config.url}${id}`,
    method: config.method,
    headers: config.headers  
  }; 

  return new Promise((resolve, reject) => {
    axios(options)
    .then(res => {             
        resolve(res.data);
    })
    .catch(err => reject(err));
  });       
};


// register new limiting parameter
export const postLimitingParameter =  function (config,values,user_id) {      
 
  let {category ,description,is_active,max_value,min_value} = values;
  category = (typeof category === 'undefined' || category ==='')? null: category;
  description =  (typeof description === 'undefined' || description ==='')?null:description;
  is_active =  (typeof is_active === 'undefined' || is_active ==='')? null:is_active; 
  max_value =  (typeof max_value === 'undefined' || max_value ==='')? null:parseFloat(max_value); 
  min_value =  (typeof min_value === 'undefined' || min_value ==='')? null:parseFloat(min_value); 

 
  const body = { 
    "category": category,      
    "description": description,
    "min_value": min_value,
    "max_value": max_value ,
    "is_active": is_active ,
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


// update  limiting parameter
export const updateLimitingParameter =  function (config,values,user_id,limit_id) {      
 
  let {category ,description,is_active,max_value,min_value} = values;

  category = (typeof category === 'undefined' || category ==='')? null: category;
  description =  (typeof description === 'undefined' || description ==='')?null:description;
  is_active =  (typeof is_active === 'undefined' || is_active ==='')? null:is_active; 
  max_value =  (typeof max_value === 'undefined' || max_value ==='')? null:parseFloat(max_value); 
  min_value =  (typeof min_value === 'undefined' || min_value ==='')? null:parseFloat(min_value); 
 
  const body = { 
    "category": category,      
    "description": description,
    "min_value": min_value,
    "max_value": max_value ,
    "is_active": is_active ,
    "updated_by": user_id 
  };

const options = {
  url:`${config.url}${limit_id}`, 
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
};



//system parameterization - local setting
//get all local settings for a specific organization
export const getParametersLocalSettingsOrgAll = function (config,org_id) {   
  const options = {
    url:`${config.url}${org_id}`,
    method: config.method,
    headers: config.headers  
  };  
  return new Promise((resolve, reject) => {
    axios(options)
    .then(res => {             
        resolve(res.data);
    })
    .catch(err => reject(err));
  });       
};

//get a specific parameter/setting for a specific organization
export const getParametersLocalSettingsOrgOne = function (config,param_id) {   
  const options = {
    url:`${config.url}${param_id}`,
    method: config.method,
    headers: config.headers  
  };  
  return new Promise((resolve, reject) => {
    axios(options)
    .then(res => {             
        resolve(res.data);
    })
    .catch(err => reject(err));
  });       
};

//create organization/farm specific local settings
export const postParametersLocalSettings =  function (config,values,user_id,org_id) {      
 
  let {name ,description,is_active,key,value} = values;
  name = (typeof name === 'undefined' || name === '')? null: name;
  description =  (typeof description === 'undefined' || description === '')?null:description;
  is_active =  (typeof is_active === 'undefined' || is_active === '')? null:is_active; 
  key =  (typeof key === 'undefined' || key === '')? null:key;  
  value =  (typeof value === 'undefined' || value === '')? null:value; 
 
  const body = { 
    "name": name,      
    "description": description, 
    "key": key ,   
    "value": value ,
    "is_active": is_active ,
    "created_by": user_id,
    "org_id": org_id,
    "farm_id": null
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
};


//update organization/farm specific local settings
export const updateParametersLocalSettings =  function (config,values,user_id,param_id) {     
 
  let {description,is_active,key,value} = values;

  description =  (typeof description === 'undefined' || description === '')?null:description;
  is_active =  (typeof is_active === 'undefined' || is_active === '')? null:is_active; 
  key =  (typeof key === 'undefined' || key === '')? null:key;  
  value =  (typeof value === 'undefined' || value === '')? null:value; 
 
  const body = {          
    "description": description, 
    "key": key ,   
    "value": value ,
    "is_active": is_active ,
    "updated_by": user_id,    
    "farm_id": null
  };

const options = {
  url:`${config.url}${param_id}`, 
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


//Batch upload
export const postBatchUpload =  function (config,rows,cols,user_id,org_id,uuid) {  
 
  const body = {          
    "rows": rows, 
    "cols": cols ,   
    "created_by": user_id ,
    "org_id": org_id,
    "uuid": uuid   
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
  .catch(err =>    
    reject(err));
});       
}

// view  batched on validation queue
export const getBatchValidation =  function (config,uuid) {   
  const options = {
    url:`${config.url}${uuid}`,
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
};
// view  batched on un-processed validation queue
export const getBatchUnprocessed =  function (config,type,org_id,step,user_id) {   
  const options = {
    url:`${config.url}${type}/${org_id}/${step}/${user_id}`,
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
};

// view milking template for download
export const getBatchTemplate =  function (config,type,org_id) {   
  const options = {
    url:`${config.url}${type}/${org_id}`,
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
};


// view  discarded batches
export const getBatchDiscarded =  function (config,type,org_id,user_id) {   
  const options = {
    url:`${config.url}${type}/${org_id}/${user_id}`,
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
};


// view milking Posted batches
export const getBatchPosted =  function (config,type,org_id,user_id) {   
  const options = {
    url:`${config.url}${type}/${org_id}/${user_id}`,
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
};



//Batch Process Milking - actions
export const batchProcessActions =  function (config,uuid,action,user_id) { 
  const body = {          
    "action": action,
	  "uuid":uuid, 
	  "user":user_id  
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
  .catch(err =>    
    reject(err));
});       
}



// view milking batch validation errors
export const getBatchValidationErrors =   function (config,id,type) {   
  const options = {
    url:`${config.url}${id}/${type}`,
    method: config.method,
    headers: config.headers  
  };  

  return new Promise((resolve, reject) => {
    axios(options)
    .then(res => {             
        resolve(res.data);
    })
    .catch(err => reject(err));
  });       
};



// calender
//1.  view calender items

// view milking batch validation errors
export const getCalenderItems =   function (config,org_id) {   
  const options = {
    url:`${config.url}${org_id}`,
    method: config.method,
    headers: config.headers  
  }; 

  return new Promise((resolve, reject) => {
    axios(options)
    .then(res => {             
        resolve(res.data);
    })
    .catch(err => reject(err));
  });       
};


//Calender Event - Create
export const postCalenderEvent =  function (config,title,description,event_start,event_end,all_day,color,created_by,org_id) {  

  const body = {          
    "title": title, 
    "description": description ,  
    "event_start": event_start ,
    "event_end": event_end , 
    "all_day": all_day , 
    "color": color , 
    "created_by": created_by ,
    "org_id": org_id  
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
  .catch(err =>    
    reject(err));
});       
};


// view event setup
export const getEventSetup =  function (config,animal_id) {   
  const options = {
    url:`${config.url}${animal_id}`,
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
};

export const getEventSetupAll =  function (config) {   
  const options = {
    url:`${config.url}`,
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
};


export const updateEventSetup =  function (config,values,user_id,param_id) {  
  let {calving,milking,health,bio_data,insemination,sync,exit,weight,pd} = values; 
  
  const body = {
    "calving": calving,
    "milking": milking,
    "health": health,
    "bio_data": bio_data,
    "insemination": insemination,
    "sync": sync,
    "exit": exit,
    "weight": weight,
    "pd": pd,
    "updated_by": user_id
  };
const options = {
  url:`${config.url}${param_id}`, 
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


// ADMINISTRATION


// GET ALL ORGANIZATIONS
export const getOrgList =  function (config) {   
  const options = {
    url:`${config.url}`,
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
};

export const putOrgAccess =  function (config,values,user,created_by) { 
  let orgs = [];
  for (let i = 0; i<values.length;i++){
    orgs.push(values[i].id)
  }
   
  const body = {      
    "orgs": orgs,
    "created_by":created_by
  };
    const options = {
    url:`${config.url}${user}`,
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


export const putOrgFarmAllocation =  function (config,org,farm,user,) {  
   
  const body = {      
    "org": org,
    "farm":farm,
    "user":user,
  };
    const options = {
    url:`${config.url}`,
    method: config.method,
    headers: config.headers,
    data: body  
  }; 

  console.log(options);

  return new Promise((resolve, reject) => {
    axios(options)
    .then(res => {           
        resolve(res.data);
    })    
    .catch(err => reject(err));
  });       
}





export const putOrgAccessSwitch =  function (config,org,user) {  
  const body = {      
    "org": org,
    "user":user
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


//Dashboard - Stats
// to cows
export const getTopCows =  function (config,organisation_id,year) {   
  const options = {
    url:`${config.url}${organisation_id}/${year}`,
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

// Analytics Lactation table 
export const getlactationTable =  function (config,animal_id) {   
  const options = {
    url:`${config.url}${animal_id}`,
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


// Analytics Due Dates table 
export const getDueDateTable =  function (config,org,option) {   
  const options = {
    url:`${config.url}${org}/${option}`,
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

// Analytics Due Dates table 
export const getPdActionList =  function (config,org,option) {   
  const options = {
    url:`${config.url}${org}/${option}`,
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

// Analytics Service Action List
export const getServiceActionList =  function (config,org,option) {   
  const options = {
    url:`${config.url}${org}/${option}`,
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




// Analytics Lactation curve 
export const getlactationCurveData =  function (config,animal_id) {   
  const options = {
    url:`${config.url}${animal_id}`,
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


export const getAnnualMilkPerformance =  function (config,organisation_id) {   
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

export const getHerdMilkingSummary =  function (config,rpt_id,org_id) {   
  const options = {
    url:`${config.url}${rpt_id}/${org_id}`,
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

export const getStatsBreedsDistribution =  function (config,org,level,herd) {   
  const options = {
    url:`${config.url}${org}/${level}/${herd}`,
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

export const getStatsDashboardOverview =  function (config,organisation_id) {   
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


// GET GRADUATION LIST
export const getGraduation =  function (config,organisation_id,status) {   
  const options = {
    url:`${config.url}${organisation_id}/${status}`,
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

// GET GRADUATION RECORD
export const getGraduationRecord =  function (config,id) {   
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


// PROCESS GRADUATION RECORD
//update AI Straw
export const putGraduationRecord =  function (config,values,user_id,id) { 
  let {action} = values;  
  const body = {
    "option": action,
	  "user": user_id        
  };

  const options = {
    url:`${config.url}${id}`,
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

// GET BACKGROUND PROCESSES OF AN ORGANIZATION
export const getBackgroundProcessAll =  function (config,org_id) {   
  const options = {
    url:`${config.url}${org_id}`,
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


// GET BACKGROUND-PROCESS RECORD
export const getBackgroundProcessRecord=  function (config,id) {   
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

// UPDATE BACKGROUND PROCESS RECORD
export const updateBackgroundProcessRecord =  function (config,values,user,id,org_id) {  
  let {process_id,status_id} = values;   
 
  const body = {
    "process_id": process_id,
    "org_id": org_id,
    "status_id": status_id,
    "user": user
  };
const options = {
  url:`${config.url}${id}`, 
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

//create or update hoof health event record
export const CreateOrEditHoofHealthRecord =  function (config,id,values,user_id) {  
  let {other_hoof_problems,swelling_of_coronet,digital_dermatitis,field_agent_id,heel_horn_erosion,horizontal_horn_fissure,interdigital_hyperplasia,interdigital_phlegmon,scissor_claws,vertical_horn_fissure,exam_date} = values; 
  other_hoof_problems = (typeof other_hoof_problems === 'undefined' || other_hoof_problems === '')? null:other_hoof_problems;
  swelling_of_coronet = (typeof swelling_of_coronet === 'undefined' || swelling_of_coronet === '')? null:swelling_of_coronet;
  field_agent_id = (typeof field_agent_id === 'undefined' || field_agent_id ==='' )? null:field_agent_id;  
  digital_dermatitis = (typeof digital_dermatitis === 'undefined' || digital_dermatitis === '' )? null:digital_dermatitis;
  heel_horn_erosion = (typeof heel_horn_erosion === 'undefined' || heel_horn_erosion === '' )? null:heel_horn_erosion;
  horizontal_horn_fissure = (typeof horizontal_horn_fissure === 'undefined' || horizontal_horn_fissure === '')? null:horizontal_horn_fissure;
  interdigital_hyperplasia = (typeof interdigital_hyperplasia === 'undefined' || interdigital_hyperplasia === '')? null:interdigital_hyperplasia;
  interdigital_phlegmon = (typeof interdigital_phlegmon === 'undefined' || interdigital_phlegmon === '')? null:interdigital_phlegmon;
  scissor_claws = (typeof scissor_claws === 'undefined' || scissor_claws ==='')? null:scissor_claws;
  vertical_horn_fissure = (typeof vertical_horn_fissure === 'undefined' || vertical_horn_fissure === '' )? null:vertical_horn_fissure; 
  exam_date = (typeof exam_date === 'undefined' || exam_date === '')? moment(new Date()).format('YYYY-MM-DD'):exam_date; 
  
  const body = {
    "id": id, // this can be an animal id or an event record id
    "exam_date": exam_date,
    "other_hoof_problems": other_hoof_problems,
    "swelling_of_coronet" : swelling_of_coronet,
    "digital_dermatitis": digital_dermatitis,
    "heel_horn_erosion": heel_horn_erosion,
    "horizontal_horn_fissure": horizontal_horn_fissure,
    "interdigital_hyperplasia": interdigital_hyperplasia,
    "interdigital_phlegmon": interdigital_phlegmon,
    "scissor_claws": scissor_claws,
    "vertical_horn_fissure": vertical_horn_fissure, 
    "field_agent_id": field_agent_id,
    "user_id": user_id 
  };  
 
  const options = {
    url: config.method === 'POST' ? config.url :`${config.url}${id}`,
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

// get hoof health 
export const getHoofHealth =  function (config,id,option) {   
  const options = {
    url:`${config.url}${id}/${option}`,
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


//create or update injury event record
export const CreateOrEditInjuryRecord =  function (config,id,values,user_id) {   
  let { 
    field_agent_id,  
    injury_cow_status, 
    injury_cow_status_other,
    injury_drug_cost,
    injury_service_cost,
    injury_service_provider,
    injury_type,
    injury_type_other,
    other_service_provider,
    treatmentDate
  } = values; 

  field_agent_id = (typeof field_agent_id === 'undefined' || field_agent_id ==='' )? null:field_agent_id;
  injury_cow_status = (typeof injury_cow_status === 'undefined' || injury_cow_status ==='' )? null:injury_cow_status; 
  injury_cow_status_other = (typeof injury_cow_status_other === 'undefined' || injury_cow_status_other ==='' )? null:injury_cow_status_other;
  injury_drug_cost = (typeof injury_drug_cost === 'undefined' || injury_drug_cost ==='' )? null:injury_drug_cost;
  injury_service_cost = (typeof injury_service_cost === 'undefined' || injury_service_cost ==='' )? null:injury_service_cost;
  injury_service_provider = (typeof injury_service_provider === 'undefined' || injury_service_provider ==='' )? null:injury_service_provider;
  injury_type = (typeof injury_type === 'undefined' || injury_type ==='' )? null:injury_type;
  injury_type_other = (typeof injury_type_other === 'undefined' || injury_type_other ==='' )? null:injury_type_other;
  other_service_provider = (typeof other_service_provider === 'undefined' || other_service_provider ==='' )? null:other_service_provider;
  treatmentDate = (typeof treatmentDate === 'undefined' || treatmentDate ==='' )?  moment(new Date()).format('YYYY-MM-DD'):treatmentDate;
    
  const body = {
    "id": id, // this can be an animal id or an event record id
    "treatmentDate": treatmentDate,
    "injury_type": injury_type,
    "injury_type_other" : injury_type_other,
    "injury_service_provider": injury_service_provider,
    "other_service_provider": other_service_provider,
    "injury_service_cost": injury_service_cost,
    "injury_drug_cost": injury_drug_cost,
    "injury_cow_status": injury_cow_status,
    "injury_cow_status_other": injury_cow_status_other,     
    "field_agent_id": field_agent_id,
    "user_id": user_id 
  };  
 
  const options = {
    url: config.method === 'POST' ? config.url :`${config.url}${id}`,
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

// get injury records 
export const getInjury =  function (config,id,option) {   
  const options = {
    url:`${config.url}${id}/${option}`,
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


//create or update parasite infection event record
export const CreateOrEditParasiteInfectionRecord =  function (config,id,values,user_id) {  
   
  let { 
    field_agent_id,  
    parasite_date,
    parasite_type,
    parasite_type_other,
    parasite_provider,
    parasite_provider_other,
    parasite_drug_cost,
    parasite_service_cost,
    parasite_cow_status,
    parasite_cow_status_other
  } = values;
  
  field_agent_id = (typeof field_agent_id === 'undefined' || field_agent_id ==='' )? null:field_agent_id;
  parasite_type = (typeof parasite_type === 'undefined' || parasite_type ==='' )? null:parasite_type; 
  parasite_type_other = (typeof parasite_type_other === 'undefined' || parasite_type_other ==='' )? null:parasite_type_other;
  parasite_provider = (typeof parasite_provider === 'undefined' || parasite_provider ==='' )? null:parasite_provider;
  parasite_provider_other = (typeof parasite_provider_other === 'undefined' || parasite_provider_other ==='' )? null:parasite_provider_other;
  parasite_drug_cost = (typeof parasite_drug_cost === 'undefined' || parasite_drug_cost ==='' )? null:parasite_drug_cost;
  parasite_service_cost = (typeof parasite_service_cost === 'undefined' || parasite_service_cost ==='' )? null:parasite_service_cost;
  parasite_cow_status = (typeof parasite_cow_status === 'undefined' || parasite_cow_status ==='' )? null:parasite_cow_status;
  parasite_cow_status_other = (typeof parasite_cow_status_other === 'undefined' || parasite_cow_status_other ==='' )? null:parasite_cow_status_other;
  parasite_date = (typeof parasite_date === 'undefined' || parasite_date ==='' )?  moment(new Date()).format('YYYY-MM-DD'):parasite_date;


  const body = {
    "id": id, // this can be an animal id or an event record id
    "parasite_date": parasite_date,
    "parasite_type": parasite_type,
    "parasite_type_other" : parasite_type_other,
    "parasite_provider": parasite_provider,
    "parasite_provider_other": parasite_provider_other,
    "parasite_drug_cost": parasite_drug_cost,
    "parasite_service_cost": parasite_service_cost,
    "parasite_cow_status": parasite_cow_status,
    "parasite_cow_status_other": parasite_cow_status_other,     
    "field_agent_id": field_agent_id,
    "user_id": user_id 
  };  
 
  const options = {
    url: config.method === 'POST' ? config.url :`${config.url}${id}`,
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

// get injury records 
export const getParasiteInfection =  function (config,id,option) {   
  const options = {
    url:`${config.url}${id}/${option}`,
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


//create or update Hoof Treatment event record
export const CreateOrEditHoofTreatmentRecord =  function (config,id,values,user_id) {  
   
  let { 
    field_agent_id,  
    treatment_date,
    hoof_problem,
    hoof_treatment_type,
    hoof_treatment_type_other,
    hoof_treatment_provider,
    hoof_treatment_provider_other,
    hoof_treatment_drug_cost,
    hoof_treatment_service_cost,
    hoof_treatment_cow_status,
    hoof_treatment_cow_status_other
  } = values;    
  
  field_agent_id = (typeof field_agent_id === 'undefined' || field_agent_id ==='' )? null:field_agent_id;
  hoof_problem = (typeof hoof_problem === 'undefined' || hoof_problem ==='' )? null:hoof_problem; 
  hoof_treatment_type = (typeof hoof_treatment_type === 'undefined' || hoof_treatment_type ==='' )? null:hoof_treatment_type;
  hoof_treatment_type_other = (typeof hoof_treatment_type_other === 'undefined' || hoof_treatment_type_other ==='' )? null:hoof_treatment_type_other;
  hoof_treatment_provider = (typeof hoof_treatment_provider === 'undefined' || hoof_treatment_provider ==='' )? null:hoof_treatment_provider;
  hoof_treatment_provider_other = (typeof hoof_treatment_provider_other === 'undefined' || hoof_treatment_provider_other ==='' )? null:hoof_treatment_provider_other;
  hoof_treatment_drug_cost = (typeof hoof_treatment_drug_cost === 'undefined' || hoof_treatment_drug_cost ==='' )? null:hoof_treatment_drug_cost;
  hoof_treatment_service_cost = (typeof hoof_treatment_service_cost === 'undefined' || hoof_treatment_service_cost ==='' )? null:hoof_treatment_service_cost;
  hoof_treatment_cow_status = (typeof hoof_treatment_cow_status === 'undefined' || hoof_treatment_cow_status ==='' )? null:hoof_treatment_cow_status;
  hoof_treatment_cow_status_other = (typeof hoof_treatment_cow_status_other === 'undefined' || hoof_treatment_cow_status_other ==='' )? null:hoof_treatment_cow_status_other;
  treatment_date = (typeof treatment_date === 'undefined' || treatment_date ==='' )?  moment(new Date()).format('YYYY-MM-DD'):treatment_date;

    
  const body = {
    "id": id, // this can be an animal id or an event record id
    "treatment_date": treatment_date,
    "hoof_problem": hoof_problem,
    "hoof_treatment_type" : hoof_treatment_type,
    "hoof_treatment_type_other": hoof_treatment_type_other,
    "hoof_treatment_provider": hoof_treatment_provider,
    "hoof_treatment_provider_other": hoof_treatment_provider_other,
    "hoof_treatment_drug_cost": hoof_treatment_drug_cost,
    "hoof_treatment_service_cost": hoof_treatment_service_cost,
    "hoof_treatment_cow_status": hoof_treatment_cow_status, 
    "hoof_treatment_cow_status_other": hoof_treatment_cow_status_other,    
    "field_agent_id": field_agent_id,
    "user_id": user_id 
  };  
 
  const options = {
    url: config.method === 'POST' ? config.url :`${config.url}${id}`,
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

// get Hoof Treatmentrecords 
export const getHoofTreatment =  function (config,id,option) {   
  const options = {
    url:`${config.url}${id}/${option}`,
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


// get lactation  number 
export const getLactationNumber =  function (config,option,animal_id) {   
  const options = {
    url:`${config.url}${option}/${animal_id}`,
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



//create or update Hoof vaccination event record
export const CreateOrEditVaccinationRecord =  function (config,id,values,user_id) {  
   
  let { 
    vacc_vaccine_date,
    vacc_vaccine_type,
    vacc_vaccine_type_other,
    vacc_vaccine_provider,
    vacc_vaccine_provider_other,
    vacc_vaccine_drug_cost,
    vacc_vaccine_service_cost,
    vacc_vaccine_cow_status,
    vacc_vaccine_cow_status_other,
    ecf_supervisor,
    ecf_provider,
    ecf_provider_mobile,
    ecf_vial_batch,
    ecf_dilution_time,
    ecf_first_immunization,
    ecf_last_immunization,
    ecf_vaccination_weight,
    ecf_vaccination_otc,
    ecf_vaccination_alb,
    ecf_vaccination_temp,
    ecf_vaccination_payment_modes,
    ecf_vaccination_cost,
    ecf_vaccination_is_subsidised,
    ecf_vaccination_voucher
  } = values; 
  
  vacc_vaccine_date = (typeof vacc_vaccine_date === 'undefined' || vacc_vaccine_date ==='' )?  moment(new Date()).format('YYYY-MM-DD'):vacc_vaccine_date;
  vacc_vaccine_type = (typeof vacc_vaccine_type === 'undefined' || vacc_vaccine_type ==='' )? null:vacc_vaccine_type;
  vacc_vaccine_type_other = (typeof vacc_vaccine_type_other === 'undefined' || vacc_vaccine_type_other ==='' )? null:vacc_vaccine_type_other;
  vacc_vaccine_provider = (typeof vacc_vaccine_provider === 'undefined' || vacc_vaccine_provider ==='' )? null:vacc_vaccine_provider;
  vacc_vaccine_provider_other = (typeof vacc_vaccine_provider_other === 'undefined' || vacc_vaccine_provider_other ==='' )? null:vacc_vaccine_provider_other;
  vacc_vaccine_drug_cost = (typeof vacc_vaccine_drug_cost === 'undefined' || vacc_vaccine_drug_cost ==='' )? null:vacc_vaccine_drug_cost;
  vacc_vaccine_service_cost = (typeof vacc_vaccine_service_cost === 'undefined' || vacc_vaccine_service_cost ==='' )? null:vacc_vaccine_service_cost;
  vacc_vaccine_cow_status = (typeof vacc_vaccine_cow_status === 'undefined' || vacc_vaccine_cow_status ==='' )? null:vacc_vaccine_cow_status;
  vacc_vaccine_cow_status_other = (typeof vacc_vaccine_cow_status_other === 'undefined' || vacc_vaccine_cow_status_other ==='' )? null:vacc_vaccine_cow_status_other;
  ecf_supervisor = (typeof ecf_supervisor === 'undefined' || ecf_supervisor ==='' )? null:ecf_supervisor;
  ecf_provider = (typeof ecf_provider === 'undefined' || ecf_provider ==='' )? null:ecf_provider;
  ecf_provider_mobile = (typeof ecf_provider_mobile === 'undefined' || ecf_provider_mobile ==='' )? null:ecf_provider_mobile;
  ecf_vial_batch = (typeof ecf_vial_batch === 'undefined' || ecf_vial_batch ==='' )? null:ecf_vial_batch;
  ecf_dilution_time = (typeof ecf_dilution_time === 'undefined' || ecf_dilution_time ==='' )? null:ecf_dilution_time;
  ecf_first_immunization = (typeof ecf_first_immunization === 'undefined' || ecf_first_immunization ==='' )? null:ecf_first_immunization;
  ecf_last_immunization = (typeof ecf_last_immunization === 'undefined' || ecf_last_immunization ==='' )? null:ecf_last_immunization;
  ecf_vaccination_weight = (typeof ecf_vaccination_weight === 'undefined' || ecf_vaccination_weight ==='' )? null:ecf_vaccination_weight;
  ecf_vaccination_otc = (typeof ecf_vaccination_otc === 'undefined' || ecf_vaccination_otc ==='' )? null:ecf_vaccination_otc;
  ecf_vaccination_alb = (typeof ecf_vaccination_alb === 'undefined' || ecf_vaccination_alb ==='' )? null:ecf_vaccination_alb;
  ecf_vaccination_temp = (typeof ecf_vaccination_temp === 'undefined' || ecf_vaccination_temp ==='' )? null:ecf_vaccination_temp;
  ecf_vaccination_payment_modes = (typeof ecf_vaccination_payment_modes === 'undefined' || ecf_vaccination_payment_modes ==='' )? null:ecf_vaccination_payment_modes;
  ecf_vaccination_cost = (typeof ecf_vaccination_cost === 'undefined' || ecf_vaccination_cost ==='' )? null:ecf_vaccination_cost;
  ecf_vaccination_is_subsidised = (typeof ecf_vaccination_is_subsidised === 'undefined' || ecf_vaccination_is_subsidised ==='' )? null:ecf_vaccination_is_subsidised;
  ecf_vaccination_voucher = (typeof ecf_vaccination_voucher === 'undefined' || ecf_vaccination_voucher ==='' )? null:ecf_vaccination_voucher;

    
  const body = {
    "id": id, // this can be an animal id or an event record id
    "vacc_vaccine_date" : vacc_vaccine_date,
    "vacc_vaccine_type" :vacc_vaccine_type,
    "vacc_vaccine_type_other" :vacc_vaccine_type_other,
    "vacc_vaccine_provider" :vacc_vaccine_provider,
    "vacc_vaccine_provider_other" :vacc_vaccine_provider_other,
    "vacc_vaccine_drug_cost" :vacc_vaccine_drug_cost,
    "vacc_vaccine_service_cost" :vacc_vaccine_service_cost,
    "vacc_vaccine_cow_status" :vacc_vaccine_cow_status,
    "vacc_vaccine_cow_status_other" :vacc_vaccine_cow_status_other,
    "ecf_supervisor" :ecf_supervisor,
    "ecf_provider" :ecf_provider,
    "ecf_provider_mobile" :ecf_provider_mobile,
    "ecf_vial_batch" :ecf_vial_batch,
    "ecf_dilution_time" :ecf_dilution_time,
    "ecf_first_immunization" : ecf_first_immunization,
    "ecf_last_immunization" :ecf_last_immunization,
    "ecf_vaccination_weight" :ecf_vaccination_weight,
    "ecf_vaccination_otc" :ecf_vaccination_otc,
    "ecf_vaccination_alb" :ecf_vaccination_alb,
    "ecf_vaccination_temp" :ecf_vaccination_temp,
    "ecf_vaccination_payment_modes" :ecf_vaccination_payment_modes,
    "ecf_vaccination_cost" :ecf_vaccination_cost,
    "ecf_vaccination_is_subsidised" :ecf_vaccination_is_subsidised,
    "ecf_vaccination_voucher" :ecf_vaccination_voucher,     
    "user_id": user_id 
  };  

  const options = {
    url: config.method === 'POST' ? config.url :`${config.url}${id}`,
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

// get Vaccination records 
export const getVaccination =  function (config,id,option) {   
  const options = {
    url:`${config.url}${id}/${option}`,
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


// Weight & Growth Data
export const getWeightGrowthCurveData =  function (config,option,type,animal_id) { 
  const options = {
    url:`${config.url}${option}/${type}/${animal_id}`,
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

// Animal Health Management
export const getHealthManagementSummary =  function (config,option,id,date_start,date_end) { 
  const options = {
    url:`${config.url}${option}/${id}/${date_start}/${date_end}`,
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


// add new exit event
export const createUpdateUserAccount =  function (config,option,id,org,values,user_id) {  
  /**
   * OPTIONS
   * 0 - create new
   * 1 - update
   * 
   * ID
   * for edits, the id is the record id but when creating a new records, the id is null
   */
  let { 
      country,
      district,
      email,
      name,
      phone,
      region,
      timezone,
      username,
      village,
      ward,
      role,
      status
  } = values;

    country = (typeof country === 'undefined' || country === '')? null:country;  
    district = (typeof district === 'undefined' || district === '')? null:district;  
    email = (typeof email === 'undefined' || email === '')? null:email;  
    name = (typeof name === 'undefined' || name === '')? null:name;  
    phone = (typeof phone === 'undefined' || phone === '')? null:phone;  
    region = (typeof region === 'undefined' || region === '')? null:region;  
    timezone = (typeof timezone === 'undefined' || timezone === '')? null:timezone;  
    username = (typeof username === 'undefined' || username === '')? null:username;  
    village = (typeof village === 'undefined' || village === '')? null:village;  
    ward = (typeof ward === 'undefined' || ward === '')? null:ward;  
    role = (typeof role === 'undefined' || role === '')? null:role; 
    status = (typeof status === 'undefined' || status === '')? null:status; 
    
    
    const body = {   
      "name": name,
      "username": username,
      "phone": phone,
      "email" : email,
      "country": country,
      "district": district,
      "region": region,
      "ward": ward,
      "village": village,
      "timezone":timezone,
      "user":user_id,
      "option":option,
      "id":id,
      "org":org,
      "role":role,  
      "status":status         
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


// change password
export const changePassword =  function (config,values,email,user) {    
  let { 
      current_password,
      new_password,
      confirm_password,
      hash      
  } = values;

  current_password = (typeof current_password === 'undefined' || current_password === '')? null:current_password;  
  new_password = (typeof new_password === 'undefined' || new_password === '')? null:new_password;  
  confirm_password = (typeof confirm_password === 'undefined' || confirm_password === '')? null:confirm_password; 
  hash = (typeof hash === 'undefined' || hash === '')? null:hash;   
           
  const body = {   
    "email": email,
    "current_password": current_password,
    "new_password": new_password,
    "confirm_password" : confirm_password,
    "user": user,
    "hash" : hash
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

export const resetPassword =  function (config,values) {    
  let { email } = values;
  email = (typeof email === 'undefined' || email === '')? null:email; 

  const body = {   
    "email": email    
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

export const milkBatchModifyRevalidate =  function (config,values,record_id,user_id,batch_type) { 
  
  let { amount_afternoon,amount_morning,amount_noon,animal_id,milk_date,remove } = values;
  amount_afternoon = (typeof amount_afternoon === 'undefined' || amount_afternoon === '')? null:amount_afternoon; 
  amount_morning = (typeof amount_morning === 'undefined' || amount_morning === '')? null:amount_morning;
  amount_noon = (typeof amount_noon === 'undefined' || amount_noon === '')? null:amount_noon;
  animal_id = (typeof animal_id === 'undefined' || animal_id === '')? null:animal_id;
  milk_date = (typeof milk_date === 'undefined' || milk_date === '')? null:milk_date;
  remove = (typeof remove === 'undefined' || remove === '')? null:remove;

  const body = {   
    "amount_afternoon": amount_afternoon,  
    "amount_morning": amount_morning,
    "amount_noon": amount_noon,
    "animal_id": animal_id,
    "milk_date": milk_date,
    "record_id": record_id,
    "user_id": user_id, 
    "batch_type": batch_type,
    "remove":remove
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



export const weightBatchModifyRevalidate =  function (config,values,record_id,user_id,batch_type) { 
  
  let {body_length, body_score, body_weight, heart_girth, weight_date, animal_id,remove } = values;

  body_length = (typeof body_length === 'undefined' || body_length === '')? null:body_length; 
  body_score = (typeof body_score === 'undefined' || body_score === '')? null:body_score;
  body_weight = (typeof body_weight === 'undefined' || body_weight === '')? null:body_weight;
  animal_id = (typeof animal_id === 'undefined' || animal_id === '')? null:animal_id;
  weight_date = (typeof weight_date === 'undefined' || weight_date === '')? null:weight_date;
  heart_girth = (typeof heart_girth === 'undefined' || heart_girth === '')? null:heart_girth;
  remove = (typeof remove === 'undefined' || remove === '')? null:remove;

  const body = {   
    "body_length": body_length,  
    "body_score": body_score,
    "body_weight": body_weight,
    "animal_id": animal_id,
    "heart_girth": heart_girth,
    "weight_date": weight_date,  
    "record_id": record_id,
    "user_id": user_id, 
    "batch_type": batch_type,
    "remove":remove
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

export const aiBatchModifyRevalidate =  function (config,values,record_id,user_id,batch_type) {  

  let {straw_id_id,body_score, service_date, cost, animal_id, ai_type_id, ai_tech,remove } = values;
  straw_id_id = (typeof straw_id_id === 'undefined' || straw_id_id === '')? null:straw_id_id; 
  body_score = (typeof body_score === 'undefined' || body_score === '')? null:body_score;
  ai_type_id = (typeof ai_type_id === 'undefined' || ai_type_id === '')? null:ai_type_id;
  animal_id = (typeof animal_id === 'undefined' || animal_id === '')? null:animal_id;
  service_date = (typeof service_date === 'undefined' || service_date === '')? null:service_date;
  cost = (typeof cost === 'undefined' || cost === '')? null:cost;
  ai_tech = (typeof ai_tech === 'undefined' || ai_tech === '')? null:ai_tech;
  remove = (typeof remove === 'undefined' || remove === '')? null:remove;

  const body = {   
    "straw_id": straw_id_id,  
    "service_date": service_date,
    "cost": cost,
    "animal_id": animal_id,
    "ai_type_id": ai_type_id,
    "ai_tech": ai_tech,  
    "body_score": body_score,
    "record_id": record_id,
    "user_id": user_id, 
    "batch_type": batch_type,
    "remove":remove
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


export const animalBatchModifyRevalidate =  function (config,values,record_id,user_id,batch_type) { 
 
  let {animal_name,animal_type_id,breed_composition_id,color_id,dam_tag_id,dob,entry_type_id,main_breed_id,remove,sec_breed_id,sex_id,sire_tag_id,sire_type_id,tag_id} = values;
  animal_name = (typeof animal_name === 'undefined' || animal_name === '')? null:animal_name; 
  animal_type_id = (typeof animal_type_id === 'undefined' || animal_type_id === '')? null:animal_type_id; 
  breed_composition_id = (typeof breed_composition_id === 'undefined' || breed_composition_id === '')? null:breed_composition_id; 
  color_id = (typeof color_id === 'undefined' || color_id === '')? null:color_id; 
  dam_tag_id = (typeof dam_tag_id === 'undefined' || dam_tag_id === '')? null:dam_tag_id; 
  dob = (typeof dob === 'undefined' || dob === '')? null:dob; 
  entry_type_id = (typeof entry_type_id === 'undefined' || entry_type_id === '')? null:entry_type_id; 
  main_breed_id = (typeof main_breed_id === 'undefined' || main_breed_id === '')? null:main_breed_id; 
  remove = (typeof remove === 'undefined' || remove === '')? null:remove; 
  sec_breed_id = (typeof sec_breed_id === 'undefined' || sec_breed_id === '')? null:sec_breed_id; 
  sex_id = (typeof sex_id === 'undefined' || sex_id === '')? null:sex_id; 
  sire_tag_id = (typeof sire_tag_id === 'undefined' || sire_tag_id === '')? null:sire_tag_id; 
  sire_type_id = (typeof sire_type_id === 'undefined' || sire_type_id === '')? null:sire_type_id; 
  tag_id = (typeof tag_id === 'undefined' || tag_id === '')? null:tag_id; 
  

  const body = {     
    "animal_name": animal_name,  
    "animal_type_id": animal_type_id,
    "breed_composition_id": breed_composition_id,
    "color_id": color_id,
    "dam_tag_id": dam_tag_id,
    "record_id": record_id,
    "user_id": user_id, 
    "batch_type": batch_type,
    "remove":remove, 
    "dob":dob,
    "entry_type_id":entry_type_id,
    "main_breed_id":main_breed_id,    
    "sex_id":sex_id,
    "sire_tag_id":sire_tag_id,
    "sire_type_id":sire_type_id,
    "tag_id":tag_id,
    "sec_breed_id": sec_breed_id
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


//post herd
export const postHerd =  function (config,values,user_id,org_id) { 
   
  let {country, district,farm_id, herd_name, region , village, ward } = values;

    country = (typeof country === 'undefined' || country === '')? null:country
    district = (typeof district === 'undefined' || district === '')? null:district;
    herd_name = (typeof herd_name === 'undefined' || herd_name === '')? null:herd_name;
    region = (typeof region === 'undefined' || region === '')? null:region;
    village = (typeof village === 'undefined' || village === '')? null:village;
    ward = (typeof ward === 'undefined' || ward === '')? null:ward;  
    farm_id = (typeof farm_id === 'undefined' || farm_id === '')? null:farm_id;  
       
  const body = {
    "country": country,
    "region": region,
    "district": district,    
    "ward": ward,
    "village": village,           
    "herd_name": herd_name,            
    "org": org_id,
    "user": user_id,
    "farm_id": farm_id       
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

//update herd
export const putHerd =  function (config,values,user_id,org) { 
   
  let {country, district,farm_id, herd_name, region , village, ward, reg_date,id } = values;

    country = (typeof country === 'undefined' || country === '')? null:country
    district = (typeof district === 'undefined' || district === '')? null:district;
    herd_name = (typeof herd_name === 'undefined' || herd_name === '')? null:herd_name;
    region = (typeof region === 'undefined' || region === '')? null:region;
    village = (typeof village === 'undefined' || village === '')? null:village;
    ward = (typeof ward === 'undefined' || ward === '')? null:ward;  
    farm_id = (typeof farm_id === 'undefined' || farm_id === '')? null:farm_id;  
    reg_date = (typeof reg_date === 'undefined' || reg_date === '')? null:reg_date;
    id = (typeof id === 'undefined' || id === '')? null:id;
       
  const body = {
    "herd_id": id,
    "country": country,
    "region": region,
    "district": district,    
    "ward": ward,
    "village": village,           
    "herd_name": herd_name,  
    "user": user_id,
    "farm_id": farm_id,  
    "reg_date": reg_date,
    "org_id": org      
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

//post farm
export const postFarm =  function (config,values,user_id,org_id) {
   
  let {country,district,email,farm_code,farm_type,farm_name,farmer_name,phone,region,village,ward } = values;

  country = (typeof country === 'undefined' || country === '')? null:country
  district = (typeof district === 'undefined' || district === '')? null:district;
  email = (typeof email === 'undefined' || email === '')? null:email;
  region = (typeof region === 'undefined' || region === '')? null:region;
  village = (typeof village === 'undefined' || village === '')? null:village;
  ward = (typeof ward === 'undefined' || ward === '')? null:ward;  
  farm_code = (typeof farm_code === 'undefined' || farm_code === '')? null:farm_code; 
  farm_type = (typeof farm_type === 'undefined' || farm_type === '')? null:farm_type;  
  farm_name = (typeof farm_name === 'undefined' || farm_name === '')? null:farm_name;  
  farmer_name = (typeof farmer_name === 'undefined' || farmer_name === '')? null:farmer_name;  
  phone = (typeof phone === 'undefined' || phone === '')? null:phone;    

  const body = {
    "country": country,
    "region": region,
    "district": district,    
    "ward": ward,
    "village": village, 
    "org": org_id,
    "user": user_id,
    "email": email,  
    "farm_code": farm_code,
    "farm_type": farm_type,
    "farm_name": farm_name,
    "farmer_name": farmer_name,
    "phone": phone    
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

//update farm
export const putFarm =  function (config,values,user_id,org) { 
   
  let {country,district,email,farm_code,farm_type,farm_name,farmer_name,phone,region,village,ward, reg_date,id } = values;

  country = (typeof country === 'undefined' || country === '')? null:country
  district = (typeof district === 'undefined' || district === '')? null:district;
  email = (typeof email === 'undefined' || email === '')? null:email;
  region = (typeof region === 'undefined' || region === '')? null:region;
  village = (typeof village === 'undefined' || village === '')? null:village;
  ward = (typeof ward === 'undefined' || ward === '')? null:ward;  
  farm_code = (typeof farm_code === 'undefined' || farm_code === '')? null:farm_code; 
  farm_type = (typeof farm_type === 'undefined' || farm_type === '')? null:farm_type;  
  farm_name = (typeof farm_name === 'undefined' || farm_name === '')? null:farm_name;  
  farmer_name = (typeof farmer_name === 'undefined' || farmer_name === '')? null:farmer_name;  
  phone = (typeof phone === 'undefined' || phone === '')? null:phone;      
  reg_date = (typeof reg_date === 'undefined' || reg_date === '')? null:reg_date;
  id = (typeof id === 'undefined' || id === '')? null:id;
 
  const body = {
    "farm_id": id,
    "country": country,
    "region": region,
    "district": district,    
    "ward": ward,
    "village": village, 
    "org": org,
    "user": user_id,
    "email": email,  
    "farm_code": farm_code,
    "farm_type": farm_type,
    "farm_name": farm_name,
    "farmer_name": farmer_name,
    "phone": phone,
    "reg_date": reg_date    
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


//post org
export const postOrg =  function (config,values,user_id) {
   
  let {country,org_name } = values;

  country = (typeof country === 'undefined' || country === '')? null:country
  org_name = (typeof org_name === 'undefined' || org_name === '')? null:org_name;     

  const body = {
    "country": country,
    "org_name": org_name,   
    "user": user_id      
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



//put org
export const putOrg =  function (config,values,user_id,org_id) {
   
  let {country,org_name } = values;
  country = (typeof country === 'undefined' || country === '')? null:country
  org_name = (typeof org_name === 'undefined' || org_name === '')? null:org_name;     

  const body = {
    "country": country,
    "org_name": org_name,   
    "user": user_id,
    "org_id": org_id
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

// Remove access to a unit
export const UnitAccessAddRemove =  function (config,arr_ids,account_id,user_id,unit_type,action) {     
  const body = {
    "account_id": account_id,
    "user_id": user_id, 
    "unit_type": unit_type,  
    "units": arr_ids,
    "action": action
  }; 

  console.log(body);
  
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









































































