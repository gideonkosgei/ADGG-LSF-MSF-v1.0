export const api = process.env.REACT_APP_API_URL;
const  token = process.env.REACT_APP_API_TOKEN; 

export const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': token
  };
  export const headers_files = {
    'Accept': 'multipart/form-data',
    'Authorization': token
};