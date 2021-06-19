import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/actionCreators';
//components
import Messages from '../Messages';
import RoomContainer from './RoomContainer';
import Users from '../Users';

const mainContainer = {
  display:'flex',
  width:'100vw',
  height:'100vh',
}


class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.handleIncomingMessage = this.handleIncomingMessage.bind(this);
    this.handleRoomSubscribe = this.handleRoomSubscribe.bind(this);
    this.handleRoomUnsubscribe = this.handleRoomUnsubscribe.bind(this);
    this.handleUserDisconnect = this.handleUserDisconnect.bind(this);
    this.socket = this.props.socket;
  }

  componentDidMount() {
    this.handleRoomSubscribe()
    this.handleRoomUnsubscribe();
    this.handleUserDisconnect();
    this.handleIncomingMessage();
    this.props.getMessage({user:this.props.user.user, _id:this.props.user._id});
  }

  handleIncomingMessage() {
    this.socket.on('client msg', (msg) => {
      const { room, user, message } = msg;
      this.props.postMessage(room, user, message); // ONLY update state when receiving message
    })
  }

  handleRoomSubscribe(){
    this.socket.on('subscribe', (data) => {
      console.log(`adding user ${data.user} to ${data.room}`);
      this.props.addUser(data.room, data.user, data._id)
    })
    // add user to local state room's users array
    this.socket.emit('subscribe', {room:'General', user:this.props.user.user, _id:this.props.user._id})
  }

  handleUserDisconnect(){
    this.socket.on('user disconnect', (_id) => {
      console.log(`${_id} has disconnected`);
      /* messy hack to find room the disconnected user was in to update state and db, 
      since we can't pass data on disconnect socket evt */
      let matchedRoom = this.props.rooms.filter((room) => {
        return room.users.some((user) => {
          return user._id === _id;
        })
      })
      console.log(`disconnected user was in room ${matchedRoom[0].room}`);
      this.props.removeUser(matchedRoom[0].room , _id) // updates local state
      this.socket.emit('unsubscribe', { room:matchedRoom[0].room, _id }) //updates db
    })
  }

  handleRoomUnsubscribe(){
    this.socket.on('unsubscribe', (data) => {
      console.log(`removing user ${data._id} from ${data.room}`);
      this.props.removeUser(data.room, data._id)
    })
  }

  // room data passed depends on state of 'currRoom'
  render() {
    const { rooms, currRoom } = this.props;
    const matchedRoom = rooms.find((room) => {
      return room.room === currRoom;
    })
    if (!matchedRoom) {
      return (<p>Loading</p>)  // replace with loading icon
    }
    return (
      <div style={mainContainer}>
        <RoomContainer socket={this.socket}/>
        <Messages socket={this.socket} room={this.props.currRoom} messages={matchedRoom.messages}/>
        <Users socket={this.socket} users={matchedRoom.users}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    rooms: state.rooms,
    currRoom: state.currRoom,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer)
