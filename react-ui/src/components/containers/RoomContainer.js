import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/actionCreators';
//css
import { roomContainer, title, input } from '../../css/roomContainer';
//component
import Room from '../Room';

class RoomContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newRoomName: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    let { socket } = this.props;

    // listen for new rooms from other clients
    socket.on('new room', (data) => {
      console.log(`creating new room ${data.newRoomName}`);
      this.props.createRoom(data.newRoomName, data._id) // update own state
    })
  }

  handleChange(e) {
      this.setState({
        newRoomName: e.target.value
      })
    }
    // create new room locally
  handleSubmit(e) {
    let { socket } = this.props;

    e.preventDefault();
    // only creates new room if it does not exist
    if (this.props.rooms.every((room) => {
        return room.room !== this.state.newRoomName;
      })) {
      console.log('creating new room');
      let newRoomName = this.state.newRoomName;
      let _id = String(Date.now());
      this.props.createRoom(newRoomName, _id) // update own state
      socket.emit('new room', { newRoomName, _id }) // let other clients know of new room
      this.setState({
        newRoomName: ''
      })
    }
    else{
      alert('room already exists')
      console.log('room exists');
    }
  }

  render() {
    let { socket } = this.props;
    return (
      <div style={roomContainer}>
        <h2 style={title}>Rooms</h2>
        {this.props.rooms.map((rooms) => {
         return <Room socket={socket} roomName={rooms.room} key={rooms._id}/>
        })}
        <form onSubmit={this.handleSubmit}>
          <input style={input} required type="text" name="newRoomName" value={this.state.newRoomName} onChange={this.handleChange} placeholder="Add Room" />
        </form> 
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    rooms: state.rooms
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(RoomContainer)
