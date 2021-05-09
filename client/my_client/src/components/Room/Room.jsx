import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Container, Row, Col, Card, Form, Button, InputGroup, FormControl } from "react-bootstrap";
import { io } from "socket.io-client";

import Sidebar from './Sidebar.jsx';
import Rooms from './Rooms.jsx';
import Members from './Members.jsx';

import { getRooms, getMembers, getMessages, promoteUser } from '../../services/RoomService.jsx';

import './Room.css';

const USER = "20Cents";

let socket = io.connect("http://127.0.0.1:8080", {query: "username=" + USER});

export default class Room extends React.Component {
 
  constructor(props) {
    super(props);
    this.messageList = React.createRef();
    this.state = {
      roomId: props.match.params.roomId ?? null,
      rooms: {},
      members: {},
      messages: {},
      message: ""
    };
  }

  async componentDidMount() {
    const res = await getRooms();
    if ("rooms" in res)
      this.setState({rooms: res.rooms});
    if (this.state.roomId) {
      const res2 = await getMembers(this.state.roomId);
      if ("owner" in res2 && "members" in res2)
        this.setState({members: res2});
      
      const res3 = await getMessages(this.state.roomId);
      console.log(res3.messages);
      if ("messages" in res3)
        this.setState({messages: res3.messages});

      socket.emit('join room', this.state.roomId);

      socket.on('chat', (message) => {
        this.setState({messages: {...this.state.messages, [Object.keys(this.state.messages).length]: message}});
        this.scrollToBottom();
      });

      socket.on("promote user", (members) => {
        if (members) {
          this.setState({members: members});
        }
      });

      // socket.on("seenBy", (messages) => {
      //   console.log(messages);

      //   let key = Object.keys(this.state.messages).find((key) => this.state.messages[key]._id === messages.messageUpdate._id);
      //   if (messages.messageUpdate) {
      //     const copyMessage = this.state.messages[key];
      //     copyMessage.seenBy = messages.messageUpdate.seenBy;
      //     this.setState({messages: {...this.state.messages, [key]: copyMessage}});
      //   }
      //   if (messages.lastMessage) {
      //     const copyLastMessage = this.state.messages[Object.keys(this.state.messages).length - 1];
      //     copyLastMessage.seenBy = messages.lastMessage.seenBy;
      //     this.setState({messages: {...this.state.messages, [Object.keys(this.state.messages).length - 1]: copyLastMessage}});
      //   }
      // });

      socket.on('user connection', (user) => {
        console.log("user connection");
        const membersKey = Object.keys(this.state.members.members).find(key => this.state.members.members[key].username === user.username);

        if (membersKey) {
          let copy = JSON.parse(JSON.stringify(this.state.members));
          copy.members[membersKey].status = true;
          this.setState({members: copy});
        }
        if (this.state.members.owner.username === user.username) {
          let copy = JSON.parse(JSON.stringify(this.state.members));
          copy.owner.status = true;
          this.setState({members: copy});
        }
      });
      socket.on('user disconnection', (user) => {
        console.log("user disconnection");
        const membersKey = Object.keys(this.state.members.members).find(key => this.state.members.members[key].username === user.username);

        if (membersKey) {
          let copy = JSON.parse(JSON.stringify(this.state.members));
          copy.members[membersKey].status = false;
          this.setState({members: copy});
        }
        if (this.state.members.owner.username === user.username) {
          let copy = JSON.parse(JSON.stringify(this.state.members));
          copy.owner.status = false;
          this.setState({members: copy});
        }
      });
      // this.setLastMessageRead();
    }
  }

  sendMessage = (event) => {
    event.preventDefault();
    if (this.state.message) {
      console.log("send message");
      socket.emit('chat', this.state.roomId, USER, this.state.message);
      this.setState({message: ""});
    }
  }

  scrollToBottom = () => {
    this.messageList.current.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
  }

  promoteUserToOwner = async (event, usernameToPromote) => {
    event.preventDefault();
    if (usernameToPromote) {
      const res = await promoteUser(this.state.roomId, usernameToPromote);
      if (res) {
          socket.emit('promote user',this.state.roomId);
      }
    }
  }

  setLastMessageRead = () => {
    socket.emit("seenBy", this.state.roomId, USER);
  }

  render() {
    const { roomId, rooms, members, messages } = this.state;

    return (
      <>
        { roomId ? (
          <Container fluid>
            <Row>
                <Col xs={2} id="sidebar-wrapper">      
                  <Rooms rooms={rooms} />
                </Col>
                <Col xs={8} id="page-content-wrapper" ref={this.messageList}>
                  {
                    Object.keys(messages).map(key => {
                      return (
                      <p key={messages[key]._id}><b>{messages[key].sender.username}</b> --- {new Date(messages[key].createdAt).toLocaleDateString()}<br/>{messages[key].content}<br/></p>
                      );
                    })
                  }
                </Col>
                <Col xs={2} id="sidebar-wrapper">
                  <Members roomId={roomId} members={members} promoteUserToOwner={this.promoteUserToOwner} />     
                </Col>
            </Row>
            <Row>
              <Col xs={12} id="input-message">
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Send a message..."
                    value={this.state.message}
                    onChange={(event) => this.setState({message: event.target.value})}
                  />
                  <InputGroup.Append>
                    <Button variant="outline-secondary" onClick={(event) => this.sendMessage(event)}>Send</Button>
                  </InputGroup.Append>
                </InputGroup>
              </Col>
            </Row>
          </Container>
        ) : (
          <Container fluid>
              <Row>
                  <Col xs={2} id="sidebar-wrapper">      
                    <Rooms rooms={rooms} />
                  </Col>
                  <Col  xs={10} id="page-content-wrapper"></Col>
              </Row>
          </Container>
        )
        }
      </>
    );
  }
}