export const api = `http://localhost:8080/api/v1.0`;
//export const api = "https://18.118.109.57/api/v1.0";
const  token = "Basic amFjazpzZWNyZXQ="; 
export const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': token
  };
  export const headers_files = {
    'Accept': 'multipart/form-data',
    'Authorization': token
};