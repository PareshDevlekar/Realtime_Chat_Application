import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'; // connect props and actions to top component
import * as actionCreators from '../actions/actionCreators';
import React, { Component } from 'react';
//components
import Welcome from './Welcome';
import MainContainer from './containers/MainContainer';
// soc
import io from 'socket.io-client';
var socket = io();

export class App extends Component {

	render() {
		return (
			<div>
				{this.props.user.user ? <MainContainer socket={socket}/> : <Welcome socket={socket}/> }
			</div>
		)
	}
}

function mapStateToProps(state){
	return{
		user:state.user
	}
}
function mapDispatchToProps(dispatch){
  return bindActionCreators(actionCreators,dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App)