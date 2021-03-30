export const initialState = {	
	id: sessionStorage.getItem('sire_id')? sessionStorage.getItem('sire_id'):null,
	tag_id:sessionStorage.getItem('sire_id')? sessionStorage.getItem('sire_tag_id'):null,
	name:sessionStorage.getItem('sire_name')? sessionStorage.getItem('sire_name'):null
};

export const sireReducer = (state, action) => {	
	switch (action.type) {
		case 'SET':
				const data = action.payload.userData.payload[0][0];					
				sessionStorage.setItem("sire_id",data.id);
				sessionStorage.setItem("sire_id",data.id);
				sessionStorage.setItem("sire_name",data.id);
			
			return {
				id:data.id,
				tag_id: data.id,
				name:data.id
				
			};
		case 'CLEAR':
			
			return {
				id: null,
				tag_id:null,
				name: null
			};
		default:
			return state;
	}
};