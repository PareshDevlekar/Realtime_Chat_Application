export default function isFetching(state = true, action){
	switch (action.type){
		
		case 'GET_MESSAGE':
		console.log('fetching msg');
		return true;
		case 'FETCHING_SUCCESS':
		console.log('fetched msg');
			return false;
		default:
			return state;
	}
}