export default function user(state={}, action){
	switch (action.type){
		
		case 'NEW_USER':
			console.log('creating new user');
			let newState = (Object.assign({}, state));
			newState = action.user;
			return newState;

		default:
			return state;
	}
}