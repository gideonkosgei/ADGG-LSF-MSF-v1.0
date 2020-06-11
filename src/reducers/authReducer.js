
export const initialAuthState = {	
	isLoggedIn: localStorage.getItem('isLoggedIn')?localStorage.getItem('isLoggedIn'):false,
	isLoading:localStorage.getItem('isLoading')?localStorage.getItem('isLoading'):false,
	user_id: localStorage.getItem('user_id')?localStorage.getItem('user_id'):0,
	username: localStorage.getItem('username')?localStorage.getItem('username'):'',
	name: localStorage.getItem('name')?localStorage.getItem('name'):'',
	email:localStorage.getItem('email')?localStorage.getItem('email'):'',
	phone:localStorage.getItem('phone')?localStorage.getItem('phone'):'',
	country_id:localStorage.getItem('country_id')?localStorage.getItem('country_id'):'',
	status:localStorage.getItem('status')?localStorage.getItem('status'):'',
	timezone:localStorage.getItem('timezone')?localStorage.getItem('timezone'):'',
	role:localStorage.getItem('role')?localStorage.getItem('role'):'',  
	error: localStorage.getItem('error')?localStorage.getItem('error'):''
	
};
export const authReducer = (state, action) => {	
	switch (action.type) {
		case 'LOGIN':
				const data = action.payload.userData.payload[0][0];	
				localStorage.setItem("user_id",data.id);
				localStorage.setItem("isLoggedIn",true);
				localStorage.setItem("isLoading",true);
				localStorage.setItem("username", data.username);
				localStorage.setItem("name", data.name);
				localStorage.setItem("email",data.email);
				localStorage.setItem("phone", data.phone);
				localStorage.setItem("role", data.role);
				localStorage.setItem("country_id",data.country_id)
			return {
				user_id:data.id,
				isLoggedIn: true,
				isLoading:true,
				username: data.username,
				name:data.name,
				email:data.email,
				phone:data.phone,
				status:data.status,
				timezone:data.timezone, 
				country_id:data.country_id,
				role:data.role,  				
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
				phone:'',
				status:'',
				timezone:'', 
				country_id:'', 
				role:'', 
				error: action.payload.error
			};
		case 'LOGOUT':
			localStorage.clear();
			return {
				isLoggedIn: false,
				user_id:0,
				username: '',				
				name:'',
				email:'',
				phone:'',
				status:'',
				timezone:'', 
				country_id:'', 
				role:'', 
				error: ''
			};
		default:
			return state;
	}
};