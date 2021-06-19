import axios from 'axios'

//*********************************************************
// updates state with new message in the specified room
export function postMessage(room,user,message){
	return{
		type:'POST_MESSAGE',
		room,
		user,
		message
	}
}
//*********************************************************

//*********************************************************
// Get data of all rooms from database, and dispatch to update state
// Init current user to state
export function getMessage(user){
	return (dispatch) => {
	  return axios.get(`/api`).then((res) => {
	  	console.log(res);
	    dispatch(getMessageDispatch(res.data)); // update state with data from server
	    dispatch(addUser('General', user.user, user._id)); // add user to 'general' room by default
	  })
	}
}

function getMessageDispatch(arr){
	return{
		type:'GET_MESSAGE',
		arr
	}
}
//*********************************************************

export function newUser(user){
	return{
		type:'NEW_USER',
		user
	}
}

//*********************************************************
// track current room client is in
export function updateCurrRoom(room){
	return {
		type:'CURR_ROOM',
		room
	}
}

//*********************************************************
// add user to appropiate room's users array
export function addUser(room, user, _id){
	return {
		type:'ADD_USER',
		room,
		user,
		_id
	}
}
//*********************************************************
// remove user from appropiate room's users array
export function removeUser(room, _id){
	return {
		type:'REMOVE_USER',
		room,
		_id
	}
}
//*********************************************************
// fetching status
export function fetchingSuccess(){
	return{
		type: 'FETCHING_SUCCESS'
	}
}
//*********************************************************
// add new room
export function createRoom(roomName, _id){
	return {
		type:'CREATE_ROOM',
		roomName, 
		_id
	}
}
