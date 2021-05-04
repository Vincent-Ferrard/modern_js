import React from 'react';
import { Nav, Button, Row } from 'react-bootstrap';
import './Rooms.css';

export default class Rooms extends React.Component {

  render() {
    const rooms = Object.keys(this.props.rooms).map(key => {
      return (
       <Nav.Item key={this.props.rooms[key]._id} className="rooms">
         <Nav.Link href={"/rooms/" + this.props.rooms[key]._id}>{this.props.rooms[key].name}</Nav.Link>
       </Nav.Item>
      );
    });
    
    return (
      <Nav className="col-md-2 d-md-block bg-dark sidebar" defaultActiveKey={"/rooms/" + this.props.roomId}>
        {rooms}
        <div id="create-room-button">
          <Row>
            <Button variant="outline-light" className="mr-2" onClick={(event) => this.props.toRoomCreation(event)}>Create a room</Button>
            <Button variant="outline-light" className="ml-2" onClick={(event) => this.props.disconnect(event)}>Disconnection</Button>
          </Row>
        </div>
      </Nav>
    );
  }

}