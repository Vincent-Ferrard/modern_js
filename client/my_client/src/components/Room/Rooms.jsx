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

    const oldRooms = Object.keys(this.props.oldRooms).map(key => {
      return (
        <Nav.Item key={this.props.oldRooms[key]._id} className="rooms">
          <Nav.Link href={"/rooms/" + this.props.oldRooms[key]._id}>{this.props.oldRooms[key].name}</Nav.Link>
        </Nav.Item>
      );
    });
    return (
      <Nav className="col-md-2 d-md-block bg-dark sidebar" defaultActiveKey={"/rooms/" + this.props.roomId}>
        {rooms.length > 0 ? <div className="historic">Current Chat:</div> : <></>}
        {rooms}
        {oldRooms.length > 0 ? <div className="historic">Old Chat:</div> : <></>}
        {oldRooms}
        <div id="create-room-button">
          <Row>
            <Button variant="outline-light" className="create-room mr-2" onClick={(event) => this.props.toRoomCreation(event)}>Create a room</Button>
            <Button variant="outline-danger" className="ml-2" onClick={(event) => this.props.disconnect(event)}>Log out</Button>
          </Row>
        </div>
      </Nav>
    );
  }
}