import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators';
//css
import { welcomeContainer, logoContainer, logo, input, caption } from '../css/welcome.js';
//comp

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.focus = this.focus.bind(this)
  }
  componentDidMount() {
    this.focus(); // set focus on input field
  }

  focus() {
    this.textInput.focus();
  }

  handleChange(e) {
    this.setState({
      name: e.target.value
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    let { socket } = this.props;
    this.props.newUser({ user: this.state.name, _id: socket.id });
  }

  render() {
    return (
      <div style={welcomeContainer}>
				<h1 style={{'display':'inline-block','border-bottom':'1px solid black'}}>Real-Time Chat Room</h1>
				<div style={logoContainer} className="logoContainer">
				<figure style={{'display':'inline-block'}}>
					<img style={logo} src={require('../assets/react.svg')} alt="react"/>
					<figcaption style={caption}> React + Redux </figcaption>
				</figure>
				<figure>
					<img style={logo} src={require('../assets/node.svg')} alt="node"/>
					<figcaption style={caption}> Node + Express </figcaption>
				</figure>
				<figure>
					<img style={logo} src={require('../assets/mongodb.svg')} alt="mongoDB"/>
					<figcaption style={caption}> MongoDb </figcaption>
				</figure>
				<figure>
					<img style={logo} src={require('../assets/socketio.svg')} alt="socket-io"/>
					<figcaption style={caption}> Socket.io </figcaption>
				</figure>
				</div>
				<form onSubmit={this.handleSubmit}>
					<input style={input} type="text" name="user" value={this.state.name} onChange={this.handleChange} placeholder="Enter Username" autoComplete="off"
					ref={(dom)=>{this.textInput = dom;}}/>
				</form>
			</div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Welcome)
