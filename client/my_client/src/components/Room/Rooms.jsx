import React from 'react';
import { Nav } from 'react-bootstrap';
import './Room.css';

export default class Rooms extends React.Component {

  render() {
    const rooms = Object.keys(this.props.rooms).map(key => {
      return (
       <Nav.Item key={this.props.rooms[key]._id}>
         <Nav.Link href={"/room/" + this.props.rooms[key]._id}>{this.props.rooms[key].name}</Nav.Link>
       </Nav.Item>
      );
    });
    
    return (
      <Nav className="col-md-2 d-md-block bg-light sidebar"
        // onSelect={selectedKey => alert(`selected ${selectedKey}`)}
      >
        <div className="sidebar-sticky"></div>
        {rooms}
      </Nav>
    );
  }

}