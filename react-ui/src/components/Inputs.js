import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/actionCreators';
import ReactEmoji from 'react-emoji';
import ContentEditable from 'react-contenteditable'
//components
import EmojiButton from './EmojiButton';
//css
import { inputContainer, form, input, btnContainer } from '../css/inputs';

class Inputs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    }
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCaret = this.handleCaret.bind(this);
    this.handleAddEmoji = this.handleAddEmoji.bind(this);
  }

  componentDidMount() {
    // focus on input field
    let input = document.getElementById('m');
    input.focus();
  }
  handleOnChange(e) {
      this.setState({ message: e.target.value }, ()=>{this.handleCaret()})
    }
    // emit message to sockets, and update own state
  handleSubmit(e) {
    let { socket } = this.props;
    e.preventDefault() // prevent page from refreshing
    const user = this.props.user.user;
    const message = this.state.message;
    const room = this.props.currRoom;
    socket.emit('client msg', { room, user, message })
    this.props.postMessage(room, user, message) // ONLY updates state of client that sent message
      // clear and return focus to input field
    this.setState({ message: '' });
    document.getElementById('m').focus();
  }
  // fixes weird interaction where caret positions to front of text after entering emoji (puts caret at end of line)
  handleCaret() {
    var el = document.getElementById('m');
    el.focus();
    if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (typeof document.body.createTextRange !== "undefined") {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
    }
  }
  // pass callback function to update state.message with clicked emoji
  handleAddEmoji(emoji){
    this.setState({message: this.state.message + emoji},()=>{this.handleCaret()})
  }

  render() {
    //converts emojis to an object
    // console.log(`parsing ${this.state.message}`);
    let message = ReactEmoji.emojify(this.state.message) || [''];
    // parse objects to convert emoji to <img> tag
    let parsed = message.map((el) => {
      if (typeof el === 'string') {
        return el;
      } else {

        return `<img src='${el.props.src}' title="aa" style='height:${el.props.height}; width:${el.props.width}'/>`
      }
    }).join('');
    
    // console.log(parsed);
    return (
      <div style={inputContainer}>
        <form style={form} onSubmit={this.handleSubmit}>
          {/* contenteditable enable users to enter in image tags for emojis */}
          <ContentEditable
            placeholder="Enter Message"
            html={parsed} // innerHTML of the editable div
            disabled={false} // use true to disable edition
            onChange={this.handleOnChange} // handle innerHTML change
            onKeyDown={(e) => {
              // submit on enter
              if(e.which === 13){
                e.preventDefault();
                this.handleSubmit(e);
              }
            }}
            style={input}
            id="m"
          />
        </form>
        <div style={btnContainer} className="btnContainer">
          <EmojiButton onAddEmoji={this.handleAddEmoji}/>
        </div>
        </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    rooms: state.rooms,
    currRoom: state.currRoom
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Inputs)
