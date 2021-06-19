import React, { Component } from 'react';
var EmojiPicker = require('react-emoji-picker');

// styles for the emoji picker wrapper
var emojiPickerStyles = {
  position: 'absolute',
  left: '68%',
  bottom: '10%',
  backgroundColor: 'white',
  width: '20%',
  padding: '.3em .6em',
  border: '1px solid #0074d9',
  borderTop: 'none',
  zIndex: '2'
};

const emojiBtn= {
  width:'2rem',
  height:'2rem',
}

export default class EmojiButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
    	showEmojiPicker:false,
    }
    this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this);
    this.emojiPicker = this.emojiPicker.bind(this);
  }
  componentDidMount() {
    document.addEventListener('click', this.toggleEmojiPicker, false)
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.toggleEmojiPicker, false)
  }
  toggleEmojiPicker(e) {
  	// check if clicked element is a child of the node referenced by this.emoji
  	// clicking anywhere other than the ref dom sets state to false
    if (this.emoji.contains(e.target)) {
      this.setState({ showEmojiPicker: true });
    } else {
      this.setState({ showEmojiPicker: false });
    }
  }
  // pass selected emoji up to parent Inputs component to add it to its state.message
  emojiPicker() {
    if (this.state.showEmojiPicker) {
      return (
        <EmojiPicker
          style={emojiPickerStyles} onSelect={this.props.onAddEmoji}
        />
      )
    }
  }
  render() {
    return (
      <div ref={(dom) => {
      	  this.emoji = dom;
      	}} style={{display:'inline-block',}}>
	        <img style={emojiBtn} title="Add Emoji" alt="Add Emoji" src={require('../assets/happy.svg')}/>
	        {this.emojiPicker()}
       </div>
    );
  }
}
