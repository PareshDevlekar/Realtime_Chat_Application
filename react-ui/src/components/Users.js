import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
// import * as actionCreators from '../../actions/actionCreators';
//css
import {userContainer, title, users, text} from '../css/users';

var li = {
	'list-style-type':'none',
	padding:'10px',
	background:'#eee',
	'border-bottom':'1px solid black',
}

export default class Users extends Component {
	render() {
		let { socket } = this.props;
		console.log(socket.id);
		return (
			<div class="users-container" style={userContainer}>
		        <h3 class="user-title" style={title}>Users</h3>
		        <ul id="participants" style={users}>
		        	{this.props.users.map((user) => {
		        	  return <li style={text} key={user._id}> {user.user}{user._id === socket.id ? '(you)' : ''} </li>
		        	})}
		        </ul>
		    </div>	
		);
	}
}
