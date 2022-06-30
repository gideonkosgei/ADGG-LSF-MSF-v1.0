export const initialCountriesState = {
	countries: localStorage.getItem('countries_data') ? localStorage.getItem('countries_data') : JSON.stringify([]),
};

export const countriesReducer = (state, action) => {	
	switch (action.type) {		
		case 'COUNTRIES':
			const data = action.payload.data;
			localStorage.setItem("countries_data", JSON.stringify(data));
			return {
				countries: data
			};
		default:
			return state;
	}
	
};