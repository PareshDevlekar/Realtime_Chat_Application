
function rooms(state = [], action) {
  switch (action.type) {

    case 'POST_MESSAGE':
      let msg = {room:action.room, user:action.user, message:action.message};
      // add new message to state
      let newState = state.map((data) => {
        // find room the message goes to and add it to that room's messages array
        if(data.room === msg.room){
          data.messages.push({user: msg.user, message: msg.message, _id:String(Date.now()+Math.floor(Math.random()))})
          return data;
        }
        else{
          return data;
        }
      })
      return  newState;

    case 'GET_MESSAGE':
      return [...state, ...action.arr]

    case 'ADD_USER':
      let newState2 = state.map((data) => {
        // add user to users array of matching room
        if(data.room === action.room){
          data.users.push({user:action.user, _id:action._id});
          return data;
        }
        else{
          return data;
        }
      })
      return newState2;

    case 'REMOVE_USER':
      // find index of room
      let roomIndex = state.findIndex((room) => {
        return room.room === action.room
      })
      // find index of matching id in users array
      let userIndex = state[roomIndex].users.findIndex((user) => {
        return user._id === action._id
      })
      let newState3 = state.map((room) => {
        if(room.room === action.room){
          room.users.splice(userIndex, 1)
        }
        return room
      })
      return newState3;

    case 'CREATE_ROOM':
      // add new room to collection of rooms
      let newRoom = {
        "room": action.roomName,
        "messages": [],
        users: [],
        _id:action._id
      }
      return [...state, newRoom];

    default:
    	return state;  
  }
}

export default rooms;