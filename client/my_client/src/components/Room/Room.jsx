import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Alert, Container, Row, Col, InputGroup, FormControl } from "react-bootstrap";
import { io } from "socket.io-client";

import Rooms from './Rooms.jsx';
import Members from './Members.jsx';

import { getRooms, removeMember, getMembers, getMessages, promoteUser, getUserData } from '../../services/RoomService.jsx';

import './Room.css';

let socket;

let connectUser;

export default class Room extends React.Component {
 
  constructor(props) {
    super(props);
    this.messageList = React.createRef();
    this.state = {
      roomId: props.match.params.roomId ?? null,
      rooms: {},
      oldRooms: {},
      members: {members: [this.username = ""], owner: {username: ""}},
      messages: {},
      message: "",
      success: "",
      error: "",
    };
  }

  componentWillUnmount() {
    if (socket && socket.connected)
      socket.close();
  }

  async componentDidMount() {
    if (!connectUser) {
      connectUser = await getUserData();
      if (!connectUser.email && !connectUser.username)
        throw new Error("Invalid user");
    }
    
    const res = await getRooms(connectUser.username);
    if ("rooms" in res)
      this.setState({rooms: res.rooms});
    if ("oldRooms" in res)
      this.setState({oldRooms: res.oldRooms})
    if (this.state.roomId) {
      const res2 = await getMembers(this.state.roomId);
      if ("owner" in res2 && "members" in res2)
        this.setState({members: res2});
      
      const res3 = await getMessages(this.state.roomId);
      console.log(res3.messages);
      if ("messages" in res3) {
        this.setState({messages: res3.messages});
        this.scrollToBottom("instant");
      }

      if (connectUser && this.state.members.members) {
        var tmpIndex = 0;
        Object.keys(this.state.members.members).map(key => (this.state.members.members[key].username === connectUser.username ? tmpIndex = 1 : tmpIndex = 0));
        if (tmpIndex === 1 || this.state.members.owner.username === connectUser.username) {
          if (!socket || !socket.connected)
            socket = io.connect("http://localhost:8080", {withCredentials: true, query: "username=" + connectUser.username});

          socket.emit('join room', this.state.roomId);

          this.setLastMessageRead();

          socket.on('chat', (message) => {
            this.setState({messages: {...this.state.messages, [Object.keys(this.state.messages).length]: message}});
            this.setLastMessageRead();
            this.scrollToBottom("smooth");
          });

          socket.on("promote user", (members) => {
            if (members) {
              this.setState({members: members});
            }
          });

          socket.on("seenBy", (messages) => {
            console.log(messages);

            if (messages.messageUpdate) {
              let key = Object.keys(this.state.messages).find((key) => this.state.messages[key]._id === messages.messageUpdate._id);
  
              if (this.state.messages[key]) {
                const copyMessage = this.state.messages[key];
                copyMessage.seenBy = messages.messageUpdate.seenBy;
                this.setState({messages: {...this.state.messages, [key]: copyMessage}});
              }
            }
            if (messages.lastMessage) {
              const copyLastMessage = this.state.messages[Object.keys(this.state.messages).length - 1];
              copyLastMessage.seenBy = messages.lastMessage.seenBy;
              this.setState({messages: {...this.state.messages, [Object.keys(this.state.messages).length - 1]: copyLastMessage}});
            }
          });

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
        }
      }
    }
  }

  sendMessage = (event) => {
    event.preventDefault();
    if (this.state.message) {
      console.log("send message");
      socket.emit('chat', this.state.roomId, connectUser.username, this.state.message);
      this.setState({message: ""});
    }
  }

  scrollToBottom = (behavior) => {
    if (this.messageList.current)
      this.messageList.current.scrollIntoView({behavior: behavior, block: "end", inline: "nearest"});
  }

  promoteUserToOwner = async (event, usernameToPromote) => {
    event.preventDefault();
    if (usernameToPromote) {
      const res = await promoteUser(this.state.roomId, usernameToPromote);
      if (res.message) {
        this.setState({success: res.message});

        socket.emit('promote user',this.state.roomId);
      } else if (res.error) {
        this.setState({error: res.error});
      }
    }
  }

