import React, { Component } from 'react';
import ReactEmoji from 'react-emoji';
//components
import Inputs from './Inputs';
//css
import {mainContainer, messageContainer, chatTitle, messages } from '../css/message';

// working with room data that matches the room name
export default class Messages extends Component {

  render() {
    let { socket } = this.props;
    const { room } = this.props;
    return (
      <div style={mainContainer}>
        <div id="scroll" className="message-container" style={messageContainer}>
          <h1 style={chatTitle}>In Chat Room: <span id="room">{room}</span></h1>
          <ul id="messages" style={messages}>
            {this.props.messages.map((msg) => {
              let message = ReactEmoji.emojify(msg.message) || [''];
              // parse objects to convert emoji to <img> tag
              let parsed = message.map((el) => {
                if (typeof el === 'string') {
                  return el;
                } else {
                  return `<img src='${el.props.src}' style='height:${el.props.height}; width:${el.props.width}'/>`
                }
              }).join('');
              // annoying way to set innerhtml to remind users of accidental XSS script attacks
              return <li key={msg._id} dangerouslySetInnerHTML={{__html: `${msg.user} : ${parsed}`}}></li>
            })}
          </ul>
        </div>
        <Inputs socket={socket}/>
      </div>
    );
  }
}
