
export const initialAuthState = {	
	isLoggedIn: sessionStorage.getItem('isLoggedIn')?sessionStorage.getItem('isLoggedIn'):false,
	isLoading:sessionStorage.getItem('isLoading')?sessionStorage.getItem('isLoading'):false,
	user_id: sessionStorage.getItem('user_id')?sessionStorage.getItem('user_id'):0,
	username: sessionStorage.getItem('username')?sessionStorage.getItem('username'):'',
	name: sessionStorage.getItem('name')?sessionStorage.getItem('name'):'',
	email:sessionStorage.getItem('email')?sessionStorage.getItem('email'):'',	
	status:sessionStorage.getItem('status')?sessionStorage.getItem('status'):'',
	role:sessionStorage.getItem('role')?sessionStorage.getItem('role'):'',  
	error: sessionStorage.getItem('error')?sessionStorage.getItem('error'):'',
	organization_id: sessionStorage.getItem('organization_id')?sessionStorage.getItem('organization_id'):'',
	organization: sessionStorage.getItem('organization')?sessionStorage.getItem('organization'):'',
	password: sessionStorage.getItem('password') ? sessionStorage.getItem('password'):'',
	country_id: sessionStorage.getItem('country_id') ? sessionStorage.getItem('country_id'):''
	
};
export const authReducer = (state, action) => {	
	switch (action.type) {
		case 'LOGIN':
				const data = action.payload.userData.payload[0][0];					
				sessionStorage.setItem("user_id",data.id);
				sessionStorage.setItem("isLoggedIn",true);
				sessionStorage.setItem("isLoading",true);
				sessionStorage.setItem("username", data.username);
				sessionStorage.setItem("name", data.name);
				sessionStorage.setItem("email",data.email);			
				sessionStorage.setItem("role", data.role);
				sessionStorage.setItem("organization_id", data.org_id);
				sessionStorage.setItem("organization", data.organization);
				sessionStorage.setItem("password", data.password);
				sessionStorage.setItem("country_id", data.country_id);			
					
			return {
				user_id:data.id,
				isLoggedIn: true,
				isLoading:true,
				username: data.username,
				name:data.name,
				email:data.email,				
				status:data.status,
				role:data.role,  
				organization_id:data.org_id,  
				organization:data.organization,  	
				password:data.password, 
				country_id:data.country_id,							
				error: ''
			};
		case 'LOGIN_ERROR':
			return {
				isLoggedIn: false,
				user_id:0,
				isLoading:true,
				username: '',				
				name:'',
				email:'',				
				status:'',				
				role:'', 
				organization_id:'',
				country_id:'',
				organization:'',
				password:'',
				error: action.payload.error
			};
		case 'LOGOUT':
			sessionStorage.clear();
			return {
				isLoggedIn: false,
				user_id:0,
				username: '',				
				name:'',
				email:'',			
				status:'',				
				role:'', 
				organization_id:'',
				organization:'',
				password:'',
				error: '',
				country_id:''
			};
		default:
			return state;
	}
};