  toInvite = (event) => {
    event.preventDefault();
    this.props.history.push("/rooms/" + this.state.roomId + "/invite");
  }

  toLeave = (event) => {
    event.preventDefault();
    removeMember(this.state.roomId).then((respond) => {
      console.log("on va attendre");
      setTimeout([this.props.history.push("/rooms")], 1000);
      console.log("on a attendu");
    });
  }

  toRoomCreation = (event) => {
    event.preventDefault();
    this.props.history.push("/room/create");
  }

  setLastMessageRead = () => {
    socket.emit("seenBy", this.state.roomId, connectUser.username);
  }

  disconnect = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    socket.close();
    this.props.history.push("/");
  }

  render() {
    const { roomId, rooms, oldRooms, members, messages, success, error } = this.state;

      var listMembers = <></>;
      var messageBar =  <></>;
      var sizeMessages = 10
      var listMessages = Object.keys(messages).map(key => {
                          return (
                            <div key={messages[key]._id} className="message">
                              <p><b>{messages[key].sender.username}</b>&nbsp;&nbsp;&nbsp;<span className="message-date">{new Date(messages[key].createdAt).toLocaleDateString()}</span></p>
                              <p className="message-content">{messages[key].content}</p>
                              {messages[key].seenBy.length > 0 ? (
                                <p className="text-right message-seenBy"> Vu par <i>{
                                messages[key].seenBy.map((element) => element.username + " ")
                              }</i></p>
                              ) : <></>
                              }
                            </div>
                          );
                        });
      if (connectUser && members.members) {
        console.log("index: ");
        var tmpIndex = 0;
        Object.keys(members.members).map(key => (members.members[key].username === connectUser.username ? tmpIndex = 1 : tmpIndex = 0));
        if (tmpIndex === 1 || members.owner.username === connectUser.username) {
          listMembers = <Col xs={2} id="sidebar-wrapper">
                          <Members roomId={roomId} connectUser={connectUser} members={members} promoteUserToOwner={this.promoteUserToOwner} toInvite={this.toInvite} toLeave={this.toLeave}/>     
                        </Col>;
          messageBar =  <Row>
                          <Col xs={12} id="input-message">
                            <InputGroup className="mb-3">
                              <FormControl
                                id="input-form"
                                placeholder="Send a message..."
                                autoComplete="off"
                                value={this.state.message}
                                onChange={(event) => this.setState({message: event.target.value})}
                                onKeyDown={(event) => event.keyCode === 13 ? this.sendMessage(event) : ''}
                              />
                            </InputGroup>
                          </Col>
                        </Row>
          sizeMessages = 8;
        } else {
          var stop = 0;
          listMessages = Object.keys(messages).map(key => {
            return (
              <>
                {stop == 0 ? 
                  <div key={messages[key]._id} className="message">
                    <p><b>{messages[key].sender.username}</b>&nbsp;&nbsp;&nbsp;<span className="message-date">{new Date(messages[key].createdAt).toLocaleDateString()}</span></p>
                    <p className="message-content">{messages[key].content}</p>
                    {messages[key].seenBy.length > 0 ? (
                      <p className="text-right message-seenBy"> Vu par <i>{
                      messages[key].seenBy.map((element) => {if (element.username == connectUser.username) {
                        stop = 1;
                      }
                      return element.username + " ";
                     })
                    }</i></p>
                    ) : <></>
                    }
                  </div>
                : <></>}
              </>
            );
          });
        }
      }
      
    return (
      <>
        { roomId ? (
          <Container fluid>
            <Row ref={this.messageList}>
                <Col xs={2} id="sidebar-wrapper">      
                  <Rooms roomId={roomId} rooms={rooms} oldRooms={oldRooms} toRoomCreation={this.toRoomCreation} disconnect={this.disconnect} />
                </Col>
                <Col xs={{sizeMessages}} id="page-content-wrapper" >
                  {listMessages}
                  {tmpIndex === 0 && members.owner.username !== connectUser.username ? <p>You left this chat.</p> : <></>}
                </Col>
                {listMembers}
            </Row>
            {messageBar}
            { success !== "" ? (
              <Alert className="alert-message" variant="success" onClose={() => this.setState({success: ""})} dismissible>
                <Alert.Heading>{success}</Alert.Heading>
              </Alert>
            ) : <></>}
            { error !== "" ? (
              <Alert className="alert-message" variant="danger" onClose={() => this.setState({success: ""})} dismissible>
                <Alert.Heading>{error}</Alert.Heading>
              </Alert>
            ) : <></>}
          </Container>
        ) : (
          <Container fluid>
              <Row>
                  <Col xs={2} id="sidebar-wrapper">      
                    <Rooms rooms={rooms} oldRooms={oldRooms} toRoomCreation={this.toRoomCreation} disconnect={this.disconnect}/>
                  </Col>
                  <Col  xs={10} id="page-content-wrapper"></Col>
              </Row>
          </Container>
        )
        }
      </>
    );
  }

  // render() {
  //   const { roomId, rooms, oldRooms, members, messages } = this.state;

  //   return (
  //     <>
  //       { roomId ? (
  //         <Container fluid>
  //           <Row ref={this.messageList}>
  //               <Col xs={2} id="sidebar-wrapper">      
  //                 <Rooms roomId={roomId} rooms={rooms} oldRooms={oldRooms} toRoomCreation={this.toRoomCreation} disconnect={this.disconnect} />
  //               </Col>
  //               <Col xs={8} id="page-content-wrapper" >
  //                 {
  //                   Object.keys(messages).map(key => {
  //                     return (
  //                       <div key={messages[key]._id} className="message">
  //                         <p><b>{messages[key].sender.username}</b>&nbsp;&nbsp;&nbsp;<span className="message-date">{new Date(messages[key].createdAt).toLocaleDateString()}</span></p>
  //                         <p className="message-content">{messages[key].content}</p>
  //                         {messages[key].seenBy.length > 0 ? (
  //                           <p className="text-right message-seenBy"> Vu par <i>{
  //                             messages[key].seenBy.map((element) => element.username + " ")
  //                           }</i></p>
  //                           ) : <></>
  //                         }
  //                       </div>
  //                     );
  //                   })
  //                 }
  //               </Col>
  //               <Col xs={2} id="sidebar-wrapper">
  //                 <Members roomId={roomId} connectUser={connectUser} members={members} promoteUserToOwner={this.promoteUserToOwner} toInvite={this.toInvite} toLeave={this.toLeave}/>     
  //               </Col>
  //           </Row>
  //           <Row>
  //             <Col xs={12} id="input-message">
  //               <InputGroup className="mb-3">
  //                 <FormControl
  //                   id="input-form"
  //                   placeholder="Send a message..."
  //                   value={this.state.message}
  //                   onChange={(event) => this.setState({message: event.target.value})}
  //                   onKeyDown={(event) => event.keyCode === 13 ? this.sendMessage(event) : ''}
  //                 />
  //                 {/* <InputGroup.Append>
  //                   <Button variant="outline-light" onClick={(event) => this.sendMessage(event)}>Send</Button>
  //                 </InputGroup.Append> */}
  //               </InputGroup>
  //             </Col>
  //           </Row>
  //         </Container>
  //       ) : (
  //         <Container fluid>
  //             <Row>
  //                 <Col xs={2} id="sidebar-wrapper">      
  //                   <Rooms rooms={rooms} oldRooms={oldRooms} toRoomCreation={this.toRoomCreation} disconnect={this.disconnect}/>
  //                 </Col>
  //                 <Col  xs={10} id="page-content-wrapper"></Col>
  //             </Row>
  //         </Container>
  //       )
  //       }
  //     </>
  //   );
  // }
}