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

// update weight event
export const updateWeight =  function (config,event_id,values,user_id) {    
  let {body_length,body_score,field_agent_id,heart_girth,weight,event_date} = values;
  body_length = (typeof body_length === 'undefined')? '0':body_length.replace('','0');  
  body_score = (typeof body_score === 'undefined')? '0':body_score.replace('','0');
  field_agent_id = (typeof field_agent_id === 'undefined')? '0':field_agent_id.replace('','0');
  heart_girth = (typeof heart_girth === 'undefined')? '0':heart_girth.replace('','0');
  weight = (typeof weight === 'undefined')? '0':weight.replace('','0');
  event_date = (typeof event_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):event_date;  
 
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
  cost = (typeof cost === 'undefined')? null:cost.replace('','0');  
  pd_stage = (typeof pd_stage === 'undefined')? '0':pd_stage.replace('','0');
  field_agent_id = (typeof field_agent_id === 'undefined')? '0':field_agent_id.replace('','0');
  body_score = (typeof body_score === 'undefined')? '0':body_score.replace('','0');
  pd_method = (typeof pd_method === 'undefined')? '0':pd_method.replace('','0');
  pd_results = (typeof pd_results === 'undefined')? '0':pd_results.replace('','0');
  service_date = (typeof service_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):service_date;  
  exam_date = (typeof exam_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):exam_date;  
  exam_time = (typeof exam_time === 'undefined')? moment(new Date()).format('HH:mm:ss'):exam_time;  
  
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
  cost = (typeof cost === 'undefined')? '0':cost.replace('','0');  
  pd_stage = (typeof pd_stage === 'undefined')? '0':pd_stage.replace('','0');
  field_agent_id = (typeof field_agent_id === 'undefined')? '0':field_agent_id.replace('','0');
  body_score = (typeof body_score === 'undefined')? '0':body_score.replace('','0');
  pd_method = (typeof pd_method === 'undefined')? '0':pd_method.replace('','0');
  pd_results = (typeof pd_results === 'undefined')? '0':pd_results.replace('','0');
  service_date = (typeof service_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):service_date;  
  exam_date = (typeof exam_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):exam_date;  
  exam_time = (typeof exam_time === 'undefined')? moment(new Date()).format('HH:mm:ss'):exam_time;  
  
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
  let {animal_parity,cost,field_agent_id,hormone_source,hormone_type,other_hormone_type,sync_number,sync_date,sync_other_person,sync_person,sync_person_phone,sync_time} = values;
  
  animal_parity = (typeof animal_parity === 'undefined') ? null: isNaN(parseInt(animal_parity))?null:parseInt(animal_parity);  
  cost = (typeof cost === 'undefined')? '0':cost.replace('','0');
  field_agent_id = (typeof field_agent_id === 'undefined')? '':field_agent_id.replace('','');
  hormone_source = (typeof hormone_source === 'undefined')? '0':hormone_source.replace('','0');
  hormone_type = (typeof hormone_type === 'undefined')? '0':hormone_type.replace('','0');
  
  other_hormone_type = (typeof other_hormone_type === 'undefined')? '':other_hormone_type;
  sync_number = (typeof sync_number === 'undefined')? '0':sync_number.replace('','0');
  sync_other_person = (typeof sync_other_person === 'undefined')? '':sync_other_person;
  sync_person = (typeof sync_person === 'undefined')? '0':parseInt(sync_person);
  sync_person_phone = (typeof sync_person_phone === 'undefined')? '':sync_person_phone;
  sync_date = (typeof sync_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):sync_date; 
  sync_time = (typeof sync_time === 'undefined')? moment(new Date()).format('HH:mm:ss'):sync_time;
  
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
  
  animal_parity = (typeof animal_parity === 'undefined') ? null: isNaN(parseInt(animal_parity))?null:parseInt(animal_parity);  
  
  cost = (typeof cost === 'undefined')? '0':cost.replace('','0');
  field_agent_id = (typeof field_agent_id === 'undefined')? '0':field_agent_id.replace('','0');
  hormone_source = (typeof hormone_source === 'undefined')? '0':hormone_source.replace('','0');
  hormone_type = (typeof hormone_type === 'undefined')? '0':hormone_type.replace('','0');
  other_hormone_source = (typeof other_hormone_source === 'undefined')? '':other_hormone_source;
  other_hormone_type = (typeof other_hormone_type === 'undefined')? '':other_hormone_type;
  sync_number = (typeof sync_number === 'undefined')? '0':sync_number.replace('','0');
  sync_other_person = (typeof sync_other_person === 'undefined')? '':sync_other_person;
  sync_person = (typeof sync_person === 'undefined')? '0':sync_person.replace('','0');
  sync_person_phone = (typeof sync_person_phone === 'undefined')? '':sync_person_phone;
  sync_date = (typeof sync_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):sync_date; 
  sync_time = (typeof sync_time === 'undefined')? moment(new Date()).format('HH:mm:ss'):sync_time; 

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
    
  ai_type = (typeof ai_type === 'undefined')? '0':ai_type.replace('','0');  
  body_condition_score = (typeof body_condition_score === 'undefined')? '0':body_condition_score.replace('','0');
  field_agent_id = (typeof field_agent_id === 'undefined')? '0':field_agent_id.replace('','0');  
  straw_id = (typeof straw_id === 'undefined')? '':straw_id;   
  cost = (typeof cost === 'undefined')? '0':cost.replace('','0');
  service_date = (typeof service_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):service_date; 
  

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
  ai_type = (typeof ai_type === 'undefined')? '0':ai_type.replace('','0');  
  body_condition_score = (typeof body_condition_score === 'undefined')? '0':body_condition_score.replace('','0');
  field_agent_id = (typeof field_agent_id === 'undefined')? '0':field_agent_id.replace('','0');  
  straw_record_id = (typeof straw_record_id === 'undefined')? null:straw_record_id;   
  cost = (typeof cost === 'undefined')? '0':cost.replace('','0');
  service_date = (typeof service_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):service_date; 
  
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

//post ai straw
export const postStraw =  function (config,values,user_id,org_id) { 
  let {straw_id, barcode, bull_tag_id, bull_name ,breed, breed_composition, semen_source,origin_country, farm_name,batch_number ,ejaculation_number ,production_date, specification ,additional_info  } = values;
 
 

  straw_id = (typeof straw_id === 'undefined')? null:straw_id
  barcode = (typeof barcode === 'undefined')? null:barcode;
  bull_tag_id = (typeof bull_tag_id === 'undefined')? null:bull_tag_id;
  bull_name = (typeof bull_name === 'undefined')? null:bull_name;
  breed = (typeof breed === 'undefined')? null:breed;
  breed_composition = (typeof breed_composition === 'undefined')? null:isNaN(parseInt(breed_composition))?null:parseInt(breed_composition) ;
  semen_source = (typeof semen_source === 'undefined')? null:isNaN(parseInt(semen_source))?null:parseInt(semen_source);
  origin_country = (typeof origin_country === 'undefined')? null:isNaN(parseInt(origin_country))?null:parseInt(origin_country);   
  farm_name = (typeof farm_name === 'undefined')? null:farm_name;
  batch_number = (typeof batch_number === 'undefined')? null:batch_number;
  ejaculation_number = (typeof ejaculation_number === 'undefined')? null:ejaculation_number;
  production_date = (typeof production_date === 'undefined')? null:production_date;
  specification  = (typeof specification === 'undefined')? null:specification;
  additional_info = (typeof additional_info === 'undefined')? null:additional_info;
  
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
  let {straw_id, barcode, bull_tag_id, bull_name ,breed_id, breed_composition_id, semen_source,origin_country, farm_name,batch_number ,ejaculation_number ,production_date, specification_id ,additional_info,is_active  } = values;
  
  breed_composition_id = (typeof breed_composition_id === 'undefined')? null:isNaN(parseInt(breed_composition_id))?null:parseInt(breed_composition_id) ;
  semen_source = (typeof semen_source === 'undefined')? null:isNaN(parseInt(semen_source))?null:parseInt(semen_source);
  origin_country = (typeof origin_country === 'undefined')? null:isNaN(parseInt(origin_country))?null:parseInt(origin_country);   
  

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
  let {phone_number,acronym,city,contact_person,contact_person_mobile_number,country,description,email,name,postal_address,postal_code,service_provider_type,services_offered} = values;
 
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
  let {phone_number,occupation,city,physical_address,affiliation,country,speciality,email,name,postal_address,postal_code} = values;
  
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
  let {phone,acronym,city,contact_person,contact_person_mobile_number,country_id,description,email,name,postal_address,postal_code,service_provider_type_id,services_offered} = values;
 
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
  let {phone,occupation,city,physical_address,affiliation_id,country_id,speciality,email,name,postal_address,postal_code} = values;
  
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
  
  disposal_amount = (typeof disposal_amount === 'undefined')? '0':disposal_amount.replace('','0');  
  disposal_reason = (typeof disposal_reason === 'undefined')? '0':disposal_reason.replace('','0'); 
  disposal_reason_other = (typeof disposal_reason_other === 'undefined')? '':disposal_reason_other;
  new_breeder_name = (typeof new_breeder_name === 'undefined')? '':new_breeder_name;
  new_breeder_phone_no = (typeof new_breeder_phone_no === 'undefined')? '':new_breeder_phone_no;
  new_farmer_name = (typeof new_farmer_name === 'undefined')? '':new_farmer_name;
  new_farmer_phone_no = (typeof new_farmer_phone_no === 'undefined')? '':new_farmer_phone_no;
  new_country = (typeof new_country === 'undefined')? '0':new_country.replace('','0');
  new_district = (typeof new_district === 'undefined')? '0':new_district.replace('','0');
  new_region = (typeof new_region === 'undefined')? '0':new_region.replace('','0');
  new_ward = (typeof new_ward === 'undefined')? '0':new_ward.replace('','0');
  new_village = (typeof new_village === 'undefined')? '0':new_village.replace('','0');
  exit_date = (typeof exit_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):exit_date;   

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
  
  disposal_amount = (typeof disposal_amount === 'undefined')? '0':disposal_amount.replace('','0');  
  disposal_reason = (typeof disposal_reason === 'undefined')? '0':disposal_reason.replace('','0');
  field_agent_id = (typeof field_agent_id === 'undefined')? '0':field_agent_id.replace('','0');
  disposal_reason_other = (typeof disposal_reason_other === 'undefined')? '':disposal_reason_other;
  new_breeder_name = (typeof new_breeder_name === 'undefined')? '':new_breeder_name;
  new_breeder_phone_no = (typeof new_breeder_phone_no === 'undefined')? '':new_breeder_phone_no;
  new_farmer_name = (typeof new_farmer_name === 'undefined')? '':new_farmer_name;
  new_farmer_phone_no = (typeof new_farmer_phone_no === 'undefined')? '':new_farmer_phone_no;
  new_country = (typeof new_country === 'undefined')? '0':new_country.replace('','0');
  new_district = (typeof new_district === 'undefined')? '0':new_district.replace('','0');
  new_region = (typeof new_region === 'undefined')? '0':new_region.replace('','0');
  new_village = (typeof new_village === 'undefined')? '0':new_village.replace('','0');
  exit_date = (typeof exit_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):exit_date;   

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
export const getCalving =  function (config,id) {   
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
export const postCalving =  function (config,animal_id,values,user_id) {    
  let { 
     Calf_weight,calf_body_condition_score,calf_color,calf_deformities,
     calf_heart_girth,calf_name,calf_tag_id,calving_birth_type,
     calving_status,calving_type_other,calving_date,calving_method,
     ease_of_calving,ease_of_calving_other,field_agent_id,lactation_number,
     other_calf_deformities,use_of_calf,use_of_calf_other,calf_gender,types_calving
    } = values;

    
    Calf_weight = (typeof Calf_weight === 'undefined')? '0':Calf_weight.replace('','0');  
    use_of_calf_other = (typeof use_of_calf_other === 'undefined')? '0':use_of_calf_other;
    field_agent_id = (typeof field_agent_id === 'undefined')? '0':field_agent_id.replace('','0');
    use_of_calf = (typeof use_of_calf === 'undefined')? '':use_of_calf.replace('','0');
    other_calf_deformities = (typeof other_calf_deformities === 'undefined')? '':other_calf_deformities;
    lactation_number = (typeof lactation_number === 'undefined')? '':lactation_number;
    ease_of_calving_other = (typeof ease_of_calving_other === 'undefined')? '':ease_of_calving_other;
    ease_of_calving = (typeof ease_of_calving === 'undefined')? '':ease_of_calving.replace('','0');;
    calving_type_other = (typeof calving_type_other === 'undefined')? '0':calving_type_other;
    types_calving = (typeof types_calving === 'undefined')? '0':types_calving.replace('','0');
    calving_status = (typeof calving_status === 'undefined')? '0':calving_status.replace('','0');
    calving_method = (typeof calving_method === 'undefined')? '0':calving_method.replace('','0');
    calving_date = (typeof calving_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):calving_date; 
    calving_birth_type = (typeof calving_birth_type === 'undefined')? '0':calving_birth_type.replace('','0');
    calf_tag_id = (typeof calf_tag_id === 'undefined')? '0':calf_tag_id;
    calf_gender = (typeof calf_gender === 'undefined')? '0':calf_gender.replace('','0');
    calf_name = (typeof calf_name === 'undefined')? '0':calf_name;
    calf_body_condition_score = (typeof calf_body_condition_score === 'undefined')? '0':calf_body_condition_score.replace('','0');
    calf_color = (typeof calf_color === 'undefined')? '0':calf_color.replace('','0');
    calf_deformities = (typeof calf_deformities === 'undefined')? '0':calf_deformities.replace('','0');
    calf_heart_girth = (typeof calf_heart_girth === 'undefined')? '0':calf_heart_girth.replace('','0');
  

  const body = {
    "animal_id": animal_id,
    "calving_date": calving_date,
    "birth_type": calving_birth_type,
    "body_condition_score" : calf_body_condition_score,
    "calf_color": calf_color,
    "calf_deformities": calf_deformities,
    "other_calf_deformities": other_calf_deformities,
    "heart_girth": calf_heart_girth,
    "calf_name": calf_name,
    "calf_sex":calf_gender,
    "calf_weight": Calf_weight,
    "ease_of_calving_other": ease_of_calving_other,
    "calving_method": calving_method,
    "calving_type_other":calving_type_other,
    "calving_type":types_calving,
    "ease_of_calving":ease_of_calving,
    "calving_status":calving_status,
    "use_of_calf":use_of_calf,
    "use_of_calf_other":use_of_calf_other,
    "calf_tag_id":calf_tag_id,
    "lactation_number":lactation_number,
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


export const updateCalving =  function (config,event_id,values,user_id) {    
  let { 
     Calf_weight,calf_body_condition_score,calf_color,calf_deformities,
     calf_heart_girth,calf_name,calf_tag_id,calving_birth_type,
     calving_status,calving_type_other,calving_date,calving_method,
     ease_of_calving,ease_of_calving_other,field_agent_id,lactation_number,
     other_calf_deformities,use_of_calf,use_of_calf_other,calf_gender,types_calving
    } = values;

    
    Calf_weight = (typeof Calf_weight === 'undefined')? '0':Calf_weight.replace('','0');  
    use_of_calf_other = (typeof use_of_calf_other === 'undefined')? '0':use_of_calf_other;
    field_agent_id = (typeof field_agent_id === 'undefined')? '0':field_agent_id.replace('','0');
    use_of_calf = (typeof use_of_calf === 'undefined')? '':use_of_calf.replace('','0');
    other_calf_deformities = (typeof other_calf_deformities === 'undefined')? '':other_calf_deformities;
    lactation_number = (typeof lactation_number === 'undefined')? '':lactation_number;
    ease_of_calving_other = (typeof ease_of_calving_other === 'undefined')? '':ease_of_calving_other;
    ease_of_calving = (typeof ease_of_calving === 'undefined')? '':ease_of_calving.replace('','0');;
    calving_type_other = (typeof calving_type_other === 'undefined')? '0':calving_type_other;
    types_calving = (typeof types_calving === 'undefined')? '0':types_calving.replace('','0');
    calving_status = (typeof calving_status === 'undefined')? '0':calving_status.replace('','0');
    calving_method = (typeof calving_method === 'undefined')? '0':calving_method.replace('','0');
    calving_date = (typeof calving_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):calving_date; 
    calving_birth_type = (typeof calving_birth_type === 'undefined')? '0':calving_birth_type.replace('','0');
    calf_tag_id = (typeof calf_tag_id === 'undefined')? '0':calf_tag_id;
    calf_gender = (typeof calf_gender === 'undefined')? '0':calf_gender.replace('','0');
    calf_name = (typeof calf_name === 'undefined')? '0':calf_name;
    calf_body_condition_score = (typeof calf_body_condition_score === 'undefined')? '0':calf_body_condition_score.replace('','0');
    calf_color = (typeof calf_color === 'undefined')? '0':calf_color.replace('','0');
    calf_deformities = (typeof calf_deformities === 'undefined')? '0':calf_deformities.replace('','0');
    calf_heart_girth = (typeof calf_heart_girth === 'undefined')? '0':calf_heart_girth.replace('','0');
  

  const body = {    
    "calving_date": calving_date,
    "birth_type": calving_birth_type,
    "body_condition_score" : calf_body_condition_score,
    "calf_color": calf_color,
    "calf_deformities": calf_deformities,
    "other_calf_deformities": other_calf_deformities,
    "heart_girth": calf_heart_girth,
    "calf_name": calf_name,
    "calf_sex":calf_gender,
    "calf_weight": Calf_weight,
    "ease_of_calving_other": ease_of_calving_other,
    "calving_method": calving_method,
    "calving_type_other":calving_type_other,
    "calving_type":types_calving,
    "ease_of_calving":ease_of_calving,
    "calving_status":calving_status,
    "use_of_calf":use_of_calf,
    "use_of_calf_other":use_of_calf_other,
    "calf_tag_id":calf_tag_id,
    "lactation_number":lactation_number,
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


// get Milking events 
export const getMilking =  function (config,id) {   
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
 
    milk_urea = quality_toggle ? (typeof milk_urea === 'undefined')? '0':milk_urea.replace('','0') : null; 
    milk_protein = quality_toggle ? (typeof milk_protein === 'undefined')? '0':milk_protein.replace('','0') : null; 
    milk_butter_fat = quality_toggle ? (typeof milk_butter_fat === 'undefined')? '0':milk_butter_fat.replace('','0') : null;   
    milk_Weight = quality_toggle ? (typeof milk_Weight === 'undefined')? '0':milk_Weight.replace('','0') : null;
    milk_somatic_cell_count =  quality_toggle ? (typeof milk_somatic_cell_count === 'undefined')? '0':milk_somatic_cell_count.replace('','0') : null;  
    milk_sample_type =  quality_toggle ?(typeof milk_sample_type === 'undefined')? '0':milk_sample_type.replace('','0') : null;
    milk_lactose = quality_toggle ? (typeof milk_lactose === 'undefined')? '0':milk_lactose.replace('','0') : null;  

    milking_notes = (typeof milking_notes === 'undefined')? '':milking_notes;        
    field_agent_id = (typeof field_agent_id === 'undefined')? '0':field_agent_id.replace('','0');       
    milk_pm_litres = (typeof milk_pm_litres === 'undefined')? '0':milk_pm_litres.replace('','0');     
    milk_date = (typeof milk_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):milk_date;
    milk_mid_day = (typeof milk_mid_day === 'undefined')? '0':milk_mid_day.replace('','0');
    milk_am_litres = (typeof milk_am_litres === 'undefined')? '0':milk_am_litres.replace('','0'); 
    

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
 
    milk_urea = (typeof milk_urea === 'undefined')? '0':milk_urea.replace('',null); 
    milking_notes = (typeof milking_notes === 'undefined')? '':milking_notes; 
    testday_no = (typeof testday_no === 'undefined')? '0':testday_no.replace('','0');
    lactation_id = (typeof lactation_id === 'undefined')? '':lactation_id; 
    milk_somatic_cell_count = (typeof milk_somatic_cell_count === 'undefined')? '0':milk_somatic_cell_count.replace('',null);  
    milk_sample_type = (typeof milk_sample_type === 'undefined')? '0':milk_sample_type.replace('','0');
    field_agent_id = (typeof field_agent_id === 'undefined')? '0':field_agent_id.replace('','0');       
    milk_pm_litres = (typeof milk_pm_litres === 'undefined')? '0':milk_pm_litres.replace('','0');  
    milk_lactose = (typeof milk_lactose === 'undefined')? '0':milk_lactose.replace('',null);    
    milk_date = (typeof milk_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):milk_date; 
    milk_butter_fat = (typeof milk_butter_fat === 'undefined')? '0':milk_butter_fat.replace('',null);   
    milk_Weight = (typeof milk_Weight === 'undefined')? '0':milk_Weight.replace('',null);
    lactation_number = (typeof lactation_number === 'undefined')? '0':lactation_number;
    days_in_milk = (typeof days_in_milk === 'undefined')? '0':days_in_milk.replace('','0'); 
    milk_protein = (typeof milk_protein === 'undefined')? null:milk_protein.replace('',null);
    milk_mid_day = (typeof milk_mid_day === 'undefined')? '0':milk_mid_day.replace('','0');
    milk_am_litres = (typeof milk_am_litres === 'undefined')? '0':milk_am_litres.replace('','0');     

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
export const postAnimalRegistration =  function (config,org_id,values,user_id) { 
     
    const farm_id = null;
    let {
      herd_id,main_breed_other,animal_name,animal_type,
      breed_composition,breed_composition_details,color,
      color_other,country_of_origin,deformaties,
      dob,entry_date,entry_type,hair_sample_id,herd_book_number,
      main_breed,notes,purchase_cost,registration_date, 
      secondary_breed, secondary_breed_other,sex,sire_id,dam_id,
      sire_type,tag_prefix,tag_sequence,tag_id
    } = values;

    herd_id = (typeof herd_id === 'undefined')? null:herd_id.replace(' ',null);
    main_breed_other =  (typeof main_breed_other === 'undefined')?'':main_breed_other;
    animal_name =  (typeof animal_name === 'undefined')? '':animal_name; 
    animal_type =  (typeof animal_type === 'undefined')? null:animal_type.replace(' ',null); 
    breed_composition =  (typeof breed_composition === 'undefined')? null:breed_composition.replace(' ',null); 
    breed_composition_details =  (typeof breed_composition_details === 'undefined')? '':breed_composition_details; 
    color =  (typeof color === 'undefined')? null:color.replace(' ',null);
    color_other =  (typeof color_other === 'undefined')? '':color_other;
    country_of_origin =  (typeof country_of_origin === 'undefined')? '':country_of_origin;    
    deformaties =  (typeof deformaties === 'undefined')? null:deformaties.replace(' ',null); 
    dob =  (typeof dob === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):dob;
    entry_date =  (typeof entry_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):entry_date; 
    entry_type =  (typeof entry_type === 'undefined')? null:entry_type.replace(' ',null);
    hair_sample_id =  (typeof hair_sample_id === 'undefined')? null:hair_sample_id.replace(' ',null);
    herd_book_number =  (typeof herd_book_number === 'undefined')? '':herd_book_number;  
    main_breed =  (typeof main_breed === 'undefined')? null:main_breed.replace(' ',null);
    main_breed_other =  (typeof main_breed_other === 'undefined')? '':main_breed_other;    
    notes =  (typeof notes === 'undefined')? '':notes;
    purchase_cost =  (typeof purchase_cost === 'undefined')? '0':purchase_cost.replace(' ','0');
    registration_date =  (typeof registration_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):registration_date;
    secondary_breed =  (typeof secondary_breed === 'undefined')? null:secondary_breed.replace(' ',null);
    secondary_breed_other =  (typeof secondary_breed_other === 'undefined')? ' ':secondary_breed_other;
    sex =  (typeof sex === 'undefined')? null:sex.replace(' ',null);
    sire_id =  (typeof sire_id === 'undefined')? null:sire_id.replace(' ',null);
    dam_id =  (typeof dam_id === 'undefined')? null:dam_id.replace(' ',null);
    sire_type =  (typeof sire_type === 'undefined')? null:sire_type.replace(' ',null);
    tag_id =  (typeof tag_id === 'undefined')? '':tag_id;
    tag_prefix =  (typeof tag_prefix === 'undefined')? '':tag_prefix;
    tag_sequence =  (typeof tag_sequence === 'undefined')? '':tag_sequence;

    
    const body = {
      "created_by": user_id,
      "animal_type": animal_type,
      "birthdate": dob,
      "name": animal_name ,
      "breed_composition": breed_composition ,
      "hair_sample_id": hair_sample_id ,
      "main_breed": main_breed ,
      "reg_date": registration_date ,
      "sex" :sex,
      "tag_id" : tag_id,
      "breed_combination" :"",
      "notes" : notes,
      "tag_prefix" :tag_prefix,
      "tag_sequence" :tag_sequence,
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
      "sire_id" :sire_id,
      "dam_id" :dam_id,
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
export const putAnimalDetails =  function (config,org_id,values,user_id,animal_id) { 
     
  const farm_id = null;
  let {
    herd_id,main_breed_other,animal_name,animal_type,
    breed_composition,breed_composition_details,color,
    color_other,country_of_origin,deformaties,
    dob,entry_date,entry_type,hair_sample_id,herd_book_number,
    main_breed,notes,purchase_cost,registration_date, 
    secondary_breed, secondary_breed_other,sex,sire_id,dam_id,
    sire_type,tag_prefix,tag_sequence,tag_id
  } = values;

  

  herd_id = (typeof herd_id === 'undefined')? null:parseInt(herd_id);
  main_breed_other =  (typeof main_breed_other === 'undefined')?'':main_breed_other;
  animal_name =  (typeof animal_name === 'undefined')? '':animal_name; 
  animal_type =  (typeof animal_type === 'undefined')? null:parseInt(animal_type); 
  breed_composition =  (typeof breed_composition === 'undefined')? null:parseInt(breed_composition); 
  breed_composition_details =  (typeof breed_composition_details === 'undefined')? '':breed_composition_details; 
  color =  (typeof color === 'undefined')? null:parseInt(color);
  color_other =  (typeof color_other === 'undefined')? '':color_other;
  country_of_origin =  (typeof country_of_origin === 'undefined')? '':country_of_origin;    
  deformaties =  (typeof deformaties === 'undefined')? null:parseInt(deformaties); 
  dob =  (typeof dob === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):dob;
  entry_date =  (typeof entry_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):entry_date; 
  entry_type =  (typeof entry_type === 'undefined')? null:parseInt(entry_type);
  hair_sample_id =  (typeof hair_sample_id === 'undefined')? null:hair_sample_id;
  herd_book_number =  (typeof herd_book_number === 'undefined')? '':herd_book_number;  
  main_breed =  (typeof main_breed === 'undefined')? null:parseInt(main_breed);
  main_breed_other =  (typeof main_breed_other === 'undefined')? '':main_breed_other;    
  notes =  (typeof notes === 'undefined')? '':notes;
  purchase_cost =  (typeof purchase_cost === 'undefined')? '0':parseFloat(purchase_cost);
  registration_date =  (typeof registration_date === 'undefined')? moment(new Date()).format('YYYY-MM-DD'):registration_date;
  secondary_breed =  (typeof secondary_breed === 'undefined')? null:parseInt(secondary_breed);
  secondary_breed_other =  (typeof secondary_breed_other === 'undefined')? ' ':secondary_breed_other;
  sex =  (typeof sex === 'undefined')? null:parseInt(sex);
  sire_id =  (typeof sire_id === 'undefined')? null:sire_id;
  dam_id =  (typeof dam_id === 'undefined')? null:dam_id;
  sire_type =  (typeof sire_type === 'undefined')? null:parseInt(sire_type);
  tag_id =  (typeof tag_id === 'undefined')? '':tag_id;
  tag_prefix =  (typeof tag_prefix === 'undefined')? '':tag_prefix;
  tag_sequence =  (typeof tag_sequence === 'undefined')? '':tag_sequence;

  
  const body = { 
    "updated_by": user_id,      
    "animal_type": animal_type,
    "birthdate": dob,
    "name": animal_name ,
    "breed_composition": breed_composition ,
    "hair_sample_id": hair_sample_id ,
    "main_breed": main_breed ,
    "reg_date": registration_date ,
    "sex" :sex,
    "tag_id" : tag_id,
    "breed_combination" :"",
    "notes" : notes,
    "tag_prefix" :tag_prefix,
    "tag_sequence" :tag_sequence,
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
    "sire_id" :sire_id,
    "dam_id" :dam_id,
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
  category = (typeof category === 'undefined')? '': category;
  description =  (typeof description === 'undefined')?'':description;
  is_active =  (typeof is_active === 'undefined')? 0:is_active; 
  max_value =  (typeof max_value === 'undefined')? null:parseFloat(max_value); 
  min_value =  (typeof min_value === 'undefined')? null:parseFloat(min_value); 
 
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
  category = (typeof category === 'undefined')? '': category;
  description =  (typeof description === 'undefined')?'':description;
  is_active =  (typeof is_active === 'undefined')? 0:is_active; 
  max_value =  (typeof max_value === 'undefined')? null:parseFloat(max_value); 
  min_value =  (typeof min_value === 'undefined')? null:parseFloat(min_value); 
 
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
  name = (typeof name === 'undefined')? '': name;
  description =  (typeof description === 'undefined')?'':description;
  is_active =  (typeof is_active === 'undefined')? 0:is_active; 
  key =  (typeof key === 'undefined')? '':key;  
  value =  (typeof value === 'undefined')? '':value; 
 
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
  description =  (typeof description === 'undefined')?'':description;
  is_active =  (typeof is_active === 'undefined')? 0:is_active; 
  key =  (typeof key === 'undefined')? '':key; 
  value =  (typeof value === 'undefined')? '':value; 
 
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


//Batch upload - miking
export const postBatchUploadMilking =  function (config,rows,cols,user_id,org_id,uuid) {  
 
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

  console.log(options);

return new Promise((resolve, reject) => {
  axios(options)
  .then(res => {           
      resolve(res.data);
  })
  .catch(err =>    
    reject(err));
});       
}


// view milking batched on validation queue
export const getBatchMilkingValidation =  function (config,uuid) {   
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



// view milking batched on un-processed validation queue
export const getBatchMilkingUnprocessed =  function (config,org_id,step,user_id) {   
  const options = {
    url:`${config.url}${org_id}/${step}/${user_id}`,
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
export const getBatchMilkingTemplate =  function (config,org_id) {   
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
};


// view milking discarded batches
export const getBatchMilkingDiscarded =  function (config,org_id,user_id) {   
  const options = {
    url:`${config.url}${org_id}/${user_id}`,
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
export const getBatchMilkingPosted =  function (config,org_id,user_id) {   
  const options = {
    url:`${config.url}${org_id}/${user_id}`,
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
export const batchProcessMilkingActions =  function (config,uuid,action,user_id) { 
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

  console.log(options);

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
export const getBatchMilkValidationErrors =   function (config,id) {   
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
// 1. ORGANIZATION

export const getUserList =  function (config) {   
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

//access
export const getOrgAccess =  function (config,user) {   
  const options = {
    url:`${config.url}${user}`,
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
export const getTopCows =  function (config,organisation_id,start_date,end_date) {   
  const options = {
    url:`${config.url}${organisation_id}/${start_date}/${end_date}`,
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

export const getStatsBreedsDistribution =  function (config,organisation_id) {   
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










































