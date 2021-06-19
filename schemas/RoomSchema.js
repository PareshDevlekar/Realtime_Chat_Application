/*
	Order of defining schemas matters!! need to required schemas first
	ex: RoomSchema before MessageSchema will return an error
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new mongoose.Schema({
  user:String,
  message:String
})

const UsersSchema = new mongoose.Schema({
	user:String,
	_id:String
})

const RoomSchema = new mongoose.Schema({
	room:String,
	messages: [MessageSchema],
	users:[UsersSchema],
	_id:String
})

export default mongoose.model('Room', RoomSchema)
