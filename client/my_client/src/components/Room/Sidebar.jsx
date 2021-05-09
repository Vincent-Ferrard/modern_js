import React from 'react';
import { Nav } from 'react-bootstrap';
import './Room.css';

export default class Sidebar extends React.Component {


  render() {
    const rooms = Object.keys(this.props.rooms).map(key => {
      return (
       <Nav.Item>
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
        {
          Object.keys(this.props.members).length > 0 ? (
            <div>
              <Nav.Item>
                {this.props.members.owner.username} - (Owner) - {this.props.members.owner.status ? "connected" : "disconnected"}
              </Nav.Item>
              {
                Object.keys(this.props.members.members).map(key => {
                  return (
                    <Nav.Item>
                      {this.props.members.members[key].username} - {this.props.members.members[key].status ? "connected" : "disconnected"}
                    </Nav.Item>
                  );
                })
              }
            </div>
          ) : ("")
        }
      </Nav>
    );
  }
}