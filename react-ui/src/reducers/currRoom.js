// set default room as 'general'
export default function currRoom(state='General', action){
	switch (action.type){
		
		case 'CURR_ROOM':
			let newState = [...state];
			newState = action.room
			return newState;

		default:
			return state;
	}
}